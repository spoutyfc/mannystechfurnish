'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from '@/components/ui/sheet'

const links = [
  { href: '#work', label: 'Work' },
  { href: '#services', label: 'Services' },
  { href: '#pricing', label: 'Pricing' },
]

export function SiteNav() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/15 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 md:px-10">
        <Link href="/" className="flex items-center" aria-label="Manny's Tech Furnish home">
          <Image
            src="/images/logo.png"
            alt="Manny's Tech Furnish"
            width={684}
            height={180}
            priority
            className="h-9 w-auto md:h-10"
          />
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-xs uppercase tracking-widest text-white/70 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
          <Link href="/contact">
            <Button
              size="sm"
              className="rounded-none border-0 bg-accent px-6 font-mono text-xs uppercase tracking-wider text-black hover:opacity-90"
            >
              Get Started
            </Button>
          </Link>
        </div>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="border-white/15 bg-black text-white">
            <SheetTitle className="text-left">
              <Image
                src="/images/logo.png"
                alt="Manny's Tech Furnish"
                width={684}
                height={180}
                className="h-9 w-auto"
              />
            </SheetTitle>
            <div className="mt-8 flex flex-col gap-6">
              {links.map((l) => (
                <SheetClose asChild key={l.href}>
                  <a
                    href={l.href}
                    className="text-lg text-white/80 transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <Link href="/contact">
                  <Button className="w-full rounded-none border-0 bg-accent text-black hover:opacity-90">
                    Get Started
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
