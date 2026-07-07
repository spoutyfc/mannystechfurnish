'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Inbox, LinkIcon, LogOut, Menu, X, ExternalLink } from 'lucide-react'

const NAV = [
  { key: 'submissions', label: 'Inbox', href: '/admin', icon: Inbox },
  { key: 'payments', label: 'Payments', href: '/admin/clients', icon: LinkIcon },
] as const

export type AdminNavKey = (typeof NAV)[number]['key']

export function AdminShell({
  active,
  adminEmail,
  title,
  subtitle,
  actions,
  badge,
  children,
}: {
  active: AdminNavKey
  adminEmail?: string
  title: string
  subtitle?: string
  actions?: React.ReactNode
  badge?: React.ReactNode
  children: React.ReactNode
}) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const signOut = async () => {
    await fetch('/api/admin-logout', { method: 'POST' })
    router.push('/admin-login')
  }

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const Icon = item.icon
        const isActive = item.key === active
        return (
          <Link
            key={item.key}
            href={item.href}
            onClick={onNavigate}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
              isActive
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
            }`}
          >
            <Icon className={`h-4 w-4 ${isActive ? 'text-accent' : ''}`} />
            <span className="font-medium">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card/40 px-4 py-6 lg:flex">
        <div className="px-2">
          <Image
            src="/images/logo.png"
            alt="Manny's Tech Furnish"
            width={684}
            height={180}
            className="h-8 w-auto"
          />
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Admin Console
          </p>
        </div>

        <div className="mt-8 flex-1">
          <NavLinks />
        </div>

        <div className="border-t border-border pt-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="font-medium">View site</span>
          </Link>
          {adminEmail && (
            <div className="mt-3 flex items-center gap-3 px-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                {adminEmail.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs text-foreground">{adminEmail}</p>
                <button
                  onClick={signOut}
                  className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/85 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Image
          src="/images/logo.png"
          alt="Manny's Tech Furnish"
          width={684}
          height={180}
          className="h-7 w-auto"
        />
        <button
          onClick={() => setMenuOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-[82vw] max-w-xs flex-col border-l border-border bg-card px-4 py-6">
            <div className="mb-8 flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Menu
              </p>
              <button
                onClick={() => setMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavLinks onNavigate={() => setMenuOpen(false)} />
            <div className="mt-auto border-t border-border pt-4">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4" /> View site
              </Link>
              {adminEmail && (
                <button
                  onClick={signOut}
                  className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
                  {title}
                </h1>
                {badge}
              </div>
              {subtitle && (
                <p className="mt-1.5 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}
