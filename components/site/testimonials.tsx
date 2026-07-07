'use client'

import { AnimatedHeading, FadeUp } from '@/components/site/motion'

const testimonials = [
  {
    quote:
      "Mansoor rebuilt our site from scratch and we started ranking #1 on Google within months. Consults tripled. He actually understands how to bring in customers, not just make things look pretty.",
    name: 'David R.',
    business: 'Structural Engineering Firm',
  },
  {
    quote:
      "Communication was the best part. Weekly updates, no surprises, delivered exactly when he said he would. Our inventory site looks premium and leads are up 200%.",
    name: 'Marcus T.',
    business: 'Auto Dealership',
  },
  {
    quote:
      "I own my code, my site is fast, and I'm not locked into some agency contract. Worth every dollar. I recommend him to every business owner I know.",
    name: 'Priya S.',
    business: 'Local Service Business',
  },
]

export function Testimonials() {
  return (
    <section className="border-b border-border px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-accent">
              Testimonials
            </p>
            <AnimatedHeading
              as="h2"
              text="What clients say."
              className="font-display text-4xl font-medium tracking-[-0.02em] md:text-6xl"
            />
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            ( Real results, real businesses )
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeUp key={t.name} index={i}>
              <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/30 md:p-8">
                <blockquote className="flex-1 text-pretty leading-relaxed text-foreground/85">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 border-t border-border pt-5">
                  <p className="font-display text-base font-medium tracking-tight text-foreground">
                    {t.name}
                  </p>
                  <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {t.business}
                  </p>
                </figcaption>
              </figure>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
