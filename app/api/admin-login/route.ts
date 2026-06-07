import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Query raw SQL to get admin user
    const result = await db.execute(
      sql`SELECT * FROM admin_users WHERE email = ${email}`
    )

    // Drizzle execute returns { rows: [...] }
    const rows = (result as any).rows || result
    const adminUser = rows[0]

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password - handle both camelCase and snake_case
    const storedHash = adminUser.password_hash || adminUser.passwordHash
    const passwordMatch = await bcrypt.compare(password, storedHash)

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create response with secure cookie
    const response = NextResponse.json({ success: true, redirect: '/admin/clients' })
    
    response.cookies.set('admin_session', email, {
      httpOnly: true,
      secure: true,
      sameSite: 'none', // Required for cross-site contexts like v0 preview iframe
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
