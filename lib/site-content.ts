// Single source for public marketing copy that appears on more than one page:
// contact details, the offer and the case-study evidence. Every factual claim
// here must be checkable; see research/claim-register.md before adding one.

export const SITE_URL = 'https://mannystechfurnish.com'
export const BUSINESS_NAME = "Manny's Tech Furnish"
export const OWNER_NAME = 'Mansoor Arif'

export const CONTACT = {
  email: 'mansoor.buspro@gmail.com',
  phoneDisplay: '(925) 278-9059',
  phoneE164: '+19252789059',
  region: 'Tri-Valley, California',
} as const

export const OFFER = {
  name: 'AEC Digital Growth Partner',
  price: '$1,000',
  priceValue: 1000,
  cadence: 'per month',
  term: 'Six-month initial term',
  billing: 'Billed monthly in advance',
  launchWindow: '30–45 days',
} as const

export const OFFER_INCLUDED = [
  {
    title: 'Website build or structured rebuild',
    detail:
      'Delivered in phases during the first 30–45 days, within the standard scope: up to 12 pages, built from your services, project record and service area. Existing URLs are mapped and redirected.',
  },
  {
    title: 'Managed hosting and care',
    detail:
      'Hosting, SSL, backups, uptime monitoring, security patches and a monthly performance check.',
  },
  {
    title: 'Technical SEO foundation',
    detail:
      'Page titles and descriptions, structured data, sitemap, indexation checks in Google Search Console, and analytics.',
  },
  {
    title: 'Google Business Profile review',
    detail:
      'A review of categories, services, service area and photos, with written recommendations. You keep ownership of the profile and grant access.',
  },
  {
    title: 'One growth asset per month after launch',
    detail:
      'A service page, a service-area page with real local content, a project profile, a case study or a campaign landing page.',
  },
  {
    title: 'Inquiry tracking',
    detail:
      'Form submissions and phone-link clicks are tracked where it is technically and legally possible, so you can see which pages lead to inquiries.',
  },
  {
    title: 'Monthly report and quarterly review',
    detail:
      'A one-page report each month: work completed, inquiries received, search visibility and next actions. Each quarter we review positioning and conversion.',
  },
  {
    title: 'Direct access',
    detail:
      'One active request at a time, with a reply within two business days. You always deal with the person doing the work.',
  },
] as const

export const OFFER_EXCLUDED = [
  'Ad spend and ongoing ads management',
  'Unlimited requests or unlimited redesigns',
  'Daily or weekly social media posting',
  'Photography and video production',
  'Full rebrands or new brand identity systems',
  'Client portals, custom software or SaaS',
  'CRM setup or migration',
  'Guaranteed rankings, lead counts or revenue',
] as const

export interface CaseStudy {
  slug: string
  client: string
  discipline: string
  location: string
  url: string
  image: string
  summary: string
  shipped: string[]
  /** Facts that anyone can re-check from the live site, with the date checked. */
  evidence: { label: string; value: string }[]
  checked: string
  /** False until authorship and written permission are confirmed (research/claim-register.md). */
  publish: boolean
}

// Counts below come from each client's public sitemap.xml, checked 2026-10-27.
// No traffic, ranking or inquiry outcomes are published until the client has
// supplied the data and approved its use.
export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'oaktown-engineers',
    client: 'Oaktown Engineers',
    discipline: 'Structural engineering',
    location: 'Oakland, CA',
    url: 'https://oaktownengineers.com',
    image: '/images/work-oaktown.webp',
    summary:
      'A structural engineering firm serving residential and commercial clients across the East Bay. The site is organized around the questions owners actually search: seismic retrofits, foundations, load-bearing walls and ADU plans.',
    shipped: [
      'Project library managed from an admin dashboard',
      'Service pages written around specific structural problems',
      'City pages for the areas the firm serves',
      'Google Search Console and GA4 connected',
    ],
    evidence: [
      { label: 'Service pages', value: '13' },
      { label: 'City pages', value: '6' },
      { label: 'Project profiles', value: '13' },
      { label: 'Guides and articles', value: '8' },
    ],
    checked: '2026-10-27',
    publish: true,
  },
  {
    slug: 'bear-geotechnical',
    client: 'Bear Geotechnical',
    discipline: 'Geotechnical engineering',
    location: 'San Francisco Bay Area',
    url: 'https://beargeotech.com',
    image: '/images/work-bear.webp',
    summary:
      'A geotechnical engineering firm. Each service — from site investigation to slope stability — has its own page, and each service area has a page generated from structured data rather than copied text.',
    shipped: [
      'Service and service-area pages generated from structured data',
      'Admin inquiry inbox with export',
    ],
    evidence: [
      { label: 'Service pages', value: '6' },
      { label: 'Service-area pages', value: '8' },
    ],
    checked: '2026-10-27',
    publish: true,
  },
  {
    slug: 'sequoia-remodeling',
    client: 'Sequoia Remodeling',
    discipline: 'Design-build remodeling',
    location: 'San Francisco Bay Area',
    url: 'https://sequoiaremodel.com',
    image: '/images/work-sequoia.webp',
    summary:
      'A design-build remodeler with two divisions. The site presents both divisions and their project work, and gives homeowners a direct way to request a consultation.',
    shipped: ['Division-specific project storytelling', 'Consultation request flow'],
    evidence: [],
    checked: '2026-10-27',
    // The live site carries no "website by" credit; confirm before publishing.
    publish: false,
  },
]

/** Case studies cleared for the public site. */
export const PUBLISHED_CASE_STUDIES = CASE_STUDIES.filter((c) => c.publish)

export const OTHER_WORK = [
  {
    client: 'United Flex Auto',
    discipline: 'Pre-owned auto dealership, Pleasant Hill',
    url: 'https://unitedflexauto.com',
    note: 'Inventory system, online test-drive booking and a VIN-decoding admin editor. Outside the AEC niche; listed to show the depth of custom work.',
  },
] as const

export const NAV_LINKS = [
  { href: '/engineering-construction', label: 'Who it’s for' },
  { href: '/work', label: 'Work' },
  { href: '/growth-partner', label: 'The offer' },
  { href: '/process', label: 'Process' },
  { href: '/about', label: 'About' },
] as const

/** Options offered by the fit-call form's discipline select. */
export const DISCIPLINES = [
  'Structural engineering',
  'Geotechnical engineering',
  'Civil engineering',
  'Land surveying',
  'MEP engineering',
  'General engineering contractor',
  'Design-build or general contractor',
  'Other',
] as const
