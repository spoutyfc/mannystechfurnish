'use client'

import Image from 'next/image'
import { AnimatedHeading, FadeUp, ClipReveal, Tilt } from '@/components/site/motion'
import { MessageSquare, Zap, Code2, Gauge } from 'lucide-react'

const reasons = [
  {
    icon: MessageSquare,
    title: 'Direct Communication',
    desc: 'You talk to me — the person actually building your site. No account managers, no telephone game.',
  },
  {
    icon: Zap,
    title: 'Fast Turnaround',
    desc: 'No bloated agency timelines. Most sites ship in weeks, not months, with weekly updates.',
  },
  {
    icon: Code2,
    title: 'You Own Your Code',
    desc: "It's your asset. The full codebase is transferred to you — no lock-in, no hostage situations.",
  },
  {
    icon: Gauge,
    title: 'No Bloat',
    desc: 'Hand-built, lightweight sites that load fast and rank well. No page-builder junk.',
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

        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          {/* Feature visual */}
          <ClipReveal from="left">
            <Tilt max={7} className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
              <Image
                src="/images/illo-workspace.png"
                alt="Dedicated developer workspace"
                width={1024}
                height={1024}
                className="h-auto w-full"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
                </span>
                <p className="font-mono text-xs uppercase tracking-widest text-white/85">
                  One developer. Full accountability.
                </p>
              </div>
            </Tilt>
          </ClipReveal>

          {/* Reasons grid */}
          <div className="grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {reasons.map((r, i) => (
              <FadeUp
                key={r.title}
                index={i}
                className="group flex flex-col bg-black p-7 transition-colors hover:bg-white/[0.03] md:p-8"
              >
                <r.icon className="h-9 w-9 text-accent transition-transform duration-300 group-hover:-translate-y-1" />
                <h3 className="mt-6 font-display text-2xl font-semibold uppercase tracking-tight">
                  {r.title}
                </h3>
                <p className="mt-3 leading-relaxed text-white/75">{r.desc}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
