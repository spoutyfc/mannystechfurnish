import { CONTACT } from '@/lib/site-content'
import { TrackedLink } from './tracked-link'
import { PrimaryCta } from './ui'

/** Closing call to action used at the bottom of every marketing page. */
export function CtaBand({ location }: { location: string }) {
  return (
    <section className="border-t border-rule bg-surface px-4 py-16 sm:px-6 md:px-10 md:py-24">
      <div className="mx-auto grid max-w-[1200px] items-end gap-8 md:grid-cols-[1.5fr_1fr]">
        <div>
          <h2 className="max-w-[24ch] text-3xl text-ink md:text-[2.75rem]">
            Twenty minutes to find out whether this fits your firm.
          </h2>
          <p className="mt-4 max-w-[56ch] text-graphite">
            We look at your current site and how clients find you today. If it&apos;s not a fit, you&apos;ll hear
            that on the call, along with anything worth fixing on your own.
          </p>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <PrimaryCta location={location} />
          <TrackedLink href={`tel:${CONTACT.phoneE164}`} event="phone_click" location={location} className="prose-link text-[1rem]">
            Or call {CONTACT.phoneDisplay}
          </TrackedLink>
        </div>
      </div>
    </section>
  )
}
