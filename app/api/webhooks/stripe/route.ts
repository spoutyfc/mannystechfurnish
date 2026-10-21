import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { and, eq, sql, type SQL } from 'drizzle-orm'
import { db } from '@/lib/db'
import { clients } from '@/lib/db/schema'
import { getStripe } from '@/lib/stripe'
import {
  paymentTransition,
  type CheckoutPaymentStatus,
  type PaymentEvent,
} from '@/lib/payment-status'

/** Metadata clientId is stored as a string; the DB id is a serial integer. */
function parseClientId(raw: string | undefined | null): number | null {
  if (!raw) return null
  const n = Number(raw)
  return Number.isInteger(n) && n > 0 ? n : null
}

/**
 * Apply a payment transition in a single conditional UPDATE, so the guard and
 * the write are atomic. Concurrent or out-of-order events cannot downgrade a
 * paid row, because the "not completed" check runs inside the same statement.
 */
async function applyStatus(
  clientId: number,
  event: PaymentEvent,
  extra: Partial<typeof clients.$inferInsert> = {},
) {
  const t = paymentTransition(event)
  const conditions: SQL[] = [eq(clients.id, clientId)]
  if (t.unlessCompleted) {
    conditions.push(sql`${clients.paymentStatus} IS DISTINCT FROM 'completed'`)
  }
  if (t.onlyForSession !== undefined) {
    conditions.push(eq(clients.stripeCheckoutSessionId, t.onlyForSession))
  }

  await db
    .update(clients)
    .set({ ...extra, paymentStatus: t.status, updatedAt: new Date() })
    .where(and(...conditions))
}

function checkoutPaymentStatus(session: Stripe.Checkout.Session): CheckoutPaymentStatus {
  return session.payment_status === 'paid' || session.payment_status === 'no_payment_required'
    ? session.payment_status
    : 'unpaid'
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
        const session = event.data.object
        const clientId = parseClientId(session.metadata?.clientId)
        if (clientId !== null) {
          await applyStatus(
            clientId,
            {
              type: 'checkout.session.completed',
              sessionId: session.id,
              paymentStatus: checkoutPaymentStatus(session),
            },
            {
              stripeCustomerId: (session.customer as string) || null,
              stripeCheckoutSessionId: session.id,
              stripeSubscriptionId: (session.subscription as string) || null,
            },
          )
        }
        break
      }

      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object
        const clientId = parseClientId(session.metadata?.clientId)
        if (clientId !== null) {
          await applyStatus(
            clientId,
            { type: 'checkout.session.async_payment_succeeded', sessionId: session.id },
            { stripeCheckoutSessionId: session.id },
          )
        }
        break
      }

      case 'checkout.session.async_payment_failed':
      case 'checkout.session.expired': {
        const session = event.data.object
        const clientId = parseClientId(session.metadata?.clientId)
        if (clientId !== null) {
          await applyStatus(clientId, { type: event.type, sessionId: session.id })
        }
        break
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object
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
        const paymentIntent = event.data.object
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
