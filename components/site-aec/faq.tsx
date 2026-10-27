import Link from 'next/link'
import type { ReactNode } from 'react'

const FAQS: { q: string; a: ReactNode }[] = [
  {
    q: 'Why a monthly fee instead of a project quote?',
    a: 'A one-off quote pays for a launch and then stops. Most of what helps an engineering firm get found — new project profiles, service pages, fixing what the data shows — happens after launch. The fixed fee spreads the build across the term and keeps that work going, with no surprise invoices.',
  },
  {
    q: 'Why a six-month term?',
    a: 'It takes 30–45 days to build and launch, and a few months after that to see how real visitors and search engines respond. Six months is the shortest period in which that cycle can be completed and improved on.',
  },
  {
    q: 'What happens after six months?',
    a: 'The engagement continues month to month at the same fee, and either side can end it with 30 days’ written notice. If you leave, you keep your domain, content, Google Business Profile and analytics, and the site’s code is handed over.',
  },
  {
    q: 'Can you guarantee rankings or a number of leads?',
    a: (
      <>
        No, and you should be wary of anyone who does. Google says local results depend on relevance, distance and
        prominence, and that no one can pay for a better position. What I can commit to is the work: accurate pages,
        sound technical SEO, steady new content and honest reporting.{' '}
        <a
          className="prose-link"
          href="https://support.google.com/business/answer/7091"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google’s explanation<span className="sr-only"> (opens in a new tab)</span>
        </a>
        .
      </>
    ),
  },
  {
    q: 'Are you an engineer?',
    a: 'No. I’m a web developer. I write and structure the pages, and your licensed staff review anything that describes engineering scope, methods or qualifications before it is published.',
  },
  {
    q: 'How much of our time does this take?',
    a: 'About two to three hours during the first two weeks (a kickoff call, project photos and notes, review of drafts), then roughly an hour a month to review the report and approve new pages.',
  },
  {
    q: 'We already have a website. Do we start over?',
    a: 'Not necessarily. Good content and existing URLs are kept, and anything that moves is redirected so you don’t lose what search engines already know about the site.',
  },
  {
    q: 'What if we need something outside the scope?',
    a: (
      <>
        You get a fixed written quote before any work starts, and nothing is billed without your approval. The
        exclusions are listed on <Link className="prose-link" href="/growth-partner#excluded">the offer page</Link>.
      </>
    ),
  },
]

export function Faq() {
  return (
    <div className="divide-y divide-rule border-y border-rule-strong">
      {FAQS.map((f) => (
        <details key={f.q} className="group py-1">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-3 text-lg font-medium text-ink [&::-webkit-details-marker]:hidden">
            {f.q}
            <span
              aria-hidden="true"
              className="font-plex text-xl text-signal transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="max-w-[68ch] pb-6 text-graphite">{f.a}</div>
        </details>
      ))}
    </div>
  )
}
