import { NextResponse } from 'next/server'

// Liveness probe for the container HEALTHCHECK and uptime monitors.
// Deliberately does not touch the database or third-party APIs, so an
// upstream outage does not get the container restarted in a loop.
export const dynamic = 'force-dynamic'

export function GET() {
  return NextResponse.json({ status: 'ok' }, { headers: { 'cache-control': 'no-store' } })
}
