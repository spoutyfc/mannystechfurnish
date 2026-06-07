import { cookies } from 'next/headers'

/**
 * Signed admin sessions.
 *
 * SECURITY: The previous implementation stored the admin email in plaintext in
 * the cookie and every check only verified the cookie *existed* — meaning anyone
 * could forge `admin_session=whatever` and gain full admin access. This module
 * issues an HMAC-signed, expiring token that cannot be forged without the server
 * secret, and verifies the signature on every request.
 *
 * Uses Web Crypto (crypto.subtle) so it runs in both the Edge middleware and
 * Node route handlers.
 */

export const ADMIN_COOKIE = 'admin_session'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7 // 7 days

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.BETTER_AUTH_SECRET
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET (or BETTER_AUTH_SECRET) must be set')
  }
  return secret
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  let str = ''
  for (let i = 0; i < arr.length; i++) str += String.fromCharCode(arr[i])
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function hmac(data: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data))
  return toBase64Url(sig)
}

/** Constant-time string comparison to avoid timing attacks. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

/** Create a signed token for the given admin email. */
export async function createSessionToken(email: string): Promise<string> {
  const exp = Date.now() + MAX_AGE_SECONDS * 1000
  const payload = `${toBase64Url(new TextEncoder().encode(email))}.${exp}`
  const sig = await hmac(payload)
  return `${payload}.${sig}`
}

/** Verify a signed token. Returns the admin email if valid, else null. */
export async function verifySessionToken(token: string | undefined | null): Promise<string | null> {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [emailB64, expStr, sig] = parts
  const payload = `${emailB64}.${expStr}`

  const expected = await hmac(payload)
  if (!safeEqual(sig, expected)) return null

  const exp = Number(expStr)
  if (!Number.isFinite(exp) || Date.now() > exp) return null

  try {
    const b64 = emailB64.replace(/-/g, '+').replace(/_/g, '/')
    return decodeURIComponent(
      atob(b64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    )
  } catch {
    return null
  }
}

/** Server-side guard for route handlers. Returns admin email or null. */
export async function getAdminEmail(): Promise<string | null> {
  const store = await cookies()
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value)
}

export const SESSION_MAX_AGE = MAX_AGE_SECONDS
