import { NextRequest, NextResponse } from 'next/server'
import { getAdminEmail } from '@/lib/admin-auth'
import { sendCustomEmail } from '@/lib/email'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  // Only an authenticated admin (verified signed session) may send mail.
  if (!(await getAdminEmail())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { to?: string; subject?: string; heading?: string; message?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const to = (body.to || '').trim()
  const subject = (body.subject || '').trim()
  const message = (body.message || '').trim()
  const heading = (body.heading || '').trim()

  if (!to || !isValidEmail(to)) {
    return NextResponse.json({ error: 'A valid recipient email is required.' }, { status: 400 })
  }
  if (!subject || subject.length > 200) {
    return NextResponse.json({ error: 'A subject (under 200 chars) is required.' }, { status: 400 })
  }
  if (!message || message.length > 5000) {
    return NextResponse.json({ error: 'A message (under 5000 chars) is required.' }, { status: 400 })
  }

  try {
    await sendCustomEmail({ to, subject, heading: heading || undefined, body: message })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[v0] admin send-email failed:', err)
    return NextResponse.json(
      { error: 'Failed to send. Check that RESEND_API_KEY and your sending domain are configured.' },
      { status: 500 },
    )
  }
}
