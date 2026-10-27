import type { Metadata } from 'next'
import { CtaBand } from '@/components/site-aec/cta-band'
import { PageHeader } from '@/components/site-aec/page-header'
import { Schedule, Section, SheetLabel } from '@/components/site-aec/ui'
import { BUSINESS_NAME, CONTACT, OWNER_NAME } from '@/lib/site-content'

const PATH = '/about'
const DESCRIPTION = `${BUSINESS_NAME} is ${OWNER_NAME}, a web developer in the ${CONTACT.region} who builds and runs websites for engineering and construction firms.`

export const metadata: Metadata = {
  title: `About ${OWNER_NAME}`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: `About ${OWNER_NAME}`, description: DESCRIPTION, url: PATH },
}

export default function AboutPage() {
  return (
    <>
      <PageHeader
        sheet="S-06 · About"
        crumb="About"
        path={PATH}
        title={`${BUSINESS_NAME} is one developer: ${OWNER_NAME}.`}
        lead={
          <p>
            I&apos;m a web developer based in the {CONTACT.region}. I design, build and host websites, and I&apos;ve
            spent much of that work on sites for engineering and construction firms in the Bay Area.
          </p>
        }
      />

      <Section>
        <SheetLabel sheet="6.1">How I work</SheetLabel>
        <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-14">
          <div className="space-y-4 text-graphite">
            <p>
              There are no account managers. The person on your fit call is the person who writes your pages,
              builds the site, fixes it when something breaks and sends the monthly report.
            </p>
            <p>
              I write code by hand on a modern stack, so sites are fast, accessible and not tied to a page-builder
              subscription. I use AI tools for drafting and checking work, and every page is reviewed by me and
              approved by you before it goes live.
            </p>
          </div>
          <div className="space-y-4 text-graphite">
            <p>
              I&apos;m not an engineer, and I don&apos;t present myself as one. What I bring is the ability to take
              what your engineers know and organize it so clients, architects and agencies can understand it and
              get in touch.
            </p>
            <p>
              Because I work alone, I limit how many new builds run at the same time. That is a quality rule, not
              a sales tactic.
            </p>
          </div>
        </div>
      </Section>

      <Section className="bg-surface">
        <SheetLabel sheet="6.2">Details</SheetLabel>
        <div className="mt-6">
          <Schedule
            rows={[
              { label: 'Business', value: BUSINESS_NAME },
              { label: 'Owner', value: OWNER_NAME },
              { label: 'Based in', value: CONTACT.region },
              { label: 'Serves', value: 'San Francisco Bay Area; remote engagements by arrangement' },
              { label: 'Phone', value: CONTACT.phoneDisplay },
              { label: 'Email', value: CONTACT.email },
              {
                label: 'Code',
                value: (
                  <a href="https://github.com/spoutyfc" target="_blank" rel="noopener noreferrer" className="prose-link">
                    github.com/spoutyfc<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ),
              },
            ]}
          />
        </div>
      </Section>

      <CtaBand location="about-footer" />
    </>
  )
}
