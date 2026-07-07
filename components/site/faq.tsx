'use client'

import { AnimatedHeading, FadeUp } from '@/components/site/motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    q: 'How long does a website take?',
    a: 'Most projects ship in 2–4 weeks depending on scope. After our consultation I give you a clear timeline, and you get weekly updates the whole way through so you always know where things stand.',
  },
  {
    q: 'Do I own the code?',
    a: 'Yes. With the one-time package the full codebase is transferred to you immediately — no platform lock-in, no hostage situations. On the monthly plan you can buy out the code at the end of the term.',
  },
  {
    q: 'What if I need changes later?',
    a: "You've got options. You can handle updates yourself since you own the code, or grab the optional care plan (from $70/mo) where I handle updates, security, and tweaks for you.",
  },
  {
    q: 'Do you do ongoing SEO?',
    a: 'Every site ships with strong SEO foundations built in — schema markup, sitemaps, speed tuning, and on-page optimization. For ongoing SEO and content work, I offer monthly retainers we can scope to your goals.',
  },
  {
    q: 'How do payments work?',
    a: 'Simple and secure through Stripe. The one-time package is a single payment; the managed plan is a setup fee plus monthly. I send you a private payment link once we agree on scope — no hidden fees, ever.',
  },
]

export function FAQ() {
  return (
    <section id="faq" className="border-b border-border px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-accent">
              FAQ
            </p>
            <AnimatedHeading
              as="h2"
              text="Questions."
              className="font-display text-4xl font-medium tracking-[-0.02em] md:text-6xl"
            />
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            ( Answered honestly )
          </p>
        </div>

        <FadeUp>
          <Accordion type="single" collapsible className="border-t border-border">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-border"
              >
                <AccordionTrigger className="py-6 text-left font-display text-lg font-medium tracking-tight text-foreground hover:text-accent hover:no-underline md:text-xl">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="pb-6 leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeUp>
      </div>
    </section>
  )
}
