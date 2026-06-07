'use server'

import { db } from '@/lib/db'
import { clients } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
})

// Price IDs from Stripe
const STRIPE_PRICES = {
  option1: 'price_1TdITWK40rUg2ebUcW26SvsI', // $1,299 one-time
  careplan: 'price_1TdJBwK40rUg2ebUgPWlzsfX', // $70/mo
  option2_build: 'price_1TdITeK40rUg2ebU93d0nMVp', // $700 one-time
  option2_monthly: 'price_1TdJC4K40rUg2ebUYdZy9zsl', // $120/mo (3 billing cycles only)
}

export async function createClientCheckoutSession(
  clientId: string,
  planType: 'option1' | 'option2',
  includeCareplan: boolean,
) {
  try {
    // Get client details
    const client = await db
      .select()
      .from(clients)
      .where(eq(clients.id, clientId))
      .limit(1)

    if (!client.length) {
      throw new Error('Client not found')
    }

    const clientData = client[0]

    // Build line items based on plan selection
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    if (planType === 'option1') {
      // Option 1: $1,299 one-time
      lineItems.push({
        price: STRIPE_PRICES.option1,
        quantity: 1,
      })

      // Add care plan if selected
      if (includeCareplan) {
        lineItems.push({
          price: STRIPE_PRICES.careplan,
          quantity: 1,
        })
      }
    } else if (planType === 'option2') {
      // Option 2: $700 build fee (one-time) + $120/mo subscription (3 months only)
      lineItems.push({
        price: STRIPE_PRICES.option2_build,
        quantity: 1,
      })
      lineItems.push({
        price: STRIPE_PRICES.option2_monthly,
        quantity: 1,
        billing_cycles: 3, // Only charge for 3 months, then auto-cancel
      })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: planType === 'option2' ? 'subscription' : 'payment',
      line_items: lineItems,
      customer_email: clientData.email,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pay/${clientData.slug}?canceled=true`,
      metadata: {
        clientId: clientData.id,
        planType,
        includeCareplan: includeCareplan.toString(),
      },
    })

    // Save session ID to client
    await db
      .update(clients)
      .set({ stripeCheckoutSessionId: session.id })
      .where(eq(clients.id, clientId))

    return { sessionId: session.id, clientSlug: clientData.slug }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

export async function getClientBySlug(slug: string) {
  try {
    const result = await db
      .select()
      .from(clients)
      .where(eq(clients.slug, slug))
      .limit(1)

    return result.length ? result[0] : null
  } catch (error) {
    console.error('Error fetching client:', error)
    throw error
  }
}

export async function createClient(data: {
  name: string
  email: string
  phone?: string
  companyName?: string
  website?: string
  projectDescription?: string
  timeline?: string
  planType: 'option1' | 'option2'
  includeCareplan?: boolean
}) {
  try {
    const slug = `${data.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
    const clientId = uuidv4()

    await db.insert(clients).values({
      id: clientId,
      userId: 'admin', // You'll need to update this with actual user context
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

    return { clientId, slug }
  } catch (error) {
    console.error('Error creating client:', error)
    throw error
  }
}

export async function updateClientPaymentStatus(
  clientId: string,
  status: 'pending' | 'completed' | 'failed',
) {
  try {
    await db
      .update(clients)
      .set({ paymentStatus: status })
      .where(eq(clients.id, clientId))
  } catch (error) {
    console.error('Error updating payment status:', error)
    throw error
  }
}
