'use server'

import { db } from '@/lib/db'
import { contactInquiries, user } from '@/lib/db/schema'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate unique ID for the inquiry
    const id = `inquiry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Get the first admin user, or create a system user for public inquiries
    let userId: string
    const users = await db.select().from(user).limit(1)
    
    if (users.length > 0) {
      userId = users[0].id
    } else {
      // Create a system user for public inquiries if no users exist
      const systemUserId = 'system_public_inquiries'
      try {
        await db.insert(user).values({
          id: systemUserId,
          name: 'System',
          email: 'system@localhost',
          emailVerified: true,
        }).onConflictDoNothing()
      } catch {
        // User might already exist
      }
      userId = systemUserId
    }

    await db.insert(contactInquiries).values({
      id,
      userId,
      name,
      email,
      phone: phone || null,
      subject,
      message,
      status: 'new',
    })

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Error creating inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to create inquiry' },
      { status: 500 }
    )
  }
}
