export type PaymentStatus = 'pending' | 'completed' | 'failed'

/** The subset of Stripe Checkout Session `payment_status` values we act on. */
export type CheckoutPaymentStatus = 'paid' | 'unpaid' | 'no_payment_required'

export type PaymentEvent =
  | { type: 'checkout.session.completed'; sessionId: string; paymentStatus: CheckoutPaymentStatus }
  | { type: 'checkout.session.async_payment_succeeded'; sessionId: string }
  | { type: 'checkout.session.async_payment_failed'; sessionId: string }
  | { type: 'checkout.session.expired'; sessionId: string }
  | { type: 'payment_intent.payment_failed' }

/**
 * A status change plus the conditions the stored row must meet for it to apply.
 * The webhook turns this into ONE conditional `UPDATE ... WHERE`, so the check
 * and the write happen atomically in Postgres. A read-then-write would let a
 * concurrent "expired" event read `pending` before "completed" commits and then
 * overwrite the paid row.
 */
export type PaymentTransition = {
  status: PaymentStatus
  /** Skip the write when the client is already paid (never downgrade). */
  unlessCompleted: boolean
  /** Only apply when this checkout session is the one stored on the client. */
  onlyForSession?: string
}

/**
 * Decide how a Stripe event changes a client's stored payment status.
 *
 * Stripe delivers events out of order and retries them. A client who opens
 * checkout twice leaves an abandoned session that expires ~24h later; without
 * these guards that expiry would overwrite a paid client back to "failed".
 */
export function paymentTransition(event: PaymentEvent): PaymentTransition {
  switch (event.type) {
    case 'checkout.session.completed':
      // Delayed methods (ACH, bank debits) complete checkout before funds clear.
      // Those arrive as `unpaid` and are settled by the async_payment_* events.
      return event.paymentStatus === 'unpaid'
        ? { status: 'pending', unlessCompleted: true }
        : { status: 'completed', unlessCompleted: false }
    case 'checkout.session.async_payment_succeeded':
      return { status: 'completed', unlessCompleted: false }
    case 'checkout.session.async_payment_failed':
    case 'checkout.session.expired':
      return { status: 'failed', unlessCompleted: true, onlyForSession: event.sessionId }
    case 'payment_intent.payment_failed':
      return { status: 'failed', unlessCompleted: true }
  }
}

/**
 * In-process mirror of the SQL guard the webhook builds from a transition.
 * Used by tests to replay event interleavings; the database enforces the real one.
 */
export function transitionApplies(
  row: { paymentStatus: string | null; stripeCheckoutSessionId: string | null },
  transition: PaymentTransition,
): boolean {
  if (transition.unlessCompleted && row.paymentStatus === 'completed') return false
  if (transition.onlyForSession !== undefined && row.stripeCheckoutSessionId !== transition.onlyForSession) {
    return false
  }
  return true
}
