import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Uses the Upstash/Vercel KV env vars already present in the project.
const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

const redis = url && token ? new Redis({ url, token }) : null

// 5 submissions per 10 minutes per IP.
const limiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '10 m'),
      prefix: 'ratelimit:contact',
      analytics: false,
    })
  : null

export async function checkContactRateLimit(identifier: string) {
  // If Redis isn't configured, allow the request (fail open) so the form still works.
  if (!limiter) return { success: true, remaining: 999 }
  const { success, remaining } = await limiter.limit(identifier)
  return { success, remaining }
}

// Stricter limiter for admin login: 8 attempts per 10 minutes per IP to slow
// brute-force / credential-stuffing attacks.
const loginLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(8, '10 m'),
      prefix: 'ratelimit:adminlogin',
      analytics: false,
    })
  : null

export async function checkLoginRateLimit(identifier: string) {
  if (!loginLimiter) return { success: true, remaining: 999 }
  const { success, remaining } = await loginLimiter.limit(identifier)
  return { success, remaining }
}
