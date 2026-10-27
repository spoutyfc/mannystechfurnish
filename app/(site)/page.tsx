import Link from 'next/link'
import { CaseStudySheet } from '@/components/site-aec/case-study'
import { CtaBand } from '@/components/site-aec/cta-band'
import { Faq } from '@/components/site-aec/faq'
import { JsonLd } from '@/components/site-aec/json-ld'
import { NumberedList, PrimaryCta, Section, SecondaryLink, SheetLabel } from '@/components/site-aec/ui'
import {
  BUSINESS_NAME,
  CASE_STUDIES,
  CONTACT,
  OFFER,
  OFFER_EXCLUDED,
  OFFER_INCLUDED,
  OWNER_NAME,
  SITE_URL,
} from '@/lib/site-content'

const PROBLEMS = [
  {
    title: 'Services are listed, not explained',
    detail:
      'A homeowner searching for a foundation inspection or a developer looking for a geotechnical investigation lands on a page that just says “Residential & Commercial.” Each service you want work in needs its own clear page.',
  },
  {
    title: 'The project record is out of date',
    detail:
      'The work that wins referrals sits in a PDF qualifications package or on a hard drive. Prospective clients and architects can’t see what you have built, where, or for whom.',
  },
  {
    title: 'Local search is left to chance',
    detail:
      'Your Google Business Profile, your service area and your site’s pages say slightly different things, or say very little, so you show up inconsistently for searches in the cities you serve.',
  },
  {
    title: 'No one knows which inquiries came from the site',
    detail:
      'Calls and form submissions aren’t tracked, so there is no way to tell whether the website is helping, and no basis for deciding what to improve.',
  },
]

const TIMELINE = [
  { when: 'Days 1–10', what: 'Kickoff call, content and project inventory, current site and Business Profile review, page plan agreed in writing.' },
  { when: 'Days 10–30', what: 'Design and build. You review drafts of every page; your licensed staff approve all technical wording.' },
  { when: 'Days 30–45', what: 'Launch, redirects from old URLs, Search Console and analytics verified, inquiry tracking tested, Business Profile recommendations delivered.' },
  { when: 'Every month', what: 'One new growth asset, hosting and care, one active request at a time, and a one-page report.' },
  { when: 'Every quarter', what: 'A review of what visitors and search data show, and what to change next.' },
]

const FIT = [
  'A principal-led engineering, surveying, contracting or design-build firm, roughly 2–50 people',
  'Based in or serving the Bay Area',
  'Completed projects you are able to show, with the client’s permission where needed',
  'You want steady improvement after launch, not a one-time site',
  'Someone at the firm can spend about an hour a month reviewing pages and the report',
]

