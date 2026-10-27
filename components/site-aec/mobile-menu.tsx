'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { CONTACT, NAV_LINKS } from '@/lib/site-content'
import { TrackedLink } from './tracked-link'

export function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger
        className="inline-flex h-11 w-11 items-center justify-center rounded-[2px] border border-rule-strong text-ink lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent
        side="right"
        aria-describedby={undefined}
        className="site w-[88vw] max-w-sm border-l border-rule bg-paper p-0 text-ink [&>button:last-child]:hidden"
      >
        <div className="flex items-center justify-between border-b border-rule px-5 py-4">
          <SheetTitle className="font-display text-lg font-semibold text-ink">Menu</SheetTitle>
          <SheetClose
            className="inline-flex h-11 w-11 items-center justify-center rounded-[2px] border border-rule-strong"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </SheetClose>
        </div>
        <nav aria-label="Mobile" className="flex flex-col px-5">
          {[{ href: '/', label: 'Home' }, ...NAV_LINKS, { href: '/contact', label: 'Contact' }].map((l) => (
            <SheetClose asChild key={l.href}>
              <Link href={l.href} className="border-b border-rule py-4 text-xl font-medium text-ink">
                {l.label}
              </Link>
            </SheetClose>
          ))}
        </nav>
        <div className="mt-auto space-y-3 border-t border-rule px-5 py-6">
          <SheetClose asChild>
            <TrackedLink
              href="/contact"
              event="cta_click"
              location="mobile-menu"
              className="flex min-h-12 items-center justify-center rounded-[2px] bg-signal px-5 font-semibold text-white"
            >
              Book a 20-minute fit call
            </TrackedLink>
          </SheetClose>
          <TrackedLink
            href={`tel:${CONTACT.phoneE164}`}
            event="phone_click"
            location="mobile-menu"
            className="block py-2 text-graphite"
          >
            Call {CONTACT.phoneDisplay}
          </TrackedLink>
        </div>
      </SheetContent>
    </Sheet>
  )
}
