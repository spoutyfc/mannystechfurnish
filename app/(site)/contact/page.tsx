import type { Metadata } from 'next'
import { FitCallForm } from '@/components/site-aec/fit-call-form'
import { PageHeader } from '@/components/site-aec/page-header'
import { TrackedLink } from '@/components/site-aec/tracked-link'
import { Section } from '@/components/site-aec/ui'
import { CONTACT } from '@/lib/site-content'

const PATH = '/contact'
const DESCRIPTION =
  'Request a 20-minute fit call about your engineering or construction firm’s website. Replies within two business days.'

export const metadata: Metadata = {
  title: 'Book a 20-minute fit call',
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: 'Book a 20-minute fit call', description: DESCRIPTION, url: PATH },
}

const AGENDA = [
  'A quick look at your current site and how clients find you today',
  'What kinds of projects and clients you want more of',
  'Whether the AEC Digital Growth Partner offer fits — and if not, what you could fix yourself',
  'If it fits: the next available kickoff date and a written scope',
]

export default function ContactPage() {
  return (
    <>
      <PageHeader
        sheet="S-09 · Contact"
        crumb="Contact"
        path={PATH}
        title="Book a 20-minute fit call."
        lead={
          <p>
            Tell me a little about your firm and I&apos;ll reply within two business days to set a time. No
            preparation needed, and no obligation.
          </p>
        }
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <div>
            <h2 className="text-2xl text-ink">What we&apos;ll cover</h2>
            <ol className="mt-4 border-t border-rule-strong">
              {AGENDA.map((a, i) => (
                <li key={a} className="grid grid-cols-[2.5rem_1fr] border-b border-rule py-3">
                  <span className="font-plex text-[0.8125rem] text-signal">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-ink">{a}</span>
                </li>
              ))}
            </ol>
            <h2 className="mt-10 text-2xl text-ink">Prefer to call or email?</h2>
            <ul className="mt-4 space-y-2">
              <li>
                <TrackedLink href={`tel:${CONTACT.phoneE164}`} event="phone_click" location="contact-page" className="prose-link">
                  {CONTACT.phoneDisplay}
                </TrackedLink>
              </li>
              <li>
                <TrackedLink href={`mailto:${CONTACT.email}`} event="email_click" location="contact-page" className="prose-link break-all">
                  {CONTACT.email}
                </TrackedLink>
              </li>
            </ul>
          </div>
          <div>
            <FitCallForm />
          </div>
        </div>
      </Section>
    </>
  )
}
