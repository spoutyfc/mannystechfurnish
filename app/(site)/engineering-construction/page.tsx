import type { Metadata } from 'next'
import Link from 'next/link'
import { CtaBand } from '@/components/site-aec/cta-band'
import { PageHeader } from '@/components/site-aec/page-header'
import { Section, SheetLabel } from '@/components/site-aec/ui'

const PATH = '/engineering-construction'
const DESCRIPTION =
  'What a website needs to do for structural, geotechnical, civil, surveying, general engineering and design-build firms, and how that work is approached.'

export const metadata: Metadata = {
  title: 'Structural, Geotechnical, Civil, Surveying & Design-Build Firms',
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: 'Structural, Geotechnical, Civil, Surveying & Design-Build Firms', description: DESCRIPTION, url: PATH },
}

const DISCIPLINES = [
  {
    name: 'Structural engineering',
    buyers: 'Homeowners, architects, contractors, property managers',
    needs: [
      'Separate pages for the problems people search for: seismic retrofit, foundation repair, load-bearing wall removal, ADU and addition plans, inspections',
      'Project profiles with building type, scope and location, written so an architect can judge fit quickly',
      'City pages only where the firm actually works, each with real local projects or code context',
    ],
  },
  {
    name: 'Geotechnical engineering',
    buyers: 'Developers, architects, structural engineers, public agencies, homeowners on hillside lots',
    needs: [
      'Clear explanations of investigations, foundation recommendations, slope stability and observation during construction',
      'Service-area coverage that reflects real geology and permitting differences, not copied city names',
      'An inquiry form that asks for the details needed to scope a report: site address, project type, timeline',
    ],
  },
  {
    name: 'Civil engineering and land surveying',
    buyers: 'Developers, homeowners, title companies, attorneys, municipalities',
    needs: [
      'Plain descriptions of boundary, topographic and ALTA surveys, lot-line adjustments, grading and drainage',
      'Service-area and turnaround information that answers the first questions before the phone call',
      'Licensing shown accurately and linked to the public state record',
    ],
  },
  {
    name: 'General engineering contractors and design-build',
    buyers: 'Owners, developers, homeowners, public agencies',
    needs: [
      'Project galleries organized by project type, with scope and location',
      'Contractor license number displayed and linked to the CSLB lookup',
      'Consultation or bid-request paths that separate residential from commercial inquiries',
    ],
  },
]

const PRINCIPLES = [
  'Your licensed staff approve every statement about engineering scope, methods or qualifications. I don’t write engineering claims on my own authority.',
  'No doorway pages. A city page exists only if there is something specific to say about the work you do there.',
  'Project information is published only with the permission it needs; owner names and addresses are left out unless the client agrees.',
  'Licenses are shown as they appear on the public state record, with a link so visitors can check them.',
]

export default function EngineeringConstructionPage() {
  return (
    <>
      <PageHeader
        sheet="S-02 · Who it’s for"
        crumb="Who it’s for"
        path={PATH}
        title="Built for firms whose work is technical and whose clients need to trust it."
        lead={
          <p>
            Engineering and construction clients hire on qualifications, track record and confidence that you
            have done this kind of job before. A good firm website makes that easy to see. Here is what that
            means for each kind of practice I work with.
          </p>
        }
      />

      <Section>
        <SheetLabel sheet="2.1">By discipline</SheetLabel>
        <div className="mt-6 divide-y divide-rule border-y border-rule-strong">
          {DISCIPLINES.map((d) => (
            <article key={d.name} className="grid gap-4 py-8 lg:grid-cols-[20rem_1fr] lg:gap-10">
              <div>
                <h2 className="text-2xl text-ink">{d.name}</h2>
                <p className="mt-2 text-[1rem] text-graphite">
                  <span className="font-plex text-[0.8125rem] uppercase tracking-[0.06em]">Typical clients: </span>
                  {d.buyers}
                </p>
              </div>
              <ul className="space-y-3">
                {d.needs.map((n) => (
                  <li key={n} className="flex gap-3 text-ink">
                    <span aria-hidden="true" className="mt-[0.75em] h-px w-3 shrink-0 bg-signal" />
                    {n}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="mt-6 max-w-[68ch] text-graphite">
          MEP engineers and other principal-led technical firms are a fit too; the same approach applies.
        </p>
      </Section>

      <Section className="bg-surface">
        <SheetLabel sheet="2.2">Working rules</SheetLabel>
        <h2 className="mt-6 max-w-[28ch] text-3xl text-ink md:text-[2.5rem]">
          How I handle technical content and local pages.
        </h2>
        <ol className="mt-8 border-t border-rule-strong">
          {PRINCIPLES.map((p, i) => (
            <li key={p} className="grid gap-2 border-b border-rule py-5 md:grid-cols-[4rem_1fr]">
              <span className="font-plex text-[0.8125rem] text-signal">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-ink">{p}</span>
            </li>
          ))}
        </ol>
        <p className="mt-8">
          <Link href="/work" className="prose-link">
            See how this looks on live engineering sites
          </Link>
        </p>
      </Section>

      <CtaBand location="disciplines-footer" />
    </>
  )
}
