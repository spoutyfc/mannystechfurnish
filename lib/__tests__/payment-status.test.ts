import { describe, expect, it } from 'vitest'
import {
  paymentTransition,
  transitionApplies,
  type PaymentEvent,
  type PaymentStatus,
} from '@/lib/payment-status'

type Row = { paymentStatus: PaymentStatus | null; stripeCheckoutSessionId: string | null }

/** Applies an event the way the webhook's conditional UPDATE does: guard and write in one step. */
function apply(row: Row, event: PaymentEvent, sessionId?: string): Row {
  const t = paymentTransition(event)
  if (!transitionApplies(row, t)) return row
  return { paymentStatus: t.status, stripeCheckoutSessionId: sessionId ?? row.stripeCheckoutSessionId }
}

const pending: Row = { paymentStatus: 'pending', stripeCheckoutSessionId: 'cs_current' }
const paid: Row = { paymentStatus: 'completed', stripeCheckoutSessionId: 'cs_current' }

const completedPaid: PaymentEvent = {
  type: 'checkout.session.completed',
  sessionId: 'cs_current',
  paymentStatus: 'paid',
}
const expiredCurrent: PaymentEvent = { type: 'checkout.session.expired', sessionId: 'cs_current' }

describe('paymentTransition', () => {
  it('marks a client completed when checkout completes with payment_status=paid', () => {
    expect(apply(pending, completedPaid).paymentStatus).toBe('completed')
  })

  it('treats a no-payment-required checkout (100% discount) as paid', () => {
    const event: PaymentEvent = { ...completedPaid, paymentStatus: 'no_payment_required' }
    expect(apply(pending, event).paymentStatus).toBe('completed')
  })

  it('keeps a delayed-method checkout pending until the funds clear', () => {
    const event: PaymentEvent = { ...completedPaid, paymentStatus: 'unpaid' }
    expect(paymentTransition(event)).toEqual({ status: 'pending', unlessCompleted: true })
    expect(apply(pending, event).paymentStatus).toBe('pending')
  })

  it('settles a delayed payment on async_payment_succeeded', () => {
    const event: PaymentEvent = { type: 'checkout.session.async_payment_succeeded', sessionId: 'cs_current' }
    expect(apply(pending, event).paymentStatus).toBe('completed')
  })

  it('fails a delayed payment on async_payment_failed for the current session only', () => {
    const current: PaymentEvent = { type: 'checkout.session.async_payment_failed', sessionId: 'cs_current' }
    const stale: PaymentEvent = { type: 'checkout.session.async_payment_failed', sessionId: 'cs_old' }
    expect(apply(pending, current).paymentStatus).toBe('failed')
    expect(apply(pending, stale).paymentStatus).toBe('pending')
  })

  it('treats a retried completion as idempotent', () => {
    expect(apply(paid, completedPaid)).toEqual(paid)
  })

  it('marks failed when the session we are waiting on expires', () => {
    expect(apply(pending, expiredCurrent).paymentStatus).toBe('failed')
  })

  it('ignores expiry of an older abandoned session', () => {
    expect(apply(pending, { type: 'checkout.session.expired', sessionId: 'cs_old' })).toEqual(pending)
  })

  it('never downgrades a paid client on a late expiry or failure event', () => {
    expect(apply(paid, expiredCurrent)).toEqual(paid)
    expect(apply(paid, { type: 'payment_intent.payment_failed' })).toEqual(paid)
    expect(apply(paid, { type: 'checkout.session.async_payment_failed', sessionId: 'cs_current' })).toEqual(paid)
    expect(apply(paid, { ...completedPaid, paymentStatus: 'unpaid' })).toEqual(paid)
  })

  it('marks a pending client failed when the payment intent fails', () => {
    expect(apply(pending, { type: 'payment_intent.payment_failed' }).paymentStatus).toBe('failed')
  })

  it('ends paid regardless of the order a concurrent completion and expiry commit in', () => {
    // The old read-then-write let "expired" read `pending`, then overwrite a committed
    // "completed". With the guard evaluated at write time, every commit order ends paid.
    const completedFirst = apply(apply(pending, completedPaid), expiredCurrent)
    const expiredFirst = apply(apply(pending, expiredCurrent), completedPaid)
    expect(completedFirst.paymentStatus).toBe('completed')
    expect(expiredFirst.paymentStatus).toBe('completed')
  })
})
