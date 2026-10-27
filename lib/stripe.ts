import 'server-only'

import Stripe from 'stripe'

let client: Stripe | null = null

/**
 * Lazily construct the Stripe client so builds (and the Docker image build)
 * do not need live credentials; a missing key fails at request time instead.
 * Prefers the Stripe Connect access token and falls back to the secret key.
 */
export function getStripe(): Stripe {
  if (client) return client
  const key = process.env.STRIPE_ACCESS_TOKEN || process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY (or STRIPE_ACCESS_TOKEN) must be set')
  client = new Stripe(key)
  return client
}
