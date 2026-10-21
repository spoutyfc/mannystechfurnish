import { db } from '@/lib/db'
import { portfolioProjects } from '@/lib/db/schema'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // For now, get the first user's portfolio (in a real app, this would be based on domain/subdomain)
    const userProjects = await db
      .select()
      .from(portfolioProjects)
      .limit(100)

    return NextResponse.json(userProjects)
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 })
  }
}
