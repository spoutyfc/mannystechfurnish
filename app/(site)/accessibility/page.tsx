import type { Metadata } from 'next'
import { PageHeader } from '@/components/site-aec/page-header'
import { Section } from '@/components/site-aec/ui'
import { CONTACT } from '@/lib/site-content'

const PATH = '/accessibility'

export const metadata: Metadata = {
  title: 'Accessibility',
  description: 'The accessibility standard this website aims for, how it is tested, and how to report a problem.',
  alternates: { canonical: PATH },
}

export default function AccessibilityPage() {
  return (
    <>
      <PageHeader
        sheet="Accessibility"
        crumb="Accessibility"
        path={PATH}
        title="Accessibility"
        lead={<p>This site aims to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA.</p>}
      />
      <Section>
        <div className="max-w-[70ch] space-y-6 text-graphite">
          <p>
            Pages are built with semantic HTML, work with a keyboard alone, show a visible focus outline, and keep
            body text at 17px or larger with strong contrast. Animation is kept to small colour changes, and those
            are switched off when your device asks for reduced motion.
          </p>
          <p>
            Each release is checked with automated tools and by hand at phone, tablet and desktop widths. Automated
            checks do not catch everything, so problems may still exist.
          </p>
          <p>
            If something on this site is hard to use, please tell me at{' '}
            <a className="prose-link" href={`mailto:${CONTACT.email}`}>
              {CONTACT.email}
            </a>{' '}
            or {CONTACT.phoneDisplay}. Say which page and what happened, and I&apos;ll reply within two business days
            and offer the information another way in the meantime.
          </p>
          <p className="text-[1rem]">Last reviewed October 2026.</p>
        </div>
      </Section>
    </>
  )
}
