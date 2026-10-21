import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const mocks = vi.hoisted(() => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(() => ({ values: vi.fn(() => ({ onConflictDoNothing: vi.fn() })) })),
    update: vi.fn(),
    delete: vi.fn(),
    execute: vi.fn(),
  },
  getAdminEmail: vi.fn(),
  verifyTurnstile: vi.fn(),
  checkContactRateLimit: vi.fn(),
  sendOwnerNotification: vi.fn(),
  sendClientConfirmation: vi.fn(),
  sendCustomEmail: vi.fn(),
  constructEvent: vi.fn(),
  headers: vi.fn(),
}))

vi.mock('@/lib/db', () => ({ db: mocks.db }))
vi.mock('@/lib/admin-auth', () => ({ getAdminEmail: mocks.getAdminEmail }))
vi.mock('@/lib/turnstile', () => ({ verifyTurnstile: mocks.verifyTurnstile }))
vi.mock('@/lib/rate-limit', () => ({ checkContactRateLimit: mocks.checkContactRateLimit }))
vi.mock('@/lib/email', () => ({
  sendOwnerNotification: mocks.sendOwnerNotification,
  sendClientConfirmation: mocks.sendClientConfirmation,
  sendCustomEmail: mocks.sendCustomEmail,
}))
vi.mock('@/lib/stripe', () => ({ getStripe: () => ({ webhooks: { constructEvent: mocks.constructEvent } }) }))
vi.mock('next/headers', () => ({ headers: mocks.headers }))

import { POST as contactPOST } from '@/app/api/public/contact/route'
import { POST as sendEmailPOST } from '@/app/api/admin/send-email/route'
import { PATCH as submissionPATCH, DELETE as submissionDELETE } from '@/app/api/admin/submissions/[id]/route'
import { GET as submissionsGET } from '@/app/api/admin/submissions/route'
import { POST as setupPOST } from '@/app/api/admin-setup/route'
import { POST as webhookPOST } from '@/app/api/webhooks/stripe/route'

