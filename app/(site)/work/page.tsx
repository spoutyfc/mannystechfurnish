import type { Metadata } from 'next'
import { CaseStudySheet } from '@/components/site-aec/case-study'
import { CtaBand } from '@/components/site-aec/cta-band'
import { PageHeader } from '@/components/site-aec/page-header'
import { Section, SheetLabel } from '@/components/site-aec/ui'
import { PUBLISHED_CASE_STUDIES, OTHER_WORK } from '@/lib/site-content'

const PATH = '/work'
const DESCRIPTION =
  'Live websites for a Bay Area structural engineering firm and a geotechnical engineering firm, with what was shipped and how to check it.'

export const metadata: Metadata = {
  title: 'Work — Engineering & Construction Websites',
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: 'Work — Engineering & Construction Websites', description: DESCRIPTION, url: PATH },
}

export default function WorkPage() {
  return (
    <>
      <PageHeader
        sheet="S-05 · Work"
        crumb="Work"
        path={PATH}
        title="Live sites, described plainly."
        lead={
          <p>
            Each project below is online now. Page counts come from each site&apos;s public sitemap on the date
            shown, so you can check them. Traffic, ranking and inquiry results are not published here unless the
            client has provided the data and agreed to share it.
          </p>
        }
      />

      <Section>
        <SheetLabel sheet="5.1">Engineering and construction</SheetLabel>
        <div className="mt-4">
          {PUBLISHED_CASE_STUDIES.map((c) => (
            <CaseStudySheet key={c.slug} study={c} headingLevel="h2" />
          ))}
        </div>
      </Section>

      <Section className="bg-surface">
        <SheetLabel sheet="5.2">Other custom work</SheetLabel>
        <ul className="mt-6 divide-y divide-rule border-y border-rule-strong">
          {OTHER_WORK.map((w) => (
            <li key={w.client} className="grid gap-2 py-5 md:grid-cols-[18rem_1fr] md:gap-8">
              <div>
                <h2 className="text-xl text-ink">{w.client}</h2>
                <p className="text-[1rem] text-graphite">{w.discipline}</p>
              </div>
              <div>
                <p className="text-graphite">{w.note}</p>
                <a href={w.url} target="_blank" rel="noopener noreferrer" className="prose-link mt-2 inline-block">
                  Visit {w.url.replace('https://', '')}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand location="work-footer" />
    </>
  )
}
