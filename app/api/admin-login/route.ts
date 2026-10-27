import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { createSessionToken, ADMIN_COOKIE, SESSION_MAX_AGE } from '@/lib/admin-auth'
import { getDummyHash } from '@/lib/passwords'
import { checkLoginRateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/request'
import { loginSchema } from '@/lib/validation'

type AdminRow = { email: string; password_hash?: string; passwordHash?: string }

export async function POST(req: NextRequest) {
  try {
    // Rate limit login attempts per client to slow brute-force / credential stuffing.
    const { success: allowed } = await checkLoginRateLimit(getClientIp(req.headers))
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please wait a few minutes and try again.' },
        { status: 429 },
      )
    }

    const parsed = loginSchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }
    const { email, password } = parsed.data

    const result = await db.execute(sql`SELECT * FROM admin_users WHERE lower(email) = ${email}`)
    const rows = (result as unknown as { rows?: AdminRow[] }).rows ?? (result as unknown as AdminRow[])
    const adminUser = rows[0]

    // Always run a bcrypt compare at the stored-hash cost, even for unknown emails,
    // so response timing does not reveal which accounts exist.
    const storedHash = adminUser?.password_hash || adminUser?.passwordHash || (await getDummyHash())
    const passwordMatch = await bcrypt.compare(password, storedHash)

    if (!adminUser || !passwordMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const token = await createSessionToken(adminUser.email || email)
    const response = NextResponse.json({ success: true, redirect: '/admin' })

    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: true,
      // Lax blocks cross-site POSTs carrying the admin cookie (CSRF).
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[admin-login] failed:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
