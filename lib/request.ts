/**
 * Client IP for rate limiting. Never used for authorization.
 *
 * `x-forwarded-for` is attacker-controlled unless a proxy we trust rewrites it,
 * so the first entry is never trusted on its own:
 * - On Vercel the edge network sets `x-real-ip` / `x-vercel-forwarded-for` and
 *   overwrites any client-supplied value.
 * - Elsewhere (the Docker image), set TRUSTED_PROXY_HOPS to the number of
 *   reverse proxies in front of the app. The IP is read from that many entries
 *   from the right, which is the address the outermost trusted proxy saw.
 * - With neither, every request shares one bucket. That is strict but cannot be
 *   bypassed by rotating a header.
 */
export const SHARED_BUCKET = 'shared'

type IpEnv = Readonly<Record<string, string | undefined>>

export function getClientIp(headers: Headers, env: IpEnv = process.env): string {
  if (env.VERCEL) {
    const ip =
      headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() || headers.get('x-real-ip')?.trim()
    return ip || SHARED_BUCKET
  }

  const hops = Number.parseInt(env.TRUSTED_PROXY_HOPS ?? '', 10)
  if (Number.isInteger(hops) && hops > 0) {
    const chain = (headers.get('x-forwarded-for') ?? '')
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
    const ip = chain[chain.length - hops]
    if (ip) return ip
  }

  return SHARED_BUCKET
}
