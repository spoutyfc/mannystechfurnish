import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { contactInquiries } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getAdminEmail } from '@/lib/admin-auth'
import { submissionStatusSchema } from '@/lib/validation'

// Update status (mark read / new / resolved)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminEmail())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params

  let body: { status?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const status = submissionStatusSchema.safeParse(body?.status)
  if (!status.success) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const updated = await db
    .update(contactInquiries)
    .set({ status: status.data })
    .where(eq(contactInquiries.id, id))
    .returning({ id: contactInquiries.id })

  if (!updated.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}

// Delete a submission
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminEmail())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params

  await db.delete(contactInquiries).where(eq(contactInquiries.id, id))

  return NextResponse.json({ success: true })
}
