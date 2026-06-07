'use server'

import { db } from '@/lib/db'
import { services } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getServices() {
  const userId = await getUserId()
  return db
    .select()
    .from(services)
    .where(eq(services.userId, userId))
    .orderBy(services.displayOrder)
}

export async function createService(data: {
  title: string
  description: string
  icon?: string
  pricingType?: 'one-time' | 'recurring' | 'both'
}) {
  const userId = await getUserId()
  const id = `service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  await db.insert(services).values({
    id,
    userId,
    title: data.title,
    description: data.description,
    icon: data.icon,
    pricingType: data.pricingType || 'one-time',
    displayOrder: 0,
  })

  revalidatePath('/dashboard/services')
  return { id }
}

export async function updateService(
  serviceId: string,
  data: Partial<{
    title: string
    description: string
    icon: string
    pricingType: string
    displayOrder: number
  }>
) {
  const userId = await getUserId()

  await db
    .update(services)
    .set(data)
    .where(and(eq(services.id, serviceId), eq(services.userId, userId)))

  revalidatePath('/dashboard/services')
}

export async function deleteService(serviceId: string) {
  const userId = await getUserId()

  await db
    .delete(services)
    .where(and(eq(services.id, serviceId), eq(services.userId, userId)))

  revalidatePath('/dashboard/services')
}
