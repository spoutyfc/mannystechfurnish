import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken, ADMIN_COOKIE } from '@/lib/admin-auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect /admin/* routes — never /admin-login
  if (pathname.startsWith('/admin/')) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value
    const email = await verifySessionToken(token)

    if (!email) {
      const url = new URL('/admin-login', request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path+'],
}
