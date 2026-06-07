'use server'

import { db } from '@/lib/db'
import { clients } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import Stripe from 'stripe'
import { getAdminEmail } from '@/lib/admin-auth'
import { stripe } from '@/lib/stripe'
import { STRIPE_PRICES, PLAN_DETAILS, type PlanType } from '@/lib/plans'

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

export async function createClientCheckoutSession(
  slug: string,
  includeCareplan: boolean,
) {
  // Public action (the client clicks "pay"), so we look up by slug and trust
  // only the server-stored plan — the amount can never be tampered with.
  const found = await db.select().from(clients).where(eq(clients.slug, slug)).limit(1)
  if (!found.length) throw new Error('Client not found')

  const clientData = found[0]
  const planType = clientData.planType as PlanType

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

  if (planType === 'option1') {
    lineItems.push({ price: STRIPE_PRICES.option1, quantity: 1 })
    if (includeCareplan) lineItems.push({ price: STRIPE_PRICES.careplan, quantity: 1 })
  } else {
    lineItems.push({ price: STRIPE_PRICES.option2_build, quantity: 1 })
    lineItems.push({ price: STRIPE_PRICES.option2_monthly, quantity: 1 })
  }

  // option2 always has a recurring item; option1 only when the care plan is added.
  const isSubscription = planType === 'option2' || includeCareplan
  const baseUrl = resolveBaseUrl()

  const session = await stripe.checkout.sessions.create({
    mode: isSubscription ? 'subscription' : 'payment',
    line_items: lineItems,
    customer_email: clientData.email,
    success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/pay/${clientData.slug}?canceled=true`,
    metadata: {
      clientId: String(clientData.id),
      planType,
      includeCareplan: includeCareplan.toString(),
    },
    ...(isSubscription
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

export async function getClientBySlug(slug: string) {
  const result = await db.select().from(clients).where(eq(clients.slug, slug)).limit(1)
  return result.length ? result[0] : null
}

export async function createClient(data: {
  name: string
  email: string
  phone?: string
  companyName?: string
  website?: string
  projectDescription?: string
  timeline?: string
  planType: PlanType
  includeCareplan?: boolean
}) {
  await requireAdmin()

  const baseSlug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'client'
  const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 7)}`

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
      includeCareplan: data.includeCareplan || false,
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

  // Estimate collected revenue from plan type (server source of truth).
  const revenue = paid.reduce((sum, c) => {
    const base = c.planType === 'option1' ? 1299 : 700
    return sum + base
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
  await db.delete(clients).where(eq(clients.id, clientId))
  return { success: true }
}

export async function updateClientPaymentStatus(
  clientId: number,
  status: 'pending' | 'completed' | 'failed',
) {
  await requireAdmin()
  await db
    .update(clients)
    .set({ paymentStatus: status, updatedAt: new Date() })
    .where(eq(clients.id, clientId))
  return { success: true }
}
