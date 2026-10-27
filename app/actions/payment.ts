'use server'

import { db } from '@/lib/db'
import { clients } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { getAdminEmail } from '@/lib/admin-auth'
import { getStripe } from '@/lib/stripe'
import { PLAN_DETAILS, type PlanType } from '@/lib/plans'
import { buildCheckoutPlan } from '@/lib/checkout'
import {
  checkoutRequestSchema,
  clientIdSchema,
  createClientSchema,
  paymentStatusSchema,
  type CreateClientInput,
} from '@/lib/validation'

/** Throws if the caller is not an authenticated admin. */
async function requireAdmin(): Promise<string> {
  const email = await getAdminEmail()
  if (!email) throw new Error('Unauthorized')
  return email
}

function resolveBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000')
  )
}

export async function createClientCheckoutSession(slug: string, includeCareplan: boolean) {
  // Public action (the client clicks "pay"). Inputs are validated, and the
  // amount comes only from the server-stored plan, so it cannot be tampered with.
  const input = checkoutRequestSchema.parse({ slug, includeCareplan })

  const found = await db.select().from(clients).where(eq(clients.slug, input.slug)).limit(1)
  if (!found.length) throw new Error('Client not found')

  const clientData = found[0]
  if (clientData.paymentStatus === 'completed') throw new Error('This invoice is already paid')

  const { mode, lineItems } = buildCheckoutPlan(clientData.planType, input.includeCareplan)
  const baseUrl = resolveBaseUrl()

  const session = await getStripe().checkout.sessions.create({
    mode,
    line_items: lineItems,
    customer_email: clientData.email,
    success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/pay/${clientData.slug}?canceled=true`,
    metadata: {
      clientId: String(clientData.id),
      planType: clientData.planType,
      includeCareplan: String(input.includeCareplan),
    },
    ...(mode === 'subscription'
      ? { subscription_data: { metadata: { clientId: String(clientData.id) } } }
      : { payment_intent_data: { metadata: { clientId: String(clientData.id) } } }),
  })

  await db
    .update(clients)
    .set({ stripeCheckoutSessionId: session.id, updatedAt: new Date() })
    .where(eq(clients.id, clientData.id))

  if (!session.url) throw new Error('Stripe did not return a checkout URL')
  return { url: session.url }
}

export async function createClient(raw: CreateClientInput) {
  await requireAdmin()
  const data = createClientSchema.parse(raw)

  const baseSlug =
    data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40)
      .replace(/-+$/g, '') || 'client'
  const slug = `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`

  const [inserted] = await db
    .insert(clients)
    .values({
      slug,
      name: data.name,
      email: data.email,
      phone: data.phone,
      companyName: data.companyName,
      website: data.website,
      projectDescription: data.projectDescription,
      timeline: data.timeline,
      planType: data.planType,
      includeCareplan: data.includeCareplan,
      paymentStatus: 'pending',
    })
    .returning({ id: clients.id })

  return { clientId: inserted.id, slug }
}

export async function getAllClients() {
  await requireAdmin()
  return db.select().from(clients).orderBy(desc(clients.createdAt))
}

export async function getDashboardStats() {
  await requireAdmin()
  const all = await db.select().from(clients)

  const paid = all.filter((c) => c.paymentStatus === 'completed')
  const pending = all.filter((c) => c.paymentStatus === 'pending')

  // Estimate collected revenue from plan type (server source of truth in PLAN_DETAILS).
  const revenue = paid.reduce((sum, c) => {
    const plan = PLAN_DETAILS[c.planType as PlanType] ?? PLAN_DETAILS.option1
    return sum + plan.priceValue
  }, 0)

  return {
    totalClients: all.length,
    paidCount: paid.length,
    pendingCount: pending.length,
    revenue,
  }
}

export async function deleteClient(clientId: number) {
  await requireAdmin()
  const id = clientIdSchema.parse(clientId)
  await db.delete(clients).where(eq(clients.id, id))
  return { success: true }
}

export async function updateClientPaymentStatus(
  clientId: number,
  status: 'pending' | 'completed' | 'failed',
) {
  await requireAdmin()
  const id = clientIdSchema.parse(clientId)
  const next = paymentStatusSchema.parse(status)
  await db
    .update(clients)
    .set({ paymentStatus: next, updatedAt: new Date() })
    .where(eq(clients.id, id))
  return { success: true }
}
