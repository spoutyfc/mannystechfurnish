import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { adminSetupSchema } from '@/lib/validation'

/** Constant-time comparison of the setup secret header. */
function secretMatches(provided: string | null, expected: string): boolean {
  if (!provided) return false
  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

/**
 * One-off bootstrap endpoint that creates (or resets) an admin account.
 * Disabled unless ADMIN_SETUP_SECRET is set, so it fails closed in any
 * environment where nobody deliberately turned it on.
 */
export async function POST(req: NextRequest) {
  const expected = process.env.ADMIN_SETUP_SECRET
  if (!expected) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (!secretMatches(req.headers.get('x-setup-secret'), expected)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const parsed = adminSetupSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'A valid email and a password of at least 12 characters are required' },
      { status: 400 },
    )
  }

  try {
    const { email, password } = parsed.data
    const passwordHash = await bcrypt.hash(password, 12)

    await db.execute(
      sql`INSERT INTO admin_users (email, password_hash) VALUES (${email}, ${passwordHash})
          ON CONFLICT (email) DO UPDATE SET password_hash = ${passwordHash}`,
    )

    return NextResponse.json({ success: true, message: 'Admin user created' })
  } catch (error) {
    console.error('Admin setup error:', error)
    return NextResponse.json({ error: 'Setup failed' }, { status: 500 })
  }
}
