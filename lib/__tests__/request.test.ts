import { describe, expect, it } from 'vitest'
import { getClientIp } from '@/lib/request'

describe('getClientIp', () => {
  it('uses the first x-forwarded-for hop', () => {
    expect(getClientIp(new Headers({ 'x-forwarded-for': '203.0.113.7, 10.0.0.1' }))).toBe('203.0.113.7')
  })

  it('falls back to x-real-ip, then a shared bucket', () => {
    expect(getClientIp(new Headers({ 'x-real-ip': '198.51.100.2' }))).toBe('198.51.100.2')
    expect(getClientIp(new Headers())).toBe('anonymous')
  })
})
