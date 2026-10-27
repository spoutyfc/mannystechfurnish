import type { Metadata } from 'next'
import { PageHeader } from '@/components/site-aec/page-header'
import { Section } from '@/components/site-aec/ui'
import { BUSINESS_NAME, CONTACT, OWNER_NAME } from '@/lib/site-content'

const PATH = '/privacy'
const EFFECTIVE = 'November 1, 2026'

export const metadata: Metadata = {
  title: 'Privacy notice',
  description: `How ${BUSINESS_NAME} collects, uses and keeps information sent through this website.`,
  alternates: { canonical: PATH },
}

const SECTIONS: { h: string; body: React.ReactNode }[] = [
  {
    h: 'Who is responsible',
    body: (
      <p>
        This website is operated by {OWNER_NAME}, doing business as {BUSINESS_NAME}, in the {CONTACT.region}.
        Questions about this notice go to {CONTACT.email} or {CONTACT.phoneDisplay}.
      </p>
    ),
  },
  {
    h: 'What is collected',
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>Contact form:</strong> the name, email, phone, firm, website, discipline and message you enter.
        </li>
        <li>
          <strong>Email and phone:</strong> whatever you choose to send if you contact me directly.
        </li>
        <li>
          <strong>Site analytics:</strong> page views and a small set of events (for example, a click on the call
          button or a completed form), using Vercel Web Analytics. It does not set cookies and does not record form
          contents or who you are.
        </li>
        <li>
          <strong>Security checks:</strong> your IP address is used briefly to limit repeated submissions and,
          through Cloudflare Turnstile, to tell people from automated spam.
        </li>
        <li>
          <strong>Payments (clients only):</strong> invoices are paid through Stripe. Card and bank details go to
          Stripe directly and are never stored on this site.
        </li>
      </ul>
    ),
  },
  {
    h: 'How it is used',
    body: (
      <p>
        To reply to your request, to provide services you have agreed to, to keep the site secure, and to
        understand which pages are useful. Information is not sold or shared for advertising, and contact form
        details are not added to marketing lists.
      </p>
    ),
  },
  {
    h: 'Service providers',
    body: (
      <p>
        Hosting and analytics: Vercel. Database: a managed Postgres provider (Neon). Email delivery: Resend. Spam
        protection: Cloudflare Turnstile. Payments: Stripe. Each processes information only to provide its
        service.
      </p>
    ),
  },
  {
    h: 'How long it is kept',
    body: (
      <p>
        Inquiries that do not become client work are deleted within 24 months. Client records are kept for as
        long as needed for the engagement and for tax and accounting requirements.
      </p>
    ),
  },
  {
    h: 'Your choices',
    body: (
      <p>
        You can ask to see, correct or delete the information you sent by emailing {CONTACT.email}. Requests are
        answered within 30 days.
      </p>
    ),
  },
  {
    h: 'Do Not Track',
    body: (
      <p>
        The site does not track visitors across other websites, so it responds the same way whether or not your
        browser sends a Do Not Track signal.
      </p>
    ),
  },
  {
    h: 'Changes',
    body: <p>If this notice changes, the new version is posted here with a new effective date.</p>,
  },
]

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        sheet="Privacy"
        crumb="Privacy"
        path={PATH}
        title="Privacy notice"
        lead={<p>Effective {EFFECTIVE}. Plain language, kept short.</p>}
      />
      <Section>
        <div className="max-w-[70ch] divide-y divide-rule border-y border-rule-strong">
          {SECTIONS.map((s) => (
            <section key={s.h} className="space-y-3 py-6 text-graphite">
              <h2 className="text-xl text-ink">{s.h}</h2>
              {s.body}
            </section>
          ))}
        </div>
      </Section>
    </>
  )
}
