import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { getAdminEmail } from '@/lib/admin-auth'
import { hashPassword } from '@/lib/passwords'
import { changePasswordSchema } from '@/lib/validation'

type AdminRow = { email: string; password_hash?: string; passwordHash?: string }

export async function POST(req: NextRequest) {
  try {
    // Must be a signed-in admin. getAdminEmail verifies the HMAC session cookie.
    const email = await getAdminEmail()
    if (!email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const parsed = changePasswordSchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Enter your current password and a new password of 12 to 200 characters' },
        { status: 400 },
      )
    }
    const { currentPassword, newPassword } = parsed.data

    const result = await db.execute(
      sql`SELECT * FROM admin_users WHERE lower(email) = ${email.toLowerCase()}`,
    )
    const rows = (result as unknown as { rows?: AdminRow[] }).rows ?? (result as unknown as AdminRow[])
    const adminUser = rows[0]
    if (!adminUser) {
      return NextResponse.json({ error: 'Admin account not found' }, { status: 404 })
    }

    const storedHash = adminUser.password_hash || adminUser.passwordHash || ''
    const match = storedHash !== '' && (await bcrypt.compare(currentPassword, storedHash))
    if (!match) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
    }

    const newHash = await hashPassword(newPassword)
    await db.execute(
      sql`UPDATE admin_users SET password_hash = ${newHash} WHERE lower(email) = ${email.toLowerCase()}`,
    )

    return NextResponse.json({ success: true, message: 'Password updated' })
  } catch (error) {
    console.error('[admin-change-password] failed:', error)
    return NextResponse.json({ error: 'Could not update password' }, { status: 500 })
  }
}
