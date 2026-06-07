/**
 * Cloudflare Turnstile server-side verification.
 *
 * Turnstile is a free, privacy-friendly CAPTCHA alternative. The browser solves
 * an invisible/managed challenge and sends a one-time token. We MUST verify that
 * token here on the server with the secret key — a client-only check could be
 * bypassed, but a token that fails this server call is rejected, so it cannot be
 * spoofed. Each token is single-use and short-lived.
 */
const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export type TurnstileResult = {
  success: boolean
  /** present only when the feature isn't configured (so we can fail safe in dev) */
  notConfigured?: boolean
  errorCodes?: string[]
}

export async function verifyTurnstile(
  token: string | undefined | null,
  remoteIp?: string | null,
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY

  // If the secret isn't set, the feature is effectively disabled. We treat this
  // as "not configured" so the form still works locally, but the contact route
  // decides how strict to be.
  if (!secret) return { success: false, notConfigured: true }

  if (!token) return { success: false, errorCodes: ['missing-input-response'] }

  const form = new URLSearchParams()
  form.append('secret', secret)
  form.append('response', token)
  if (remoteIp) form.append('remoteip', remoteIp)

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    })
    const data = (await res.json()) as {
      success: boolean
      'error-codes'?: string[]
    }
    return { success: Boolean(data.success), errorCodes: data['error-codes'] }
  } catch (err) {
    console.error('[v0] Turnstile verification request failed:', err)
    return { success: false, errorCodes: ['internal-error'] }
  }
}
