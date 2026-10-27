import Image from 'next/image'
import type { CaseStudy } from '@/lib/site-content'

function formatChecked(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** One case study laid out as a project data sheet: image, facts, shipped scope. */
export function CaseStudySheet({ study, headingLevel = 'h3' }: { study: CaseStudy; headingLevel?: 'h2' | 'h3' }) {
  const Heading = headingLevel
  return (
    <article id={study.slug} className="grid gap-8 border-t border-rule-strong py-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
      <div className="self-start overflow-hidden rounded-[2px] border border-rule bg-surface">
        <Image
          src={study.image}
          alt={`Screenshot of the ${study.client} website`}
          width={1200}
          height={750}
          sizes="(min-width: 1024px) 560px, 100vw"
          className="h-auto w-full"
        />
      </div>
      <div>
        <p className="font-plex text-[0.8125rem] uppercase tracking-[0.06em] text-graphite">
          {study.discipline} · {study.location}
        </p>
        <Heading className="mt-2 text-[1.75rem] text-ink md:text-[2.25rem]">{study.client}</Heading>
        <p className="mt-4 text-graphite">{study.summary}</p>

        <h4 className="mt-6 font-plex text-[0.8125rem] uppercase tracking-[0.06em] text-graphite">Shipped</h4>
        <ul className="mt-2 space-y-1.5">
          {study.shipped.map((s) => (
            <li key={s} className="flex gap-3 text-ink">
              <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-signal" />
              {s}
            </li>
          ))}
        </ul>

        {study.evidence.length > 0 && (
          <table className="mt-6 w-full border-collapse text-left">
            <caption className="pb-2 text-left font-plex text-[0.8125rem] uppercase tracking-[0.06em] text-graphite">
              Live site, counted from its sitemap on {formatChecked(study.checked)}
            </caption>
            <tbody>
              {study.evidence.map((e) => (
                <tr key={e.label} className="border-t border-rule">
                  <th scope="row" className="py-2 pr-4 font-normal text-graphite">
                    {e.label}
                  </th>
                  <td className="py-2 text-right font-plex text-ink">{e.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <a
          href={study.url}
          target="_blank"
          rel="noopener noreferrer"
          className="prose-link mt-6 inline-block font-medium"
        >
          Visit {study.url.replace('https://', '')}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </article>
  )
}
