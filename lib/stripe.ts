import 'server-only'

import Stripe from 'stripe'

// Prefer the live Stripe Connect access token (real, activated account) and
// fall back to the plain secret key only if it isn't present.
const stripeKey = process.env.STRIPE_ACCESS_TOKEN || process.env.STRIPE_SECRET_KEY!

export const stripe = new Stripe(stripeKey)
