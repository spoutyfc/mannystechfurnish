// Plan + pricing definitions. Kept in a plain module (NOT a "use server" file)
// so non-async values like objects and types can be exported and imported by
// both server actions and client components.
//
// PAYMENTS ARE NO-CODE: each plan/add-on has a Stripe Payment Link URL. Buttons
// link straight to Stripe's hosted checkout — no custom checkout code required.
// To change prices, edit scripts/setup-payment-links.mjs, re-run it, and paste
// the new priceId/url values below.
//
// LIVE MODE: these are real, live Stripe Payment Links for the activated
// "Manny's Tech Furnish" account (generated via STRIPE_ACCESS_TOKEN). Real
// payments are collected. Regenerate via scripts/setup-payment-links.mjs.

// Stripe Price IDs (LIVE) — regenerate via scripts/setup-payment-links.mjs
export const STRIPE_PRICES = {
  option1: 'price_1TwxXDGzcLjrrlAL91bYdaR7', // $1,899 one-time
  option2_build: 'price_1TwxXEGzcLjrrlALGLFmMEjr', // $900 one-time
  option2_monthly: 'price_1TwxXIGzcLjrrlALvVHHf6Pi', // $159/mo
  careplan: 'price_1TwxXIGzcLjrrlALs54NIOT2', // $99/mo
} as const

// No-code Stripe Payment Link URLs (LIVE)
export const PAYMENT_LINKS = {
  option1: 'https://buy.stripe.com/cNicN50GA0ng01i85a7EQ00',
  option2: 'https://buy.stripe.com/dRm3cvfBuda2dS84SY7EQ0a', // build + monthly combined
  careplan: 'https://buy.stripe.com/bJebJ12OI1rk29q2KQ7EQ08',
} as const

export const PLAN_DETAILS = {
  option1: {
    title: 'Complete Digital Asset',
    subtitle: 'One-time investment — you own everything',
    price: '$1,899',
    priceValue: 1899,
    cadence: 'one-time',
    paymentLink: PAYMENT_LINKS.option1,
    features: [
      'Custom full-stack development, concept to launch',
      'Complete codebase ownership — transferred immediately',
      'High-performance front-end + secure back-end',
      'Fully responsive across every device',
      'Advanced SEO + Google Analytics setup',
      'Optional $99/mo care plan for updates & security',
    ],
  },
  option2: {
    title: 'Managed Website Plan',
    subtitle: 'Lower upfront cost, fully managed for you',
    price: '$900 + $159/mo',
    priceValue: 900,
    cadence: 'build + monthly',
    paymentLink: PAYMENT_LINKS.option2,
    features: [
      'Website build included ($900 setup fee)',
      'Ongoing maintenance & hosting included',
      'Updates, security & priority support queue',
      'Basic SEO check-ins',
      'Buy out the code after term: $800',
    ],
  },
} as const

export type PlanType = keyof typeof PLAN_DETAILS

// --- Premium Add-ons ---------------------------------------------------------
// Each add-on is a paid upgrade with a dedicated Stripe Payment Link. `demoHref`
// points to a live on-site demonstration of what the add-on actually does.
export interface AddOn {
  id: string
  name: string
  tagline: string
  description: string
  whatItDoes: string[]
  price: string
  priceValue: number
  cadence: 'one-time' | 'monthly'
  paymentLink: string
  // 'both'  = self-contained, works on any site (e.g. scheduling)
  // 'option2' = requires the Managed Website Plan (ongoing hosting/management)
  availability: 'both' | 'option2'
  demoHref?: string
  icon: string // lucide icon name
  featured?: boolean
}

