'use client'

import { AnimatedHeading, FadeUp } from '@/components/site/motion'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    quote:
      "Mansoor rebuilt our site from scratch and we started ranking #1 on Google within months. Consults tripled. He actually understands how to bring in customers, not just make things look pretty.",
    name: 'David R.',
    business: 'Structural Engineering Firm',
    index: '01',
  },
  {
    quote:
      "Communication was the best part. Weekly updates, no surprises, delivered exactly when he said he would. Our inventory site looks premium and leads are up 200%.",
    name: 'Marcus T.',
    business: 'Auto Dealership',
    index: '02',
  },
  {
    quote:
      "I own my code, my site is fast, and I'm not locked into some agency contract. Worth every dollar. I recommend him to every business owner I know.",
    name: 'Priya S.',
    business: 'Local Service Business',
    index: '03',
  },
]

export function Testimonials() {
  return (
    <section className="border-b border-border bg-card px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
              Testimonials
            </p>
            <AnimatedHeading
              as="h2"
              text="What clients say."
              className="font-display text-4xl font-semibold tracking-[-0.03em] md:text-6xl"
            />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Real results, real businesses
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeUp key={t.name} index={i}>
              <figure className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:border-accent/30 md:p-8">
                {/* Top row: index + quote icon */}
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground/40">
                    {t.index}
                  </span>
                  <Quote className="h-5 w-5 text-accent/40 transition-colors group-hover:text-accent/70" />
                </div>
                <blockquote className="flex-1 text-pretty leading-relaxed text-foreground/80">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-8 border-t border-border pt-5">
                  <p className="font-display text-base font-semibold tracking-tight text-foreground">
                    {t.name}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {t.business}
                  </p>
                </figcaption>
                {/* Teal bottom accent */}
                <span className="absolute bottom-0 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full" />
              </figure>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
