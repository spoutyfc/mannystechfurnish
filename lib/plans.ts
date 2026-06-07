// Plan + pricing definitions. Kept in a plain module (NOT a "use server" file)
// so non-async values like objects and types can be exported and imported by
// both server actions and client components.

// Price IDs from Stripe
export const STRIPE_PRICES = {
  option1: 'price_1TdITWK40rUg2ebUcW26SvsI', // $1,299 one-time
  careplan: 'price_1TdJBwK40rUg2ebUgPWlzsfX', // $70/mo
  option2_build: 'price_1TdITeK40rUg2ebU93d0nMVp', // $700 one-time
  option2_monthly: 'price_1TdJC4K40rUg2ebUYdZy9zsl', // $120/mo
} as const

export const PLAN_DETAILS = {
  option1: {
    title: 'Complete Digital Asset',
    subtitle: 'One-time investment — you own everything',
    price: '$1,299',
    priceValue: 1299,
    cadence: 'one-time',
    features: [
      'Custom full-stack development',
      'Complete codebase ownership',
      'Advanced SEO & analytics setup',
      'Fully responsive across all devices',
      'Optional $70/mo care plan',
    ],
  },
  option2: {
    title: 'Managed Website Plan',
    subtitle: 'Lower upfront cost, fully managed for you',
    price: '$700 + $120/mo',
    priceValue: 700,
    cadence: 'build + monthly',
    features: [
      'Website build ($700 one-time)',
      'Monthly management ($120/mo)',
      'Hosting & maintenance included',
      'Ongoing updates & security',
      'Basic SEO check-ins',
    ],
  },
} as const

export type PlanType = keyof typeof PLAN_DETAILS
