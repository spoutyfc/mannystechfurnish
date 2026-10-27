import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { contactSchema } from '@/lib/validation'
import { composeInquiryMessage } from '@/lib/inquiry'

/** Security review (aec/growth-partner): contact endpoint fail-closed and input hardening. */
const mocks = vi.hoisted(() => ({
  db: { insert: vi.fn(() => ({ values: vi.fn(() => ({ onConflictDoNothing: vi.fn() })) })) },
  verifyTurnstile: vi.fn(),
  checkContactRateLimit: vi.fn(),
  sendOwnerNotification: vi.fn(),
  sendClientConfirmation: vi.fn(),
}))
vi.mock('@/lib/db', () => ({ db: mocks.db }))
vi.mock('@/lib/turnstile', () => ({ verifyTurnstile: mocks.verifyTurnstile }))
vi.mock('@/lib/rate-limit', () => ({ checkContactRateLimit: mocks.checkContactRateLimit }))
vi.mock('@/lib/email', () => ({
  sendOwnerNotification: mocks.sendOwnerNotification,
  sendClientConfirmation: mocks.sendClientConfirmation,
}))

import { POST } from '@/app/api/public/contact/route'

const valid = { name: 'Ada', email: 'victim@example.com', subject: 'Site', message: 'Hello' }
const req = (body: unknown) =>
  new NextRequest('http://localhost/api/public/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })

beforeEach(() => {
  vi.clearAllMocks()
  mocks.checkContactRateLimit.mockResolvedValue({ success: true })
  mocks.verifyTurnstile.mockResolvedValue({ success: false, notConfigured: true })
})
afterEach(() => vi.unstubAllEnvs())

describe('contact route fails closed in every production runtime', () => {
  it('self-hosted production (Docker: NODE_ENV=production, no VERCEL_ENV) without a Turnstile secret refuses and sends no auto-reply', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('VERCEL_ENV', '')
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = await POST(req(valid))
    expect(res.status).toBe(503)
    expect(mocks.sendClientConfirmation).not.toHaveBeenCalled()
  })
})

describe('contact input hardening', () => {
  it.each(['javascript:alert(1)', 'data:text/html,<script>alert(1)</script>', 'vbscript:x', 'localhost', 'https://'])(
    'rejects non-http(s) or hostless website %s',
    (website) => {
      expect(contactSchema.safeParse({ ...valid, website }).success).toBe(false)
    },
  )

  it('normalises a bare domain to https and percent-encodes markup', () => {
    const r = contactSchema.safeParse({ ...valid, website: 'acme.com/"><script>' })
    expect(r.success).toBe(true)
    expect(r.success && r.data.website).toMatch(/^https:\/\/acme\.com\//)
    expect(r.success && r.data.website).not.toMatch(/[<>"]/)
  })

  it('strips CR/LF from name and subject (header injection)', () => {
    const r = contactSchema.parse({ ...valid, name: 'A\r\nBcc: x@y.z', subject: 'S\nX-H: 1' })
    expect(r.name).not.toMatch(/[\r\n]/)
    expect(r.subject).not.toMatch(/[\r\n]/)
  })

  it('caps the composed stored message', () => {
    const r = contactSchema.parse({ ...valid, firm: 'f'.repeat(200), message: 'm'.repeat(5000), website: 'acme.com' })
    expect(composeInquiryMessage(r).length).toBeLessThanOrEqual(6000)
  })
})
