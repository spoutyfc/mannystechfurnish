'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

/**
 * Resolve the current user id from the Better Auth session.
 * Every server action that touches user data MUST go through this helper
 * — it is the only thing standing between one user and another's rows.
 */
async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export { getUserId }
