/**
 * One-time setup: creates premium prices + no-code Stripe Payment Links.
 * Run: node --env-file-if-exists=/vercel/share/.env.project scripts/setup-payment-links.mjs
 *
 * Prints a JSON block of { key: { priceId, url } } to paste into lib/plans.ts.
 * Safe to re-run: it always creates fresh prices/links (Stripe prices are immutable),
 * so only run when prices actually change, then update lib/plans.ts with the output.
 */
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// amount in cents
const ONE_TIME = [
  { key: 'option1', name: 'Complete Digital Asset — Custom Website', amount: 189900 },
  { key: 'option2_build', name: 'Managed Website — Build Fee', amount: 90000 },
  { key: 'addon_animations', name: 'Add-on: Advanced Animations & Motion', amount: 49900 },
  { key: 'addon_webgl', name: 'Add-on: 3D / WebGL Hero Experience', amount: 89900 },
  { key: 'addon_booking', name: 'Add-on: Booking & Scheduling System', amount: 64900 },
  { key: 'addon_cms', name: 'Add-on: Headless CMS / Editable Blog', amount: 74900 },
  { key: 'addon_i18n', name: 'Add-on: Multi-Language (i18n)', amount: 54900 },
]

const RECURRING = [
  { key: 'option2_monthly', name: 'Managed Website — Monthly Management', amount: 15900 },
  { key: 'careplan', name: 'Care Plan — Updates, Hosting & Security', amount: 9900 },
  { key: 'addon_priority_care', name: 'Add-on: Priority Care & Analytics', amount: 14900 },
]

async function createOneTimePrice({ name, amount }) {
  const price = await stripe.prices.create({
    currency: 'usd',
    unit_amount: amount,
    product_data: { name },
  })
  return price.id
}

async function createRecurringPrice({ name, amount }) {
  const price = await stripe.prices.create({
    currency: 'usd',
    unit_amount: amount,
    recurring: { interval: 'month' },
    product_data: { name },
  })
  return price.id
}

async function createLink(lineItems) {
  const link = await stripe.paymentLinks.create({
    line_items: lineItems,
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    phone_number_collection: { enabled: true },
  })
  return link.url
}

async function main() {
  const out = {}
  const priceIds = {}

  for (const item of ONE_TIME) {
    const priceId = await createOneTimePrice(item)
    priceIds[item.key] = priceId
    const url = await createLink([{ price: priceId, quantity: 1 }])
    out[item.key] = { priceId, url }
    console.log(`[v0] one-time ${item.key} -> ${url}`)
  }

  for (const item of RECURRING) {
    const priceId = await createRecurringPrice(item)
    priceIds[item.key] = priceId
    const url = await createLink([{ price: priceId, quantity: 1 }])
    out[item.key] = { priceId, url }
    console.log(`[v0] recurring ${item.key} -> ${url}`)
  }

  // Managed plan = one-time build fee + monthly management in a single subscription link
  const managedCombined = await createLink([
    { price: priceIds.option2_build, quantity: 1 },
    { price: priceIds.option2_monthly, quantity: 1 },
  ])
  out.option2_combined = { url: managedCombined }
  console.log(`[v0] combined option2 -> ${managedCombined}`)

  console.log('\n[v0] ===== PASTE BELOW INTO lib/plans.ts =====')
  console.log(JSON.stringify(out, null, 2))
}

main().catch((e) => {
  console.error('[v0] setup failed:', e.message)
  process.exit(1)
})
