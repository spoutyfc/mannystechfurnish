import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { TrackedLink } from './tracked-link'

/** Sheet label that opens every section, like a drawing-set sheet number. */
export function SheetLabel({ sheet, children }: { sheet: string; children: ReactNode }) {
  return (
    <p className="flex items-center gap-3 border-t border-white/15 pt-4 font-plex text-xs uppercase tracking-[0.2em] text-graphite">
      <span className="text-accent">( {sheet} )</span>
      <span aria-hidden="true">·</span>
      <span>{children}</span>
    </p>
  )
}

export function Section({
  id,
  className,
  children,
}: {
  id?: string
  className?: string
  children: ReactNode
}) {
  return (
    <section id={id} className={cn('px-4 py-16 sm:px-6 md:px-10 md:py-28', className)}>
      <div className="mx-auto max-w-[1200px]">{children}</div>
    </section>
  )
}

export function PrimaryCta({
  location,
  className,
  children = 'Book a 20-minute fit call',
}: {
  location: string
  className?: string
  children?: ReactNode
}) {
  return (
    <TrackedLink
      href="/contact"
      event="cta_click"
      location={location}
      className={cn(
        'inline-flex min-h-12 items-center justify-center gap-2 bg-accent px-8 py-4 text-sm font-semibold uppercase tracking-wider text-black transition-opacity hover:opacity-90',
        className,
      )}
    >
      {children}
    </TrackedLink>
  )
}

export function SecondaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex min-h-12 items-center justify-center border border-white/30 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black"
    >
      {children}
    </a>
  )
}

/** Plain two-column schedule: label on the left, value on the right. */
export function Schedule({ rows }: { rows: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="divide-y divide-rule border-y border-rule-strong">
      {rows.map((r) => (
        <div key={r.label} className="grid gap-1 py-3 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-6">
          <dt className="font-plex text-[0.8125rem] uppercase tracking-[0.06em] text-graphite">{r.label}</dt>
          <dd className="text-ink">{r.value}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Numbered list styled as a drawing schedule; used instead of icon cards. */
export function NumberedList({ items }: { items: { title: string; detail: ReactNode }[] }) {
  return (
    <ol className="border-t border-rule-strong">
      {items.map((item, i) => (
        <li key={item.title} className="grid gap-2 border-b border-rule py-6 md:grid-cols-[4rem_minmax(0,18rem)_1fr] md:gap-8">
          <span className="font-plex text-[0.8125rem] text-signal">{String(i + 1).padStart(2, '0')}</span>
          <h3 className="text-xl text-ink md:text-[1.375rem]">{item.title}</h3>
          <div className="text-graphite">{item.detail}</div>
        </li>
      ))}
    </ol>
  )
}