export const ADD_ONS: AddOn[] = [
  {
    id: 'booking',
    name: 'Booking & Scheduling',
    tagline: 'Let visitors book you 24/7',
    description:
      'A built-in scheduling system so clients pick a slot, get a confirmation, and land on your calendar — no back-and-forth emails.',
    whatItDoes: [
      'Live availability calendar with time slots',
      'Instant confirmation + reminder emails',
      'Blocks double-bookings automatically',
      'Syncs to your Google / Apple calendar',
    ],
    price: '$249',
    priceValue: 249,
    cadence: 'one-time',
    paymentLink: 'https://buy.stripe.com/eVq7sL3SM7PIdS885a7EQ04',
    availability: 'both',
    demoHref: '/demo/booking',
    icon: 'CalendarClock',
    featured: true,
  },
  {
    id: 'animations',
    name: 'Advanced Animations & Motion',
    tagline: 'Scroll-stopping cinematic motion',
    description:
      'Award-style scroll-triggered reveals, parallax depth, and magnetic interactions that make the site feel alive and premium.',
    whatItDoes: [
      'Scroll-triggered section reveals',
      'Parallax depth + smooth scrolling',
      'Magnetic buttons & hover physics',
      'Page transition choreography',
    ],
    price: '$199',
    priceValue: 199,
    cadence: 'one-time',
    paymentLink: 'https://buy.stripe.com/14A28r3SM7PI8xO3OU7EQ02',
    availability: 'option2',
    icon: 'Sparkles',
  },
  {
    id: 'webgl',
    name: '3D / WebGL Hero',
    tagline: 'An interactive 3D centerpiece',
    description:
      'A real-time 3D hero object that reacts to the cursor — the kind of centerpiece that makes people screenshot your site.',
    whatItDoes: [
      'Interactive 3D object reacting to cursor',
      'Real-time lighting & materials',
      'Optimized to stay fast on mobile',
      'Custom-modeled to your brand',
    ],
    price: '$349',
    priceValue: 349,
    cadence: 'one-time',
    paymentLink: 'https://buy.stripe.com/7sYbJ1dtm2vo5lCdpu7EQ03',
    availability: 'option2',
    icon: 'Box',
  },
  {
    id: 'cms',
    name: 'Editable CMS & Blog',
    tagline: 'Update content yourself',
    description:
      'A friendly content editor so you can publish posts, swap images, and edit copy without touching code or paying for every change.',
    whatItDoes: [
      'Publish & edit blog posts yourself',
      'Swap images and copy in-browser',
      'SEO fields on every post',
      'No developer needed for updates',
    ],
    price: '$249',
    priceValue: 249,
    cadence: 'one-time',
    paymentLink: 'https://buy.stripe.com/cNi3cvexqfiaaFWdpu7EQ05',
    availability: 'option2',
    icon: 'PenSquare',
  },
  {
    id: 'i18n',
    name: 'Multi-Language',
    tagline: 'Reach customers in their language',
    description:
      'Full internationalization with a language switcher so your site speaks to every customer, wherever they are.',
    whatItDoes: [
      'Site translated into multiple languages',
      'Clean language switcher UI',
      'Locale-aware SEO & URLs',
      'Easy to add more languages later',
    ],
    price: '$179',
    priceValue: 179,
    cadence: 'one-time',
    paymentLink: 'https://buy.stripe.com/5kQ6oH74Yc5Y5lC4SY7EQ06',
    availability: 'option2',
    icon: 'Languages',
  },
  {
    id: 'priority-care',
    name: 'Priority Care & Analytics',
    tagline: 'White-glove monitoring',
    description:
      'Priority support, proactive monitoring, and a live analytics dashboard so you always know how the site is performing.',
    whatItDoes: [
      'Front-of-queue priority support',
      'Uptime & performance monitoring',
      'Monthly analytics report',
      'Proactive security patching',
    ],
    price: '$49/mo',
    priceValue: 49,
    cadence: 'monthly',
    paymentLink: 'https://buy.stripe.com/00w9ATdtm9XQeWcclq7EQ09',
    availability: 'option2',
    icon: 'ShieldCheck',
  },
]
