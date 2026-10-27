import type { Metadata } from 'next'
import { CtaBand } from '@/components/site-aec/cta-band'
import { PageHeader } from '@/components/site-aec/page-header'
import { Section, SheetLabel } from '@/components/site-aec/ui'

const PATH = '/process'
const DESCRIPTION =
  'How the AEC Digital Growth Partner engagement runs: fit call, written scope, a 30–45 day build, then monthly growth work and quarterly reviews.'

export const metadata: Metadata = {
  title: 'Process',
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: 'Process', description: DESCRIPTION, url: PATH },
}

const STAGES = [
  {
    when: 'Before signing',
    title: 'Fit call and written scope',
    me: 'A 20-minute call, a short review of your current site, then a written scope listing the pages, the timeline and anything outside the standard build.',
    you: 'Twenty minutes, and a link to your current site and Business Profile.',
  },
  {
    when: 'Days 1–10',
    title: 'Kickoff and inventory',
    me: 'A kickoff interview about your services, best projects and ideal clients. An inventory of existing content and URLs. A page plan for your approval.',
    you: 'About 90 minutes for the interview, plus project photos and any qualification documents you already have.',
  },
  {
    when: 'Days 10–30',
    title: 'Design and build',
    me: 'Page drafts written in plain language, then design and build. Progress update every week.',
    you: 'Review drafts. Your licensed staff approve technical wording.',
  },
  {
    when: 'Days 30–45',
    title: 'Launch',
    me: 'Launch, redirects from old URLs, Search Console and analytics verified, inquiry tracking tested, accessibility and speed checked, Business Profile recommendations delivered.',
    you: 'Final approval, and access to your domain and Business Profile.',
  },
  {
    when: 'Monthly',
    title: 'Growth and care',
    me: 'One growth asset (a service page, project profile, case study, service-area or landing page), hosting and maintenance, one active request at a time, and a one-page report.',
    you: 'About an hour: read the report, supply details for the next page, approve it.',
  },
  {
    when: 'Quarterly',
    title: 'Review',
    me: 'A look at what the data shows — which pages bring inquiries, what people search for — and a recommendation for the next quarter.',
    you: 'A 30-minute call.',
  },
]

export default function ProcessPage() {
  return (
    <>
      <PageHeader
        sheet="S-04 · Process"
        crumb="Process"
        path={PATH}
        title="What happens, when, and what I need from you."
        lead={
          <p>
            No surprises in either direction. Each stage lists what I do and what your firm provides, so you can
            plan around it.
          </p>
        }
      />

      <Section>
        <SheetLabel sheet="4.1">Stages</SheetLabel>
        {/* Phones get stacked blocks; the three-column table starts at md. */}
        <ol className="mt-6 border-t border-rule-strong md:hidden">
          {STAGES.map((s) => (
            <li key={s.title} className="border-b border-rule py-5">
              <p className="font-plex text-[0.8125rem] uppercase tracking-[0.04em] text-signal">{s.when}</p>
              <h2 className="mt-1 text-xl text-ink">{s.title}</h2>
              <h3 className="mt-3 font-plex text-[0.8125rem] uppercase tracking-[0.06em] text-graphite">What I do</h3>
              <p className="mt-1 text-ink">{s.me}</p>
              <h3 className="mt-3 font-plex text-[0.8125rem] uppercase tracking-[0.06em] text-graphite">
                What you provide
              </h3>
              <p className="mt-1 text-graphite">{s.you}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 hidden md:block">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Engagement stages, what I do, and what you provide</caption>
            <thead>
              <tr className="border-b border-rule-strong font-plex text-[0.8125rem] uppercase tracking-[0.06em] text-graphite">
                <th scope="col" className="py-3 pr-4 font-normal">
                  Stage
                </th>
                <th scope="col" className="py-3 pr-4 font-normal">
                  What I do
                </th>
                <th scope="col" className="py-3 font-normal">
                  What you provide
                </th>
              </tr>
            </thead>
            <tbody>
              {STAGES.map((s) => (
                <tr key={s.title} className="border-b border-rule align-top">
                  <th scope="row" className="w-[13rem] py-5 pr-4 font-normal">
                    <span className="block font-plex text-[0.8125rem] uppercase tracking-[0.04em] text-signal">
                      {s.when}
                    </span>
                    <span className="mt-1 block font-display text-lg font-semibold text-ink">{s.title}</span>
                  </th>
                  <td className="py-5 pr-6 text-ink">{s.me}</td>
                  <td className="py-5 text-graphite">{s.you}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section className="bg-surface">
        <SheetLabel sheet="4.2">The monthly report</SheetLabel>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <p className="text-graphite">
            One page, sent in the first week of each month. It lists the work completed, inquiries received
            through the site and by tracked phone link, how search visibility moved, and what is planned next.
          </p>
          <p className="text-graphite">
            Numbers are reported as they are, including when they go down. An inquiry counts only when a real
            person got in touch; page views and clicks are reported separately and never presented as leads.
          </p>
        </div>
      </Section>

      <CtaBand location="process-footer" />
    </>
  )
}
