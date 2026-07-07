'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Magnetic } from '@/components/site/motion'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from '@/components/ui/sheet'

const links = [
  { href: '/#work', label: 'Work' },
  { href: '/#services', label: 'Services' },
  { href: '/#pricing', label: 'Pricing' },
]

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 z-50 w-full border-b transition-colors duration-300 ${
        scrolled
          ? 'border-border bg-background/85 backdrop-blur-xl'
          : 'border-transparent bg-gradient-to-b from-background/70 to-transparent backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 md:px-10">
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

        <div className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <span className="hidden h-4 w-px bg-border lg:block" />
          <span className="hidden font-mono text-xs uppercase tracking-widest text-muted-foreground lg:inline">
            (925) 278-9059
          </span>
          <Magnetic strength={0.3}>
            <Link href="/contact">
              <Button
                size="sm"
                className="group rounded-full border-0 bg-accent px-6 font-mono text-xs uppercase tracking-wider text-accent-foreground hover:opacity-90"
              >
                Get Started
                <ArrowUpRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </Link>
          </Magnetic>
        </div>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-secondary">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[88vw] max-w-sm border-l border-border bg-background p-0 text-foreground [&>button]:hidden"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-border px-6 py-5">
                <SheetTitle className="text-left">
                  <Image
                    src="/images/logo.png"
                    alt="Manny's Tech Furnish"
                    width={684}
                    height={180}
                    className="h-8 w-auto"
                  />
                </SheetTitle>
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </SheetClose>
              </div>

              <nav className="flex flex-1 flex-col px-6 py-8">
                <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Menu
                </p>
                <div className="flex flex-col">
                  {links.map((l) => (
                    <SheetClose asChild key={l.href}>
                      <a
                        href={l.href}
                        className="group flex items-center justify-between border-b border-border py-5 transition-colors"
                      >
                        <span className="font-display text-2xl font-medium tracking-tight text-foreground/80 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-foreground">
                          {l.label}
                        </span>
                        <ArrowUpRight className="h-5 w-5 text-muted-foreground/40 transition-colors group-hover:text-accent" />
                      </a>
                    </SheetClose>
                  ))}
                </div>
              </nav>

              <div className="border-t border-border px-6 py-6">
                <SheetClose asChild>
                  <Link href="/contact" className="block">
                    <Button className="h-12 w-full rounded-full border-0 bg-accent font-mono text-xs uppercase tracking-wider text-accent-foreground hover:opacity-90">
                      Get Started
                    </Button>
                  </Link>
                </SheetClose>
                <a
                  href="mailto:mansoor.buspro@gmail.com"
                  className="mt-5 block font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
                >
                  mansoor.buspro@gmail.com
                </a>
                <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  (925) 278-9059
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.nav>
  )
}
