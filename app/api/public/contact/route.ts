import { db } from '@/lib/db'
import { contactInquiries, user } from '@/lib/db/schema'
import { NextRequest, NextResponse } from 'next/server'
import { sendOwnerNotification, sendClientConfirmation } from '@/lib/email'
import { checkContactRateLimit } from '@/lib/rate-limit'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message, company } = body

    // Honeypot: bots fill hidden "company" field. Pretend success, do nothing.
    if (company) {
      return NextResponse.json({ success: true })
    }

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!EMAIL_RE.test(String(email))) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }
    if (String(message).length > 5000 || String(name).length > 200) {
      return NextResponse.json({ error: 'Input too long' }, { status: 400 })
    }

    // Rate limiting per IP
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'anonymous'
    const { success: allowed } = await checkContactRateLimit(ip)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again in a few minutes.' },
        { status: 429 }
      )
    }

    // Persist to DB (associate with an admin/system user)
    const id = `inquiry_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
    let userId: string
    const users = await db.select().from(user).limit(1)
    if (users.length > 0) {
      userId = users[0].id
    } else {
      const systemUserId = 'system_public_inquiries'
      try {
        await db
          .insert(user)
          .values({ id: systemUserId, name: 'System', email: 'system@localhost', emailVerified: true })
          .onConflictDoNothing()
      } catch {
        // user may already exist
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

    // Send emails (don't fail the request if email delivery has an issue —
    // the submission is already saved to the DB and visible in /admin).
    const payload = { name, email, subject, message, phone: phone || null }
    const results = await Promise.allSettled([
      sendOwnerNotification(payload),
      sendClientConfirmation(payload),
    ])
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.error(`[v0] contact email ${i === 0 ? 'owner' : 'client'} failed:`, r.reason)
      }
    })

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('[v0] Error creating inquiry:', error)
    return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 500 })
  }
}
