import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-setup-secret')
    
    // Check setup secret from environment
    if (secret !== process.env.ADMIN_SETUP_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Insert admin user
    await db.execute(
      sql`INSERT INTO admin_users (email, password_hash) VALUES (${email}, ${passwordHash})
          ON CONFLICT (email) DO UPDATE SET password_hash = ${passwordHash}`
    )

    return NextResponse.json({ success: true, message: 'Admin user created' })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: 'Setup failed' },
      { status: 500 }
    )
  }
}
