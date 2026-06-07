import { notFound } from 'next/navigation'
import { getClientBySlug } from '@/app/actions/payment'
import { PLAN_DETAILS, type PlanType } from '@/lib/plans'
import PayClient from './pay-client'

export const dynamic = 'force-dynamic'

export default async function ClientCheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ canceled?: string }>
}) {
  const { slug } = await params
  const { canceled } = await searchParams
  const client = await getClientBySlug(slug)

  if (!client) notFound()

  const planType = client.planType as PlanType
  const plan = PLAN_DETAILS[planType]

  return (
    <PayClient
      slug={client.slug}
      name={client.name}
      companyName={client.companyName}
      planType={planType}
      plan={plan}
      alreadyPaid={client.paymentStatus === 'completed'}
      canceled={canceled === 'true'}
    />
  )
}
