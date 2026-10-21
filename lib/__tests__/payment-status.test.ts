import { describe, expect, it } from 'vitest'
import { nextPaymentStatus } from '@/lib/payment-status'

const pending = { paymentStatus: 'pending', stripeCheckoutSessionId: 'cs_current' }
const paid = { paymentStatus: 'completed', stripeCheckoutSessionId: 'cs_current' }

describe('nextPaymentStatus', () => {
  it('marks a pending client completed when checkout completes', () => {
    expect(nextPaymentStatus(pending, { type: 'checkout.session.completed' })).toBe('completed')
  })

  it('treats a retried completion as idempotent', () => {
    expect(nextPaymentStatus(paid, { type: 'checkout.session.completed' })).toBe('completed')
  })

  it('marks failed when the session we are waiting on expires', () => {
    expect(
      nextPaymentStatus(pending, { type: 'checkout.session.expired', sessionId: 'cs_current' }),
    ).toBe('failed')
  })

  it('ignores expiry of an older abandoned session', () => {
    expect(
      nextPaymentStatus(pending, { type: 'checkout.session.expired', sessionId: 'cs_old' }),
    ).toBeNull()
  })

  it('never downgrades a paid client on a late expiry or failure event', () => {
    expect(
      nextPaymentStatus(paid, { type: 'checkout.session.expired', sessionId: 'cs_current' }),
    ).toBeNull()
    expect(nextPaymentStatus(paid, { type: 'payment_intent.payment_failed' })).toBeNull()
  })

  it('marks a pending client failed when the payment intent fails', () => {
    expect(nextPaymentStatus(pending, { type: 'payment_intent.payment_failed' })).toBe('failed')
  })
})
