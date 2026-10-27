import Link from 'next/link'
import type { ReactNode } from 'react'
import { SITE_URL } from '@/lib/site-content'
import { JsonLd } from './json-ld'

/** Top of every inner page: breadcrumb, sheet number, H1 and lead paragraph. */
export function PageHeader({
  sheet,
  title,
  lead,
  path,
  crumb,
}: {
  sheet: string
  title: string
  lead: ReactNode
  path: string
  crumb: string
}) {
  return (
    <header className="border-b border-rule px-4 pb-12 pt-10 sm:px-6 md:px-10 md:pb-16 md:pt-16">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: crumb, item: `${SITE_URL}${path}` },
          ],
        }}
      />
      <div className="mx-auto max-w-[1200px]">
        <nav aria-label="Breadcrumb" className="font-plex text-[0.8125rem] uppercase tracking-[0.06em] text-graphite">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="prose-link inline-flex min-h-6 items-center text-graphite">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{crumb}</li>
          </ol>
        </nav>
        <p className="mt-8 font-plex text-[0.8125rem] uppercase tracking-[0.08em] text-signal">{sheet}</p>
        <h1 className="mt-3 max-w-[22ch] text-[2.25rem] text-ink sm:text-[2.75rem] lg:text-[3.75rem]">{title}</h1>
        <div className="mt-6 max-w-[62ch] text-lg text-graphite md:text-xl">{lead}</div>
      </div>
    </header>
  )
}
