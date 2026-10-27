import { db } from '@/lib/db'
import { contactInquiries, user } from '@/lib/db/schema'
import { NextRequest, NextResponse } from 'next/server'
import { sendOwnerNotification, sendClientConfirmation } from '@/lib/email'
import { checkContactRateLimit } from '@/lib/rate-limit'
import { verifyTurnstile } from '@/lib/turnstile'
import { contactSchema } from '@/lib/validation'
import { getClientIp, SHARED_BUCKET } from '@/lib/request'

/** Public inquiries belong to a fixed system user (contact_inquiries has a FK to "user"). */
const SYSTEM_USER_ID = 'system_public_inquiries'

export async function POST(request: NextRequest) {
  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // Honeypot: bots fill the hidden "company" field. Pretend success, do nothing.
    if (body && typeof body === 'object' && (body as { company?: unknown }).company) {
      return NextResponse.json({ success: true })
    }

    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            'Please include your name, a valid email, a subject and a message (up to 5000 characters).',
        },
        { status: 400 },
      )
    }
    const { name, email, phone, subject, message, turnstileToken } = parsed.data

    const ip = getClientIp(request.headers)

    // Bot protection: verify the Cloudflare Turnstile token server-side. A
    // missing/invalid token is rejected, so the check cannot be bypassed.
    // Only forward a real address; the shared rate-limit bucket name is not an IP.
    const captcha = await verifyTurnstile(turnstileToken, ip === SHARED_BUCKET ? undefined : ip)
    if (!captcha.success && !captcha.notConfigured) {
      return NextResponse.json(
        { error: 'Verification failed. Please complete the challenge and try again.' },
        { status: 400 },
      )
    }

    // Rate limiting per IP
    const { success: allowed } = await checkContactRateLimit(ip)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again in a few minutes.' },
        { status: 429 },
      )
    }

    await db
      .insert(user)
      .values({ id: SYSTEM_USER_ID, name: 'System', email: 'system@localhost', emailVerified: true })
      .onConflictDoNothing()

    const id = `inquiry_${crypto.randomUUID()}`
    await db.insert(contactInquiries).values({
      id,
      userId: SYSTEM_USER_ID,
      name,
      email,
      phone: phone ?? null,
      subject,
      message,
      status: 'new',
    })

    // Send emails (don't fail the request if email delivery has an issue —
    // the submission is already saved to the DB and visible in /admin).
    const payload = { name, email, subject, message, phone: phone ?? null }
    const results = await Promise.allSettled([
      sendOwnerNotification(payload),
      sendClientConfirmation(payload),
    ])
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.error(`contact email ${i === 0 ? 'owner' : 'client'} failed:`, r.reason)
      }
    })

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Error creating inquiry:', error)
    return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 500 })
  }
}
