import { db } from '@/lib/db'
import { services } from '@/lib/db/schema'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const servicesList = await db
      .select()
      .from(services)
      .limit(100)

    return NextResponse.json(servicesList)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}
