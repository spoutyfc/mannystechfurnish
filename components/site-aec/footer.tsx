import Link from 'next/link'
import { BUSINESS_NAME, CONTACT, NAV_LINKS, OWNER_NAME } from '@/lib/site-content'
import { TrackedLink } from './tracked-link'

const linkClass = 'underline decoration-[#6b7177] underline-offset-4 hover:decoration-white'

export function SiteFooter() {
  return (
    <footer className="bg-ink px-4 py-14 text-[#e7e8e5] sm:px-6 md:px-10">
      <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-xl font-semibold text-white">{BUSINESS_NAME}</p>
          <p className="mt-3 max-w-[40ch] text-[1rem] text-[#c4c7c3]">
            Website and local search partner for engineering and construction firms. Run by {OWNER_NAME},
            web developer, {CONTACT.region}. Not an engineering firm; no engineering services are offered.
          </p>
        </div>
        <div>
          <p className="font-plex text-[0.8125rem] uppercase tracking-[0.08em] text-[#aeb2ad]">Contact</p>
          <ul className="mt-3 space-y-2 text-[1rem]">
            <li>
              <TrackedLink href={`tel:${CONTACT.phoneE164}`} event="phone_click" location="footer" className={linkClass}>
                {CONTACT.phoneDisplay}
              </TrackedLink>
            </li>
            <li>
              <TrackedLink
                href={`mailto:${CONTACT.email}`}
                event="email_click"
                location="footer"
                className={`break-all ${linkClass}`}
              >
                {CONTACT.email}
              </TrackedLink>
            </li>
            <li>
              <Link href="/contact" className={linkClass}>
                Book a fit call
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-plex text-[0.8125rem] uppercase tracking-[0.08em] text-[#aeb2ad]">Site</p>
          <ul className="mt-3 space-y-2 text-[1rem]">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/privacy" className={linkClass}>
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/accessibility" className={linkClass}>
                Accessibility
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-[1200px] border-t border-[#3a3f44] pt-6 text-[0.9375rem] text-[#aeb2ad]">
        &copy; {new Date().getFullYear()} {BUSINESS_NAME}. Client names and screenshots describe work delivered;
        they are not endorsements.
      </p>
    </footer>
  )
}
