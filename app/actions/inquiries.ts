'use server'

import { db } from '@/lib/db'
import { contactInquiries } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getInquiries() {
  const userId = await getUserId()
  return db
    .select()
    .from(contactInquiries)
    .where(eq(contactInquiries.userId, userId))
    .orderBy(contactInquiries.createdAt)
}

export async function updateInquiryStatus(
  inquiryId: string,
  status: 'new' | 'read' | 'resolved'
) {
  const userId = await getUserId()

  await db
    .update(contactInquiries)
    .set({ status })
    .where(and(eq(contactInquiries.id, inquiryId), eq(contactInquiries.userId, userId)))

  revalidatePath('/dashboard/inquiries')
}

export async function deleteInquiry(inquiryId: string) {
  const userId = await getUserId()

  await db
    .delete(contactInquiries)
    .where(and(eq(contactInquiries.id, inquiryId), eq(contactInquiries.userId, userId)))

  revalidatePath('/dashboard/inquiries')
}
