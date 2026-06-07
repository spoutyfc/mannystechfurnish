import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { contactInquiries } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

async function isAdmin() {
  const cookieStore = await cookies()
  return Boolean(cookieStore.get('admin_session'))
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rows = await db
    .select()
    .from(contactInquiries)
    .orderBy(desc(contactInquiries.createdAt))

  return NextResponse.json({ submissions: rows })
}
