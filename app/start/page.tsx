import type { Metadata } from 'next'
import { IntakeFlow } from '@/components/intake/intake-flow'
import type { PlanType } from '@/lib/plans'

export const metadata: Metadata = {
  title: 'Start Your Project | Manny\'s Tech Furnish',
  description:
    'Tell us about your website project in a quick 2-minute questionnaire, then check out securely. Custom web design & development for businesses worldwide.',
  alternates: { canonical: '/start' },
  robots: { index: false, follow: true },
}

export default async function StartPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>
}) {
  const { plan } = await searchParams
  const initialPlan: PlanType | undefined =
    plan === 'option1' || plan === 'option2' ? plan : undefined

  return (
    <main className="min-h-screen bg-black text-white">
      <IntakeFlow initialPlan={initialPlan} />
    </main>
  )
}
