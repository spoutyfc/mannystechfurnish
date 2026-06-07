'use server'

import { db } from '@/lib/db'
import { portfolioProjects } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getPortfolioProjects() {
  const userId = await getUserId()
  return db
    .select()
    .from(portfolioProjects)
    .where(eq(portfolioProjects.userId, userId))
    .orderBy(portfolioProjects.displayOrder)
}

export async function createPortfolioProject(data: {
  title: string
  description: string
  imageUrl?: string
  projectUrl?: string
  technologies?: string[]
}) {
  const userId = await getUserId()
  const id = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  await db.insert(portfolioProjects).values({
    id,
    userId,
    title: data.title,
    description: data.description,
    imageUrl: data.imageUrl,
    projectUrl: data.projectUrl,
    technologies: data.technologies ? JSON.stringify(data.technologies) : null,
    displayOrder: 0,
  })

  revalidatePath('/dashboard/portfolio')
  return { id }
}

export async function updatePortfolioProject(
  projectId: string,
  data: Partial<{
    title: string
    description: string
    imageUrl: string
    projectUrl: string
    technologies: string[]
    displayOrder: number
  }>
) {
  const userId = await getUserId()

  await db
    .update(portfolioProjects)
    .set(data)
    .where(and(eq(portfolioProjects.id, projectId), eq(portfolioProjects.userId, userId)))

  revalidatePath('/dashboard/portfolio')
}

export async function deletePortfolioProject(projectId: string) {
  const userId = await getUserId()

  await db
    .delete(portfolioProjects)
    .where(and(eq(portfolioProjects.id, projectId), eq(portfolioProjects.userId, userId)))

  revalidatePath('/dashboard/portfolio')
}
