import { describe, expect, it, vi } from 'vitest'

describe('MemoryRateLimiter', () => {
  it('allows up to the limit inside the window, then blocks', async () => {
    const { MemoryRateLimiter } = await import('@/lib/rate-limit')
    const limiter = new MemoryRateLimiter(2, 1000, () => 0)
    expect(limiter.check('a').success).toBe(true)
    expect(limiter.check('a').success).toBe(true)
    expect(limiter.check('a')).toEqual({ success: false, remaining: 0 })
    expect(limiter.check('b').success).toBe(true)
  })

  it('lets requests through again once the window slides past', async () => {
    const { MemoryRateLimiter } = await import('@/lib/rate-limit')
    let now = 0
    const limiter = new MemoryRateLimiter(1, 1000, () => now)
    expect(limiter.check('a').success).toBe(true)
    now = 999
    expect(limiter.check('a').success).toBe(false)
    now = 1000
    expect(limiter.check('a').success).toBe(true)
  })
})

describe('checkLoginRateLimit without Redis configured', () => {
  it('still enforces the limit instead of failing open', async () => {
    vi.resetModules()
    vi.stubEnv('KV_REST_API_URL', '')
    vi.stubEnv('KV_REST_API_TOKEN', '')
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '')
    const { checkLoginRateLimit } = await import('@/lib/rate-limit')
    const results = []
    for (let i = 0; i < 9; i++) results.push((await checkLoginRateLimit('203.0.113.7')).success)
    expect(results.slice(0, 8).every(Boolean)).toBe(true)
    expect(results[8]).toBe(false)
    vi.unstubAllEnvs()
  })
})

describe('checkLoginRateLimit when Redis errors', () => {
  it('falls back to the in-process limit instead of allowing unlimited attempts', async () => {
    vi.resetModules()
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://redis.invalid')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'test-token')
    vi.stubEnv('KV_REST_API_URL', '')
    vi.stubEnv('KV_REST_API_TOKEN', '')
    vi.doMock('@upstash/redis', () => ({ Redis: class {} }))
    vi.doMock('@upstash/ratelimit', () => {
      class Ratelimit {
        static slidingWindow() {
          return {}
        }
        async limit(): Promise<never> {
          throw new Error('ECONNREFUSED')
        }
      }
      return { Ratelimit }
    })
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { checkLoginRateLimit } = await import('@/lib/rate-limit')
    const results = []
    for (let i = 0; i < 9; i++) results.push((await checkLoginRateLimit('203.0.113.8')).success)
    expect(results[8]).toBe(false)
    errSpy.mockRestore()
    vi.doUnmock('@upstash/redis')
    vi.doUnmock('@upstash/ratelimit')
    vi.unstubAllEnvs()
  })
})