function jsonRequest(url: string, body: unknown, init: { method?: string; headers?: Record<string, string> } = {}) {
  return new NextRequest(url, {
    method: init.method ?? 'POST',
    headers: { 'content-type': 'application/json', ...init.headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

const params = { params: Promise.resolve({ id: 'inquiry_1' }) }

beforeEach(() => {
  vi.clearAllMocks()
  mocks.verifyTurnstile.mockResolvedValue({ success: true })
  mocks.checkContactRateLimit.mockResolvedValue({ success: true })
})
afterEach(() => vi.unstubAllEnvs())

describe('POST /api/public/contact', () => {
  const valid = { name: 'Ada', email: 'ada@example.com', subject: 'Site', message: 'Hello' }

  it('rejects invalid JSON with 400', async () => {
    const res = await contactPOST(jsonRequest('http://localhost/api/public/contact', '{nope'))
    expect(res.status).toBe(400)
  })

  it('rejects a non-string field (object injection) with 400 and stores nothing', async () => {
    const res = await contactPOST(
      jsonRequest('http://localhost/api/public/contact', { ...valid, name: { toString: 1 } }),
    )
    expect(res.status).toBe(400)
    expect(mocks.db.insert).not.toHaveBeenCalled()
  })

  it('silently accepts honeypot submissions without storing or emailing', async () => {
    const res = await contactPOST(jsonRequest('http://localhost/api/public/contact', { ...valid, company: 'bot' }))
    expect(res.status).toBe(200)
    expect(mocks.db.insert).not.toHaveBeenCalled()
    expect(mocks.sendOwnerNotification).not.toHaveBeenCalled()
  })

  it('rejects a failed Turnstile challenge', async () => {
    mocks.verifyTurnstile.mockResolvedValue({ success: false })
    const res = await contactPOST(jsonRequest('http://localhost/api/public/contact', valid))
    expect(res.status).toBe(400)
    expect(mocks.db.insert).not.toHaveBeenCalled()
  })

  it('returns 429 when the IP is rate limited', async () => {
    mocks.checkContactRateLimit.mockResolvedValue({ success: false })
    const res = await contactPOST(jsonRequest('http://localhost/api/public/contact', valid))
    expect(res.status).toBe(429)
    expect(mocks.db.insert).not.toHaveBeenCalled()
  })

  it('stores the inquiry and still succeeds when email delivery fails', async () => {
    mocks.sendOwnerNotification.mockRejectedValue(new Error('resend down'))
    mocks.sendClientConfirmation.mockResolvedValue(undefined)
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = await contactPOST(jsonRequest('http://localhost/api/public/contact', valid))
    expect(res.status).toBe(200)
    expect(mocks.db.insert).toHaveBeenCalledTimes(2) // system user + inquiry
    errSpy.mockRestore()
  })
})

describe('admin routes deny unauthenticated callers', () => {
  beforeEach(() => mocks.getAdminEmail.mockResolvedValue(null))

  it('GET /api/admin/submissions', async () => {
    expect((await submissionsGET()).status).toBe(401)
    expect(mocks.db.select).not.toHaveBeenCalled()
  })

  it('PATCH /api/admin/submissions/[id]', async () => {
    const res = await submissionPATCH(
      jsonRequest('http://localhost/api/admin/submissions/inquiry_1', { status: 'read' }, { method: 'PATCH' }),
      params,
    )
    expect(res.status).toBe(401)
    expect(mocks.db.update).not.toHaveBeenCalled()
  })

  it('DELETE /api/admin/submissions/[id]', async () => {
    const res = await submissionDELETE(
      new NextRequest('http://localhost/api/admin/submissions/inquiry_1', { method: 'DELETE' }),
      params,
    )
    expect(res.status).toBe(401)
    expect(mocks.db.delete).not.toHaveBeenCalled()
  })

  it('POST /api/admin/send-email', async () => {
    const res = await sendEmailPOST(
      jsonRequest('http://localhost/api/admin/send-email', { to: 'a@b.co', subject: 's', message: 'm' }),
    )
    expect(res.status).toBe(401)
    expect(mocks.sendCustomEmail).not.toHaveBeenCalled()
  })
})

describe('PATCH /api/admin/submissions/[id] as admin', () => {
  it('rejects an unknown status', async () => {
    mocks.getAdminEmail.mockResolvedValue('owner@example.com')
    const res = await submissionPATCH(
      jsonRequest('http://localhost/api/admin/submissions/inquiry_1', { status: 'archived' }, { method: 'PATCH' }),
      params,
    )
    expect(res.status).toBe(400)
    expect(mocks.db.update).not.toHaveBeenCalled()
  })
})

describe('POST /api/admin-setup', () => {
  const body = { email: 'owner@example.com', password: 'a-long-enough-password' }

  it('is disabled (404) when ADMIN_SETUP_SECRET is not configured, even with no header', async () => {
    vi.stubEnv('ADMIN_SETUP_SECRET', '')
    const res = await setupPOST(jsonRequest('http://localhost/api/admin-setup', body))
    expect(res.status).toBe(404)
    expect(mocks.db.execute).not.toHaveBeenCalled()
  })

  it('rejects a wrong secret', async () => {
    vi.stubEnv('ADMIN_SETUP_SECRET', 'correct-secret')
    const res = await setupPOST(
      jsonRequest('http://localhost/api/admin-setup', body, { headers: { 'x-setup-secret': 'wrong' } }),
    )
    expect(res.status).toBe(401)
    expect(mocks.db.execute).not.toHaveBeenCalled()
  })

  it('rejects a weak password even with the right secret', async () => {
    vi.stubEnv('ADMIN_SETUP_SECRET', 'correct-secret')
    const res = await setupPOST(
      jsonRequest(
        'http://localhost/api/admin-setup',
        { ...body, password: 'short' },
        { headers: { 'x-setup-secret': 'correct-secret' } },
      ),
    )
    expect(res.status).toBe(400)
    expect(mocks.db.execute).not.toHaveBeenCalled()
  })
})

describe('POST /api/webhooks/stripe', () => {
  function webhookRequest() {
    return new Request('http://localhost/api/webhooks/stripe', { method: 'POST', body: '{}' })
  }

  it('rejects requests without a Stripe signature', async () => {
    vi.stubEnv('STRIPE_WEBHOOK_SECRET', 'whsec_test')
    mocks.headers.mockResolvedValue(new Headers())
    const res = await webhookPOST(webhookRequest())
    expect(res.status).toBe(400)
    expect(mocks.constructEvent).not.toHaveBeenCalled()
  })

  it('rejects a forged signature without leaking verification details', async () => {
    vi.stubEnv('STRIPE_WEBHOOK_SECRET', 'whsec_test')
    mocks.headers.mockResolvedValue(new Headers({ 'stripe-signature': 't=1,v1=bad' }))
    mocks.constructEvent.mockImplementation(() => {
      throw new Error('No signatures found matching the expected signature for payload')
    })
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = await webhookPOST(webhookRequest())
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'Invalid signature' })
    expect(mocks.db.update).not.toHaveBeenCalled()
    errSpy.mockRestore()
  })

  it('returns 500 so Stripe retries when the database update fails', async () => {
    vi.stubEnv('STRIPE_WEBHOOK_SECRET', 'whsec_test')
    mocks.headers.mockResolvedValue(new Headers({ 'stripe-signature': 't=1,v1=ok' }))
    mocks.constructEvent.mockReturnValue({
      id: 'evt_1',
      type: 'checkout.session.completed',
      data: { object: { id: 'cs_1', metadata: { clientId: '7' }, customer: 'cus_1', subscription: null } },
    })
    mocks.db.select.mockImplementation(() => {
      throw new Error('connection refused')
    })
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = await webhookPOST(webhookRequest())
    expect(res.status).toBe(500)
    errSpy.mockRestore()
  })
})
