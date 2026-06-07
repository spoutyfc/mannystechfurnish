import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { contactInquiries } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getAdminEmail } from '@/lib/admin-auth'

// Update status (mark read / new / resolved)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await getAdminEmail())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const { status } = await req.json()

  if (!['new', 'read', 'resolved'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  await db
    .update(contactInquiries)
    .set({ status })
    .where(eq(contactInquiries.id, id))

  return NextResponse.json({ success: true })
}

// Delete a submission
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await getAdminEmail())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params

  await db.delete(contactInquiries).where(eq(contactInquiries.id, id))

  return NextResponse.json({ success: true })
}
