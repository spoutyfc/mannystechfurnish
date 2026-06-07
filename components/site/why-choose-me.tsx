'use client'

import { AnimatedHeading, FadeUp } from '@/components/site/motion'
import { MessageSquare, Zap, Code2, Gauge } from 'lucide-react'

const reasons = [
  {
    icon: MessageSquare,
    title: 'Direct Communication',
    desc: 'You talk to me — the person actually building your site. No account managers, no telephone game, no waiting weeks for a reply.',
  },
  {
    icon: Zap,
    title: 'Fast Turnaround',
    desc: 'No bloated agency timelines. Most sites ship in weeks, not months, with weekly updates so you always know where things stand.',
  },
  {
    icon: Code2,
    title: 'You Own Your Code',
    desc: "It's your business and your asset. The full codebase is transferred to you — no hostage situations, no platform lock-in.",
  },
  {
    icon: Gauge,
    title: 'No Bloat',
    desc: 'Hand-built, lightweight sites that load fast and rank well. No page-builder junk slowing you down or dragging your SEO.',
  },
]

export function WhyChooseMe() {
  return (
    <section className="border-b border-white/15 px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <AnimatedHeading
            as="h2"
            text="Why Not An Agency"
            className="max-w-[12ch] font-display text-5xl font-semibold uppercase leading-[0.9] tracking-tight md:text-8xl"
          />
          <p className="max-w-xs font-mono text-xs uppercase tracking-widest text-white/55">
            One dedicated developer beats a faceless agency — every time.
          </p>
        </div>

        <div className="grid border-t border-white/15 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <FadeUp
              key={r.title}
              index={i}
              className={`group flex flex-col border-b border-white/15 py-10 transition-colors hover:bg-white/[0.03] sm:border-b-0 lg:py-12 ${
                i !== 0 ? 'lg:border-l lg:pl-8' : 'lg:pr-8'
              } ${i > 0 && i < 3 ? 'lg:px-8' : ''} ${i === 3 ? 'lg:pl-8' : ''} ${
                i === 0 ? 'sm:border-r sm:pr-8' : ''
              } ${i === 2 ? 'sm:border-r sm:pr-8' : ''} ${i === 1 ? 'sm:pl-8' : ''} ${
                i === 3 ? 'sm:pl-8' : ''
              }`}
            >
              <r.icon className="h-9 w-9 text-accent transition-transform group-hover:-translate-y-1" />
              <h3 className="mt-6 font-display text-2xl font-semibold uppercase tracking-tight">
                {r.title}
              </h3>
              <p className="mt-3 leading-relaxed text-white/75">{r.desc}</p>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
