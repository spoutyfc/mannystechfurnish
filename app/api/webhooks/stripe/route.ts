import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { clients } from '@/lib/db/schema'

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

if (!stripeSecretKey) {
  console.error('STRIPE_SECRET_KEY is not set')
}

const stripe = new Stripe(stripeSecretKey || 'sk_test_', {
  apiVersion: '2024-04-10',
})

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: 'Missing signature or webhook secret' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error(`Webhook signature verification failed: ${errorMessage}`)
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    )
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const clientId = session.metadata?.clientId
      
      // Update client payment status to completed
      if (clientId) {
        try {
          await db
            .update(clients)
            .set({
              paymentStatus: 'completed',
              stripeCustomerId: session.customer as string,
              stripeCheckoutSessionId: session.id,
              stripeSubscriptionId: session.subscription as string | undefined,
              updatedAt: new Date(),
            })
            .where(eq(clients.id, clientId))
          
          console.log(`Payment completed for client: ${clientId}`)
        } catch (error) {
          console.error('Failed to update client:', error)
        }
      }
      break
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session
      const clientId = session.metadata?.clientId
      
      if (clientId) {
        try {
          await db
            .update(clients)
            .set({
              paymentStatus: 'failed',
              updatedAt: new Date(),
            })
            .where(eq(clients.id, clientId))
        } catch (error) {
          console.error('Failed to update expired client:', error)
        }
      }
      break
    }

    case 'customer.subscription.created': {
      const subscription = event.data.object as Stripe.Subscription
      const clientId = subscription.metadata?.clientId

      if (clientId) {
        try {
          await db
            .update(clients)
            .set({ stripeSubscriptionId: subscription.id })
            .where(eq(clients.id, clientId))
        } catch (error) {
          console.error('Failed to save subscription:', error)
        }
      }
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      console.log(`Subscription updated: ${subscription.id}`)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      console.log(`Subscription canceled: ${subscription.id}`)
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const clientId = paymentIntent.metadata?.clientId
      
      if (clientId) {
        try {
          await db
            .update(clients)
            .set({ paymentStatus: 'failed' })
            .where(eq(clients.id, clientId))
        } catch (error) {
          console.error('Failed to update failed payment:', error)
        }
      }
      console.log(`Payment failed for: ${paymentIntent.id}`)
      break
    }

    default:
      // Unexpected event type
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
