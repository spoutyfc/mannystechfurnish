import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  let client
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      )
    }

    client = await pool.connect()

    // Find user
    const userResult = await client.query('SELECT id FROM "user" WHERE email = $1', [email])
    if (userResult.rows.length === 0) {
      client.release()
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const userId = userResult.rows[0].id

    // Find account with password
    const accountResult = await client.query(
      'SELECT password FROM account WHERE "userId" = $1 AND "providerId" = $2',
      [userId, 'credential']
    )

    if (accountResult.rows.length === 0) {
      client.release()
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const storedPassword = accountResult.rows[0].password
    if (!storedPassword) {
      client.release()
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, storedPassword)
    if (!passwordMatch) {
      client.release()
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create session
    const sessionId = uuidv4()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    const token = uuidv4()

    await client.query(
      'INSERT INTO session (id, "userId", "expiresAt", token) VALUES ($1, $2, $3, $4)',
      [sessionId, userId, expiresAt, token]
    )

    client.release()

    // Set secure cookie
    const response = NextResponse.json(
      { success: true, userId },
      { status: 200 }
    )

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[v0] Signin error:', error)
    if (client) client.release()
    return NextResponse.json(
      { error: 'Failed to sign in' },
      { status: 500 }
    )
  }
}
