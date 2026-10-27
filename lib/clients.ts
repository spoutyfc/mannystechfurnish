import 'server-only'

import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { clients } from '@/lib/db/schema'
import { slugSchema } from '@/lib/validation'

/**
 * Public view of a client for the /pay/[slug] page. Deliberately excludes
 * email, phone and Stripe identifiers: anyone holding the link can load it.
 * Lives outside the `'use server'` module so it is not exposed as a callable
 * server action.
 */
export async function getPublicClientBySlug(slug: string) {
  const parsed = slugSchema.safeParse(slug)
  if (!parsed.success) return null

  const rows = await db
    .select({
      slug: clients.slug,
      name: clients.name,
      companyName: clients.companyName,
      planType: clients.planType,
      paymentStatus: clients.paymentStatus,
    })
    .from(clients)
    .where(eq(clients.slug, parsed.data))
    .limit(1)

  return rows[0] ?? null
}
