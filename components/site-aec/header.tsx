import Link from 'next/link'
import { NAV_LINKS } from '@/lib/site-content'
import { MobileMenu } from './mobile-menu'
import { PrimaryCta } from './ui'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-4 py-3 sm:px-6 md:px-10">
        <Link href="/" className="flex flex-col leading-tight" aria-label="Manny's Tech Furnish, home">
          <span className="font-display text-lg font-semibold tracking-tight text-ink">Manny&apos;s Tech Furnish</span>
          <span className="hidden font-plex text-[0.75rem] uppercase tracking-[0.08em] text-graphite sm:block">
            Websites for engineering &amp; construction
          </span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[0.9375rem] font-medium text-ink underline-offset-[6px] transition-colors hover:text-signal hover:underline"
            >
              {l.label}
            </Link>
          ))}
          <PrimaryCta location="header" className="min-h-11 px-5 text-[0.9375rem]">
            Book a fit call
          </PrimaryCta>
        </nav>
        <MobileMenu />
      </div>
    </header>
  )
}
