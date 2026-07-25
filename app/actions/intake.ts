'use server'

import { randomUUID } from 'crypto'
import { db } from '@/lib/db'
import { projectIntakes } from '@/lib/db/schema'
import { PAYMENT_LINKS, type PlanType } from '@/lib/plans'

export type IntakePayload = {
  planType: PlanType | 'undecided'
  fullName: string
  email: string
  phone?: string
  company?: string
  website?: string
  projectType?: string
  industry?: string
  goals?: string[]
  features?: string[]
  designStyle?: string
  timeline?: string
  details?: string
  referral?: string
  locale?: string
  country?: string
}

export type IntakeResult =
  | { ok: true; redirectUrl: string } // proceed to Stripe
  | { ok: true; redirectUrl: null } // saved, no payment (talk-first)
  | { ok: false; error: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Persists the full project brief BEFORE payment, then (for a chosen plan)
 * returns the matching Stripe Payment Link with this brief's id attached as
 * `client_reference_id` + a prefilled email. The Stripe webhook later flips
 * this same row to 'paid'. Abandoned checkouts stay 'pending' so the lead and
 * their answers are never lost.
 */
export async function submitIntake(payload: IntakePayload): Promise<IntakeResult> {
  const fullName = payload.fullName?.trim()
  const email = payload.email?.trim().toLowerCase()

  if (!fullName || fullName.length < 2) return { ok: false, error: 'Please enter your name.' }
  if (!email || !EMAIL_RE.test(email)) return { ok: false, error: 'Please enter a valid email.' }

  const id = `itk_${randomUUID().replace(/-/g, '')}`

  try {
    await db.insert(projectIntakes).values({
      id,
      planType: payload.planType ?? 'undecided',
      fullName,
      email,
      phone: payload.phone?.trim() || null,
      company: payload.company?.trim() || null,
      website: payload.website?.trim() || null,
      projectType: payload.projectType || null,
      industry: payload.industry?.trim() || null,
      goals: payload.goals?.length ? JSON.stringify(payload.goals) : null,
      features: payload.features?.length ? JSON.stringify(payload.features) : null,
      designStyle: payload.designStyle || null,
      timeline: payload.timeline || null,
      details: payload.details?.trim() || null,
      referral: payload.referral?.trim() || null,
      locale: payload.locale || null,
      country: payload.country || null,
      paymentStatus: 'pending',
    })
  } catch (err) {
    console.error('[v0] Failed to save intake:', err)
    return { ok: false, error: 'Something went wrong saving your brief. Please try again.' }
  }

  // Talk-first path — no payment, admin follows up.
  if (payload.planType === 'undecided') {
    return { ok: true, redirectUrl: null }
  }

  const base = PAYMENT_LINKS[payload.planType]
  if (!base) return { ok: true, redirectUrl: null }

  const url = new URL(base)
  url.searchParams.set('client_reference_id', id)
  url.searchParams.set('prefilled_email', email)

  return { ok: true, redirectUrl: url.toString() }
}
