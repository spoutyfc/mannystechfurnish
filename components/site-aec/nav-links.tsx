'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS } from '@/lib/site-content'

/** Desktop navigation; marks the current section for sighted and screen-reader users. */
export function NavLinks() {
  const pathname = usePathname()
  return (
    <>
      {NAV_LINKS.map((l) => {
        const current = pathname === l.href
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={current ? 'page' : undefined}
            className={`font-mono text-xs uppercase tracking-widest underline-offset-[8px] transition-colors hover:text-white ${
              current ? 'text-white underline decoration-accent' : 'text-white/75'
            }`}
          >
            {l.label}
          </Link>
        )
      })}
    </>
  )
}
