export type PaymentStatus = 'pending' | 'completed' | 'failed'

export type PaymentEvent =
  | { type: 'checkout.session.completed' }
  | { type: 'checkout.session.expired'; sessionId: string }
  | { type: 'payment_intent.payment_failed' }

/**
 * Decide the next stored payment status for a Stripe event, or `null` to leave
 * the row unchanged.
 *
 * Stripe delivers events out of order and retries them. A client who opens
 * checkout twice leaves an abandoned session that expires ~24h later; without
 * these guards that expiry would overwrite a paid client back to "failed".
 */
export function nextPaymentStatus(
  current: { paymentStatus: string | null; stripeCheckoutSessionId: string | null },
  event: PaymentEvent,
): PaymentStatus | null {
  if (event.type === 'checkout.session.completed') return 'completed'
  if (current.paymentStatus === 'completed') return null

  if (event.type === 'checkout.session.expired') {
    // Only the session we are currently waiting on can mark the client failed.
    return current.stripeCheckoutSessionId === event.sessionId ? 'failed' : null
  }

  return 'failed'
}
