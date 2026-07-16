import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { getAdminEmail } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  try {
    // Must be a signed-in admin. getAdminEmail verifies the HMAC session cookie.
    const email = await getAdminEmail()
    if (!email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await req.json()
    const currentPassword = typeof body?.currentPassword === 'string' ? body.currentPassword : ''
    const newPassword = typeof body?.newPassword === 'string' ? body.newPassword : ''

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Both current and new password are required' }, { status: 400 })
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 })
    }

    const result = await db.execute(
      sql`SELECT * FROM admin_users WHERE lower(email) = ${email.toLowerCase()}`,
    )
    const rows = (result as any).rows || result
    const adminUser = rows[0]
    if (!adminUser) {
      return NextResponse.json({ error: 'Admin account not found' }, { status: 404 })
    }

    const storedHash = adminUser.password_hash || adminUser.passwordHash
    const match = await bcrypt.compare(currentPassword, storedHash)
    if (!match) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
    }

    const newHash = await bcrypt.hash(newPassword, 10)
    await db.execute(
      sql`UPDATE admin_users SET password_hash = ${newHash} WHERE lower(email) = ${email.toLowerCase()}`,
    )

    return NextResponse.json({ success: true, message: 'Password updated' })
  } catch (error) {
    console.error('[v0] Change password error:', error)
    return NextResponse.json({ error: 'Could not update password' }, { status: 500 })
  }
}
