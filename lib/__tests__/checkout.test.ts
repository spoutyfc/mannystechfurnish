import { describe, expect, it } from 'vitest'
import { buildCheckoutPlan } from '@/lib/checkout'
import { STRIPE_PRICES } from '@/lib/plans'

describe('buildCheckoutPlan', () => {
  it('option1 without care plan is a one-time payment for the build price only', () => {
    expect(buildCheckoutPlan('option1', false)).toEqual({
      mode: 'payment',
      lineItems: [{ price: STRIPE_PRICES.option1, quantity: 1 }],
    })
  })

  it('option1 with care plan becomes a subscription that adds the care plan price', () => {
    const plan = buildCheckoutPlan('option1', true)
    expect(plan.mode).toBe('subscription')
    expect(plan.lineItems.map((i) => i.price)).toEqual([STRIPE_PRICES.option1, STRIPE_PRICES.careplan])
  })

  it('option2 is always build fee + monthly plan, and ignores the care plan flag', () => {
    for (const includeCareplan of [true, false]) {
      const plan = buildCheckoutPlan('option2', includeCareplan)
      expect(plan.mode).toBe('subscription')
      expect(plan.lineItems.map((i) => i.price)).toEqual([
        STRIPE_PRICES.option2_build,
        STRIPE_PRICES.option2_monthly,
      ])
    }
  })

  it('throws on an unknown plan instead of charging for a different one', () => {
    expect(() => buildCheckoutPlan('option3', false)).toThrow()
    expect(() => buildCheckoutPlan('', false)).toThrow()
  })

  it('never sends a client-supplied amount: every line item is a stored price id', () => {
    const plan = buildCheckoutPlan('option1', true)
    for (const item of plan.lineItems) {
      expect(item).not.toHaveProperty('price_data')
      expect(Object.values(STRIPE_PRICES)).toContain(item.price)
    }
  })
})