const NOT_FIT = [
  'You need ads management, daily social media, or photo and video production',
  'You need a client portal, custom software or a CRM migration',
  'You want guaranteed rankings or a guaranteed number of leads',
  'The site has to be live in under two weeks',
  'You already have an in-house marketing team running the website',
]

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebSite',
              '@id': `${SITE_URL}/#website`,
              url: SITE_URL,
              name: BUSINESS_NAME,
            },
            {
              '@type': 'ProfessionalService',
              '@id': `${SITE_URL}/#business`,
              name: BUSINESS_NAME,
              url: SITE_URL,
              description:
                'Website design, development, hosting and local search work for engineering and construction firms in the San Francisco Bay Area.',
              telephone: CONTACT.phoneE164,
              email: CONTACT.email,
              founder: { '@type': 'Person', name: OWNER_NAME },
              areaServed: { '@type': 'Place', name: 'San Francisco Bay Area, California' },
              knowsAbout: ['Website development', 'Technical SEO', 'Local search', 'Web accessibility'],
              sameAs: ['https://github.com/spoutyfc'],
            },
          ],
        }}
      />

      {/* Hero */}
      <section className="border-b border-rule px-4 pb-16 pt-12 sm:px-6 md:px-10 md:pb-24 md:pt-20">
        <div className="mx-auto max-w-[1200px]">
          <p className="font-plex text-[0.8125rem] uppercase tracking-[0.08em] text-graphite">
            <span className="text-signal">S-01</span> · Bay Area engineering &amp; construction firms
          </p>
          <h1 className="mt-5 max-w-[20ch] text-[2.5rem] text-ink sm:text-[3.25rem] md:text-[4rem]">
            Websites and local search for engineering and construction firms.
          </h1>
          <p className="mt-8 max-w-[60ch] text-lg text-graphite md:text-xl">
            I build and run the website for structural, geotechnical, civil, surveying and design-build firms: your
            services, your project record and your service area, set out so the right clients can find you and get
            in touch. One fixed monthly fee, and you deal directly with the person doing the work.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PrimaryCta location="home-hero" />
            <SecondaryLink href="#work">See the AEC work</SecondaryLink>
          </div>

          <ul
            aria-label="Engineering and construction clients"
            className="mt-14 grid border-t border-rule-strong sm:grid-cols-3"
          >
            {CASE_STUDIES.map((c) => (
              <li key={c.slug} className="border-b border-rule py-4 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0">
                <p className="font-display text-lg font-semibold text-ink">{c.client}</p>
                <p className="text-[1rem] text-graphite">
                  {c.discipline}, {c.location}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Problems */}
      <Section>
        <SheetLabel sheet="S-02">What usually goes wrong</SheetLabel>
        <h2 className="mt-6 max-w-[26ch] text-3xl text-ink md:text-[2.75rem]">
          Most firm websites undersell work that is genuinely good.
        </h2>
        <div className="mt-10">
          <NumberedList items={PROBLEMS} />
        </div>
      </Section>

      {/* Offer */}
      <Section id="offer" className="bg-surface">
        <SheetLabel sheet="S-03">The offer</SheetLabel>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <h2 className="text-3xl text-ink md:text-[2.75rem]">{OFFER.name}</h2>
            <p className="mt-6 font-display text-6xl font-semibold tracking-tight text-ink">
              {OFFER.price}
              <span className="ml-2 font-sans text-xl font-normal text-graphite">{OFFER.cadence}</span>
            </p>
            <p className="mt-3 text-graphite">
              {OFFER.term}, {OFFER.billing.toLowerCase()}. The standard website build is included; there is no
              separate setup fee. A kickoff date is agreed when you sign, and billing starts at kickoff.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <PrimaryCta location="home-offer" />
              <SecondaryLink href="/growth-partner">Full scope and terms</SecondaryLink>
            </div>
          </div>
          <div>
            <h3 className="font-plex text-[0.8125rem] uppercase tracking-[0.06em] text-graphite">Included</h3>
            <ul className="mt-3 divide-y divide-rule border-y border-rule-strong">
              {OFFER_INCLUDED.map((item) => (
                <li key={item.title} className="py-3">
                  <span className="font-medium text-ink">{item.title}.</span>{' '}
                  <span className="text-graphite">{item.detail}</span>
                </li>
              ))}
            </ul>
            <h3 className="mt-8 font-plex text-[0.8125rem] uppercase tracking-[0.06em] text-graphite">
              Not included
            </h3>
            <p className="mt-3 text-graphite">{OFFER_EXCLUDED.join(' · ')}.</p>
          </div>
        </div>
      </Section>

      {/* Timeline */}
      <Section>
        <SheetLabel sheet="S-04">What happens and when</SheetLabel>
        <h2 className="mt-6 max-w-[26ch] text-3xl text-ink md:text-[2.75rem]">
          Live in 30–45 days, then a steady monthly cadence.
        </h2>
        <ol className="mt-10 border-t border-rule-strong">
          {TIMELINE.map((t) => (
            <li key={t.when} className="grid gap-2 border-b border-rule py-5 md:grid-cols-[12rem_1fr] md:gap-8">
              <span className="font-plex text-[0.875rem] uppercase tracking-[0.04em] text-signal">{t.when}</span>
              <span className="text-ink">{t.what}</span>
            </li>
          ))}
        </ol>
        <p className="mt-6">
          <Link href="/process" className="prose-link">
            The full process, and what you&apos;ll need to provide
          </Link>
        </p>
      </Section>

      {/* Work */}
      <Section id="work" className="bg-surface">
        <SheetLabel sheet="S-05">Engineering and construction work</SheetLabel>
        <h2 className="mt-6 max-w-[28ch] text-3xl text-ink md:text-[2.75rem]">
          Sites that are live today. Check them yourself.
        </h2>
        <p className="mt-4 max-w-[62ch] text-graphite">
          The numbers below are counts of pages on each live site, not traffic or revenue claims. Results data is
          only published when a client has supplied it and agreed to share it.
        </p>
        <div className="mt-8">
          {CASE_STUDIES.map((c) => (
            <CaseStudySheet key={c.slug} study={c} />
          ))}
        </div>
        <p className="mt-4">
          <Link href="/work" className="prose-link">
            All work, including projects outside engineering
          </Link>
        </p>
      </Section>

      {/* Fit */}
      <Section>
        <SheetLabel sheet="S-06">Is this a fit?</SheetLabel>
        <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <h2 className="text-2xl text-ink md:text-3xl">A good fit if</h2>
            <ul className="mt-4 divide-y divide-rule border-y border-rule-strong">
              {FIT.map((f) => (
                <li key={f} className="py-3 text-ink">
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl text-ink md:text-3xl">Probably not a fit if</h2>
            <ul className="mt-4 divide-y divide-rule border-y border-rule-strong">
              {NOT_FIT.map((f) => (
                <li key={f} className="py-3 text-graphite">
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Ownership */}
      <Section className="bg-surface">
        <SheetLabel sheet="S-07">Ownership and terms</SheetLabel>
        <div className="mt-6 grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <h2 className="text-3xl text-ink md:text-[2.75rem]">What&apos;s yours stays yours.</h2>
          <ul className="divide-y divide-rule border-y border-rule-strong">
            <li className="py-3 text-ink">
              Your domain, Google Business Profile, Search Console and analytics accounts are registered to you
              from day one. I work on them with access you grant.
            </li>
            <li className="py-3 text-ink">
              Content, photographs and project information you supply remain yours.
            </li>
            <li className="py-3 text-ink">
              After the six-month term, if you leave, the site&apos;s code is handed over and I help move it to
              your own hosting. There is no buyout fee.
            </li>
            <li className="py-3 text-ink">
              Out-of-scope work is quoted in writing at a fixed price before it starts. Nothing is billed without
              your approval.
            </li>
          </ul>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SheetLabel sheet="S-08">Questions</SheetLabel>
        <h2 className="mt-6 text-3xl text-ink md:text-[2.75rem]">Straight answers.</h2>
        <div className="mt-8">
          <Faq />
        </div>
      </Section>

      <CtaBand location="home-footer" />
    </>
  )
}
