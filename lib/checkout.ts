import type Stripe from 'stripe'
import { STRIPE_PRICES } from '@/lib/plans'
import { planTypeSchema } from '@/lib/validation'

export type CheckoutPlan = {
  mode: 'payment' | 'subscription'
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[]
}

/**
 * Turn a stored plan type into Stripe line items. Prices come only from
 * server-side constants, so a client can never change what it is charged.
 *
 * - option1: one-time build, plus the optional monthly care plan.
 * - option2: build fee plus the managed monthly plan (care plan is included,
 *   so the flag is ignored).
 *
 * Throws on an unknown plan instead of silently falling through to another one.
 */
export function buildCheckoutPlan(planType: string, includeCareplan: boolean): CheckoutPlan {
  const plan = planTypeSchema.parse(planType)

  if (plan === 'option1') {
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      { price: STRIPE_PRICES.option1, quantity: 1 },
    ]
    if (includeCareplan) lineItems.push({ price: STRIPE_PRICES.careplan, quantity: 1 })
    return { mode: includeCareplan ? 'subscription' : 'payment', lineItems }
  }

  return {
    mode: 'subscription',
    lineItems: [
      { price: STRIPE_PRICES.option2_build, quantity: 1 },
      { price: STRIPE_PRICES.option2_monthly, quantity: 1 },
    ],
  }
}
