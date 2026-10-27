import type { Metadata } from 'next'
import { CtaBand } from '@/components/site-aec/cta-band'
import { Faq } from '@/components/site-aec/faq'
import { JsonLd } from '@/components/site-aec/json-ld'
import { PageHeader } from '@/components/site-aec/page-header'
import { PrimaryCta, Schedule, Section, SheetLabel } from '@/components/site-aec/ui'
import { BUSINESS_NAME, OFFER, OFFER_EXCLUDED, OFFER_INCLUDED, SITE_URL } from '@/lib/site-content'

const PATH = '/growth-partner'
const DESCRIPTION =
  '$1,000 a month, six-month term: website build, hosting, technical SEO, Business Profile review, then a new growth asset each month after launch.'

export const metadata: Metadata = {
  title: 'AEC Digital Growth Partner — $1,000/month',
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: 'AEC Digital Growth Partner — $1,000/month', description: DESCRIPTION, url: PATH },
}

const WHY_PRICE = [
  {
    title: 'You are not renting maintenance',
    detail:
      'The fee pays for a custom site built around your services and projects, then for continuous work on it. The build is spread across the term rather than billed up front.',
  },
  {
    title: 'One predictable cost',
    detail:
      'It replaces a project quote, a hosting bill, a separate SEO contractor and ad-hoc change requests with a single fixed amount.',
  },
  {
    title: 'Six months is long enough to learn something',
    detail:
      'Roughly six weeks to launch, then several months of real visitor and search data to act on. A shorter term would end before the improvements start.',
  },
  {
    title: 'A narrow scope keeps quality high',
    detail:
      'It costs far less than a marketing hire or a broad agency retainer because it does fewer things. The exclusions below are what make the price possible.',
  },
]

export default function GrowthPartnerPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: OFFER.name,
          serviceType: 'Website development and local search for engineering and construction firms',
          provider: { '@type': 'ProfessionalService', name: BUSINESS_NAME, url: SITE_URL },
          areaServed: { '@type': 'Place', name: 'San Francisco Bay Area, California' },
          url: `${SITE_URL}${PATH}`,
          offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: OFFER.priceValue,
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: OFFER.priceValue,
              priceCurrency: 'USD',
              unitText: 'MONTH',
              billingDuration: 6,
              billingIncrement: 1,
            },
          },
        }}
      />
      <PageHeader
        sheet="S-03 · The offer"
        crumb="The offer"
        path={PATH}
        title={`${OFFER.name}: ${OFFER.price} a month.`}
        lead={
          <p>
            One engagement, one price. A custom website for your firm, built in the first 30–45 days, then hosted,
            maintained and improved every month. Below is exactly what is and isn&apos;t included.
          </p>
        }
      />

      <Section>
        <SheetLabel sheet="3.1">Commercial terms</SheetLabel>
        <div className="mt-6">
          <Schedule
            rows={[
              { label: 'Fee', value: `${OFFER.price} ${OFFER.cadence}` },
              { label: 'Initial term', value: 'Six months' },
              { label: 'Billing', value: 'Monthly in advance, by invoice through Stripe' },
              { label: 'Setup fee', value: 'None for the standard website scope' },
              {
                label: 'Start',
                value: 'A kickoff date is agreed when you sign. The six-month term and the first payment start at kickoff.',
              },
              {
                label: 'Leaving early',
                value:
                  'You can end the agreement during the first six months; the remaining months of the term are billed at 50%. Because the build is spread across the term, this is what makes the no-setup-fee price possible.',
              },
              { label: 'After the term', value: 'Month to month at the same fee; 30 days’ written notice to end' },
              {
                label: 'Code',
                value: 'Handed over, with help moving hosting, once the six-month term is paid in full. No buyout fee.',
              },
              { label: 'Requests', value: 'One active request at a time; replies within two business days' },
              { label: 'Out-of-scope work', value: 'Fixed written quote before work starts; never billed without approval' },
            ]}
          />
        </div>
        <p className="mt-6 max-w-[68ch] text-graphite">
          This page summarizes the offer. The signed agreement sets out the full terms and takes precedence.
        </p>
      </Section>

      <Section className="bg-surface">
        <SheetLabel sheet="3.2">Included</SheetLabel>
        <ul className="mt-6 divide-y divide-rule border-y border-rule-strong">
          {OFFER_INCLUDED.map((item) => (
            <li key={item.title} className="grid gap-2 py-5 md:grid-cols-[18rem_1fr] md:gap-8">
              <h2 className="text-xl text-ink">{item.title}</h2>
              <p className="text-graphite">{item.detail}</p>
            </li>
          ))}
        </ul>
        <h2 className="mt-12 text-2xl text-ink">The standard website scope</h2>
        <p className="mt-3 max-w-[68ch] text-graphite">
          Up to 12 pages: home, about, a services overview, up to six individual service or service-area pages,
          a project index with your first project profiles, and contact. One contact form, a sitemap, structured
          data and analytics. Copy is drafted from a kickoff interview and your existing material; you supply
          project photographs. Larger builds are quoted separately before the agreement is signed.
        </p>
        <p className="mt-3 max-w-[68ch] text-graphite">
          Growth assets start after launch, so a six-month term typically adds four or five pages to the launch
          site. The client sites on the work page are larger than the standard launch scope.
        </p>
      </Section>

      <Section id="excluded">
        <SheetLabel sheet="3.3">Not included</SheetLabel>
        <p className="mt-6 max-w-[68ch] text-graphite">
          These can be quoted separately, or I can point you to a specialist.
        </p>
        <ul className="mt-6 grid border-t border-rule-strong sm:grid-cols-2">
          {OFFER_EXCLUDED.map((x) => (
            <li key={x} className="border-b border-rule py-3 text-ink sm:odd:pr-6">
              {x}
            </li>
          ))}
        </ul>
      </Section>

      <Section className="bg-surface">
        <SheetLabel sheet="3.4">Why this price</SheetLabel>
        <ul className="mt-6 divide-y divide-rule border-y border-rule-strong">
          {WHY_PRICE.map((w) => (
            <li key={w.title} className="grid gap-2 py-5 md:grid-cols-[18rem_1fr] md:gap-8">
              <h2 className="text-xl text-ink">{w.title}</h2>
              <p className="text-graphite">{w.detail}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-[68ch] text-graphite">
          The fee is not a promise of a particular return. What it buys is defined work done well, every month,
          with a report that shows what happened.
        </p>
        <div className="mt-8">
          <PrimaryCta location="offer-why-price" />
        </div>
      </Section>

      <Section>
        <SheetLabel sheet="3.5">Questions</SheetLabel>
        <div className="mt-6">
          <Faq />
        </div>
      </Section>

      <CtaBand location="offer-footer" />
    </>
  )
}
