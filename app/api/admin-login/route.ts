import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { createSessionToken, ADMIN_COOKIE, SESSION_MAX_AGE } from '@/lib/admin-auth'
import { checkLoginRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    // Rate limit login attempts per IP to stop brute-force / credential stuffing.
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'anonymous'
    const { success: allowed } = await checkLoginRateLimit(ip)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please wait a few minutes and try again.' },
        { status: 429 },
      )
    }

    const body = await req.json()
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body?.password === 'string' ? body.password : ''

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const result = await db.execute(
      sql`SELECT * FROM admin_users WHERE lower(email) = ${email}`,
    )
    const rows = (result as any).rows || result
    const adminUser = rows[0]

    // Always run a bcrypt compare (even when user not found) to avoid leaking
    // which emails exist via response timing.
    const storedHash =
      adminUser?.password_hash ||
      adminUser?.passwordHash ||
      '$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva'
    const passwordMatch = await bcrypt.compare(password, storedHash)

    if (!adminUser || !passwordMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const token = await createSessionToken(adminUser.email || email)
    const response = NextResponse.json({ success: true, redirect: '/admin' })

    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none', // Required for cross-site contexts like the v0 preview iframe
      maxAge: SESSION_MAX_AGE,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[v0] Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
