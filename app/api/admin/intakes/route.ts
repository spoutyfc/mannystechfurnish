import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { projectIntakes } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { getAdminEmail } from '@/lib/admin-auth'

export async function GET() {
  if (!(await getAdminEmail())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rows = await db.select().from(projectIntakes).orderBy(desc(projectIntakes.createdAt))

  return NextResponse.json({ intakes: rows })
}
