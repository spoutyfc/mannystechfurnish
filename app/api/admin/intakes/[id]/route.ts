import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { projectIntakes } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getAdminEmail } from '@/lib/admin-auth'

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminEmail())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  await db.delete(projectIntakes).where(eq(projectIntakes.id, id))
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminEmail())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const body = await req.json()
  const status = body?.paymentStatus
  if (!['pending', 'paid', 'abandoned'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }
  await db
    .update(projectIntakes)
    .set({ paymentStatus: status, updatedAt: new Date() })
    .where(eq(projectIntakes.id, id))
  return NextResponse.json({ ok: true })
}
