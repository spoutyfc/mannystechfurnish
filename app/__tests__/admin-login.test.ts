import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const mocks = vi.hoisted(() => ({
  execute: vi.fn(),
  checkLoginRateLimit: vi.fn(),
  compare: vi.fn(),
}))

vi.mock('@/lib/db', () => ({ db: { execute: mocks.execute } }))
vi.mock('@/lib/rate-limit', () => ({ checkLoginRateLimit: mocks.checkLoginRateLimit }))
vi.mock('bcryptjs', async (importOriginal) => {
  const real = await importOriginal<typeof import('bcryptjs')>()
  return { default: { ...real.default, compare: mocks.compare } }
})

import { POST as loginPOST } from '@/app/api/admin-login/route'
import { BCRYPT_COST } from '@/lib/passwords'

function login(body: unknown) {
  return new NextRequest('http://localhost/api/admin-login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv('ADMIN_SESSION_SECRET', 'x'.repeat(32))
  mocks.checkLoginRateLimit.mockResolvedValue({ success: true, remaining: 7 })
  mocks.compare.mockResolvedValue(false)
})

describe('POST /api/admin-login', () => {
  it('returns 429 before touching the database once the limit is hit', async () => {
    mocks.checkLoginRateLimit.mockResolvedValue({ success: false, remaining: 0 })
    const res = await loginPOST(login({ email: 'a@example.com', password: 'x' }))
    expect(res.status).toBe(429)
    expect(mocks.execute).not.toHaveBeenCalled()
  })

  it.each([
    ['malformed JSON', '{not json'],
    ['a missing password', { email: 'a@example.com' }],
    ['an invalid email', { email: 'nope', password: 'x' }],
    ['a password over 200 characters', { email: 'a@example.com', password: 'x'.repeat(201) }],
  ])('rejects %s with 400 and never runs bcrypt', async (_label, body) => {
    const res = await loginPOST(login(body))
    expect(res.status).toBe(400)
    expect(mocks.compare).not.toHaveBeenCalled()
    expect(mocks.execute).not.toHaveBeenCalled()
  })

  it('compares unknown emails against a hash of the same cost as real ones', async () => {
    mocks.execute.mockResolvedValue({ rows: [] })
    const res = await loginPOST(login({ email: 'ghost@example.com', password: 'guess' }))
    expect(res.status).toBe(401)
    expect(mocks.compare).toHaveBeenCalledTimes(1)
    const hash = mocks.compare.mock.calls[0][1] as string
    expect(hash.slice(0, 7)).toMatch(/^\$2[aby]\$\d\d\$$/)
    expect(Number(hash.slice(4, 6))).toBe(BCRYPT_COST)
  })

  it('sets an httpOnly, secure, SameSite=Lax session cookie on success', async () => {
    mocks.execute.mockResolvedValue({ rows: [{ email: 'admin@example.com', password_hash: '$2a$12$stored' }] })
    mocks.compare.mockResolvedValue(true)
    const res = await loginPOST(login({ email: 'Admin@Example.com', password: 'correct horse battery' }))
    expect(res.status).toBe(200)
    const cookie = res.headers.get('set-cookie') ?? ''
    expect(cookie).toMatch(/HttpOnly/i)
    expect(cookie).toMatch(/Secure/i)
    expect(cookie).toMatch(/SameSite=lax/i)
  })
})
