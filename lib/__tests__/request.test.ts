import { describe, expect, it } from 'vitest'
import { getClientIp, SHARED_BUCKET } from '@/lib/request'

const spoofed = { 'x-forwarded-for': '1.2.3.4, 203.0.113.7', 'x-real-ip': '198.51.100.2' }

describe('getClientIp', () => {
  it('uses the Vercel-set address on Vercel and ignores a client-supplied x-forwarded-for', () => {
    const env = { VERCEL: '1' } as NodeJS.ProcessEnv
    expect(getClientIp(new Headers({ ...spoofed, 'x-vercel-forwarded-for': '192.0.2.9' }), env)).toBe(
      '192.0.2.9',
    )
    expect(getClientIp(new Headers(spoofed), env)).toBe('198.51.100.2')
  })

  it('reads the entry added by the outermost trusted proxy when TRUSTED_PROXY_HOPS is set', () => {
    const one = { TRUSTED_PROXY_HOPS: '1' } as NodeJS.ProcessEnv
    const two = { TRUSTED_PROXY_HOPS: '2' } as NodeJS.ProcessEnv
    expect(getClientIp(new Headers(spoofed), one)).toBe('203.0.113.7')
    expect(getClientIp(new Headers(spoofed), two)).toBe('1.2.3.4')
  })

  it('never trusts headers without a configured proxy, so rotating them cannot dodge the limit', () => {
    const env = {} as NodeJS.ProcessEnv
    expect(getClientIp(new Headers(spoofed), env)).toBe(SHARED_BUCKET)
    expect(getClientIp(new Headers({ 'x-forwarded-for': '9.9.9.9' }), env)).toBe(SHARED_BUCKET)
  })

  it('falls back to the shared bucket when the chain is shorter than the hop count', () => {
    const env = { TRUSTED_PROXY_HOPS: '3' } as NodeJS.ProcessEnv
    expect(getClientIp(new Headers({ 'x-forwarded-for': '203.0.113.7' }), env)).toBe(SHARED_BUCKET)
  })
})
