'use client'

import { AnimatedHeading, FadeUp } from '@/components/site/motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { FAQ_ITEMS } from '@/lib/faq-data'

const faqs = FAQ_ITEMS

export function FAQ() {
  return (
    <section id="faq" className="border-b border-white/15 px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <AnimatedHeading
            as="h2"
            text="Questions"
            className="font-display text-5xl font-semibold uppercase tracking-tight md:text-8xl"
          />
          <p className="font-mono text-xs uppercase tracking-widest text-white/55">
            ( Answered honestly )
          </p>
        </div>

        <FadeUp>
          <Accordion type="single" collapsible className="border-t border-white/15">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-white/15"
              >
                <AccordionTrigger className="py-6 text-left font-display text-xl font-semibold uppercase tracking-tight text-white hover:text-accent hover:no-underline md:text-2xl">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-lg leading-relaxed text-white/75">
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
