import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export type RateLimitResult = { success: boolean; remaining: number }

type Policy = { prefix: string; limit: number; windowMs: number }

const CONTACT: Policy = { prefix: 'ratelimit:contact', limit: 5, windowMs: 10 * 60_000 }
const LOGIN: Policy = { prefix: 'ratelimit:adminlogin', limit: 8, windowMs: 10 * 60_000 }

/**
 * Per-process sliding-window limiter. It is the fallback when Upstash is not
 * configured or is unreachable, so an outage degrades the limit to one instance
 * instead of switching it off. On serverless each warm instance has its own
 * window, which is weaker than Redis but never "unlimited".
 */
export class MemoryRateLimiter {
  private hits = new Map<string, number[]>()

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
    private readonly now: () => number = Date.now,
  ) {}

  check(key: string): RateLimitResult {
    const t = this.now()
    const recent = (this.hits.get(key) ?? []).filter((at) => t - at < this.windowMs)
    if (recent.length >= this.limit) {
      this.hits.set(key, recent)
      return { success: false, remaining: 0 }
    }
    recent.push(t)
    this.hits.set(key, recent)
    if (this.hits.size > 10_000) this.prune(t)
    return { success: true, remaining: this.limit - recent.length }
  }

  private prune(t: number) {
    for (const [key, times] of this.hits) {
      if (times.every((at) => t - at >= this.windowMs)) this.hits.delete(key)
    }
  }
}

// Uses the Upstash/Vercel KV env vars when present.
const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
const redis = url && token ? new Redis({ url, token }) : null

function makeLimiter(policy: Policy) {
  const memory = new MemoryRateLimiter(policy.limit, policy.windowMs)
  const remote = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(policy.limit, `${policy.windowMs / 60_000} m`),
        prefix: policy.prefix,
        analytics: false,
      })
    : null

  return async function check(identifier: string): Promise<RateLimitResult> {
    if (!remote) return memory.check(identifier)
    try {
      const { success, remaining } = await remote.limit(identifier)
      return { success, remaining }
    } catch (err) {
      console.error(`[rate-limit] ${policy.prefix}: Redis unavailable, using in-process limit:`, err)
      return memory.check(identifier)
    }
  }
}

/** Contact form: 5 submissions per 10 minutes per client. */
export const checkContactRateLimit = makeLimiter(CONTACT)

/** Admin login: 8 attempts per 10 minutes per client, to slow credential stuffing. */
export const checkLoginRateLimit = makeLimiter(LOGIN)
