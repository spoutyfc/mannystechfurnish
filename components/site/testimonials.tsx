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
    <section className="border-b border-white/15 px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <AnimatedHeading
            as="h2"
            text="What Clients Say"
            className="font-display text-5xl font-semibold uppercase tracking-tight md:text-8xl"
          />
          <p className="font-mono text-xs uppercase tracking-widest text-white/55">
            ( Real results, real businesses )
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeUp key={t.name} index={i}>
              <figure className="flex h-full flex-col border-l-2 border-accent bg-white/[0.03] p-6 transition-colors hover:bg-white/[0.06] md:p-8">
                <blockquote className="flex-1 text-pretty text-lg leading-relaxed text-white/85">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 border-t border-white/15 pt-5">
                  <p className="font-display text-lg font-semibold uppercase tracking-tight text-white">
                    {t.name}
                  </p>
                  <p className="mt-1 font-mono text-xs uppercase tracking-widest text-accent">
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
