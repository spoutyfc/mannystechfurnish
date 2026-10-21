import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { clients } from '@/lib/db/schema'
import { getStripe } from '@/lib/stripe'
import { nextPaymentStatus, type PaymentEvent } from '@/lib/payment-status'

/** Metadata clientId is stored as a string; the DB id is a serial integer. */
function parseClientId(raw: string | undefined | null): number | null {
  if (!raw) return null
  const n = Number(raw)
  return Number.isInteger(n) && n > 0 ? n : null
}

async function applyStatus(
  clientId: number,
  event: PaymentEvent,
  extra: Partial<typeof clients.$inferInsert> = {},
) {
  const [current] = await db
    .select({
      paymentStatus: clients.paymentStatus,
      stripeCheckoutSessionId: clients.stripeCheckoutSessionId,
    })
    .from(clients)
    .where(eq(clients.id, clientId))
    .limit(1)
  if (!current) return

  const status = nextPaymentStatus(current, event)
  if (status === null) return

  await db
    .update(clients)
    .set({ ...extra, paymentStatus: status, updatedAt: new Date() })
    .where(eq(clients.id, clientId))
}

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature')

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err instanceof Error ? err.message : err)
    // Do not echo verification details back to the caller.
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const clientId = parseClientId(session.metadata?.clientId)
        if (clientId !== null) {
          await applyStatus(
            clientId,
            { type: 'checkout.session.completed' },
            {
              stripeCustomerId: (session.customer as string) || null,
              stripeCheckoutSessionId: session.id,
              stripeSubscriptionId: (session.subscription as string) || null,
            },
          )
        }
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        const clientId = parseClientId(session.metadata?.clientId)
        if (clientId !== null) {
          await applyStatus(clientId, { type: 'checkout.session.expired', sessionId: session.id })
        }
        break
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        const clientId = parseClientId(subscription.metadata?.clientId)
        if (clientId !== null) {
          await db
            .update(clients)
            .set({ stripeSubscriptionId: subscription.id, updatedAt: new Date() })
            .where(eq(clients.id, clientId))
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const clientId = parseClientId(paymentIntent.metadata?.clientId)
        if (clientId !== null) {
          await applyStatus(clientId, { type: 'payment_intent.payment_failed' })
        }
        break
      }

      default:
        // Other subscribed events are acknowledged without action.
        break
    }
  } catch (error) {
    // Returning 5xx makes Stripe retry, instead of silently losing a payment update.
    console.error(`Failed to process Stripe event ${event.id} (${event.type}):`, error)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
