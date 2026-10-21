import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createSessionToken, verifySessionToken } from '@/lib/admin-auth'

describe('admin session tokens', () => {
  beforeEach(() => {
    vi.stubEnv('ADMIN_SESSION_SECRET', 'test-secret-for-unit-tests-only')
  })
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.useRealTimers()
  })

  it('round-trips the admin email through a signed token', async () => {
    const token = await createSessionToken('owner@example.com')
    expect(await verifySessionToken(token)).toBe('owner@example.com')
  })

  it.each([undefined, null, '', 'a.b', 'a.b.c.d'])('rejects malformed token %j', async (token) => {
    expect(await verifySessionToken(token)).toBeNull()
  })

  it('rejects a token whose email was swapped (signature mismatch)', async () => {
    const token = await createSessionToken('owner@example.com')
    const [, exp, sig] = token.split('.')
    const forgedEmail = Buffer.from('attacker@example.com').toString('base64url')
    expect(await verifySessionToken(`${forgedEmail}.${exp}.${sig}`)).toBeNull()
  })

  it('rejects a token whose expiry was extended', async () => {
    const token = await createSessionToken('owner@example.com')
    const [email, exp, sig] = token.split('.')
    expect(await verifySessionToken(`${email}.${Number(exp) + 1}.${sig}`)).toBeNull()
  })

  it('rejects a token signed with a different secret', async () => {
    const token = await createSessionToken('owner@example.com')
    vi.stubEnv('ADMIN_SESSION_SECRET', 'rotated-secret')
    expect(await verifySessionToken(token)).toBeNull()
  })

  it('rejects an expired token', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
    const token = await createSessionToken('owner@example.com')
    vi.setSystemTime(new Date('2026-01-08T00:00:01Z')) // 7 days + 1 second
    expect(await verifySessionToken(token)).toBeNull()
  })

  it('fails closed when no secret is configured', async () => {
    vi.stubEnv('ADMIN_SESSION_SECRET', '')
    vi.stubEnv('BETTER_AUTH_SECRET', '')
    await expect(createSessionToken('owner@example.com')).rejects.toThrow(/must be set/)
    await expect(verifySessionToken('a.1.b')).rejects.toThrow(/must be set/)
  })
})
