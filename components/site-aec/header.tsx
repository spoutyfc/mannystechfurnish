import Image from 'next/image'
import Link from 'next/link'
import { MobileMenu } from './mobile-menu'
import { NavLinks } from './nav-links'
import { PrimaryCta } from './ui'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/15 bg-black/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-4 py-3 sm:px-6 md:px-10">
        <Link href="/" className="flex items-center" aria-label="Manny's Tech Furnish, home">
          <Image src="/images/logo.png" alt="Manny's Tech Furnish" width={684} height={180} priority className="h-9 w-auto md:h-10" />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          <NavLinks />
          <PrimaryCta location="header" className="min-h-10 px-6 py-2.5 text-xs">
            Book a fit call
          </PrimaryCta>
        </nav>
        <MobileMenu />
      </div>
    </header>
  )
}
