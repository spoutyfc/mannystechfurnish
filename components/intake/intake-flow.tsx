'use client'

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  ShieldCheck,
  CornerDownLeft,
  PartyPopper,
} from 'lucide-react'
import { submitIntake, type IntakePayload } from '@/app/actions/intake'
import { PLAN_DETAILS, type PlanType } from '@/lib/plans'

type StepKind = 'welcome' | 'text' | 'email' | 'tel' | 'single' | 'multi' | 'plan' | 'textarea' | 'review'

type Option = { value: string; label: string; hint?: string }

type Step = {
  key: keyof FormData | 'welcome' | 'review'
  kind: StepKind
  question: string
  subtitle?: string
  placeholder?: string
  options?: Option[]
  optional?: boolean
}

type FormData = {
  fullName: string
  email: string
  phone: string
  company: string
  projectType: string
  industry: string
  website: string
  goals: string[]
  features: string[]
  designStyle: string
  timeline: string
  planType: PlanType | 'undecided' | ''
  details: string
  referral: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const STEPS: Step[] = [
  { key: 'welcome', kind: 'welcome', question: '' },
  { key: 'fullName', kind: 'text', question: "First, what's your name?", subtitle: "We'll keep this personal.", placeholder: 'Your full name' },
  { key: 'email', kind: 'email', question: "What's the best email to reach you?", subtitle: "Your brief and next steps go here.", placeholder: 'you@company.com' },
  { key: 'phone', kind: 'tel', question: 'A phone number?', subtitle: 'Optional — handy for quick project questions.', placeholder: '+1 (555) 000-0000', optional: true },
  { key: 'company', kind: 'text', question: "What's your business called?", subtitle: 'Optional — the name of your company or brand.', placeholder: 'Business / brand name', optional: true },
  {
    key: 'projectType', kind: 'single', question: 'What do you need built?',
    options: [
      { value: 'new', label: 'A brand new website' },
      { value: 'redesign', label: 'A redesign of my current site' },
      { value: 'ecommerce', label: 'An online store' },
      { value: 'webapp', label: 'A web app / custom tool' },
      { value: 'unsure', label: "I'm not sure yet" },
    ],
  },
  { key: 'industry', kind: 'text', question: 'What industry are you in?', subtitle: 'So the design fits your world.', placeholder: 'e.g. Construction, dental, auto, coaching…', optional: true },
  { key: 'website', kind: 'text', question: 'Do you have a website now?', subtitle: 'Optional — paste the link if you do.', placeholder: 'https://…', optional: true },
  {
    key: 'goals', kind: 'multi', question: "What's the #1 job of this site?", subtitle: 'Pick everything that applies.',
    options: [
      { value: 'leads', label: 'Get more leads & inquiries' },
      { value: 'sell', label: 'Sell products or services' },
      { value: 'credibility', label: 'Look more credible & professional' },
      { value: 'seo', label: 'Rank higher on Google' },
      { value: 'bookings', label: 'Take bookings & appointments' },
      { value: 'showcase', label: 'Showcase my work / portfolio' },
    ],
  },
  {
    key: 'features', kind: 'multi', question: 'Which features do you want?', subtitle: 'Pick any — we can advise on the rest.',
    options: [
      { value: 'forms', label: 'Contact forms' },
      { value: 'booking', label: 'Online booking / scheduling' },
      { value: 'blog', label: 'Blog / editable content (CMS)' },
      { value: 'payments', label: 'Online payments' },
      { value: 'i18n', label: 'Multiple languages' },
      { value: 'motion', label: 'Animations & 3D' },
      { value: 'analytics', label: 'Analytics dashboard' },
    ],
  },
  {
    key: 'designStyle', kind: 'single', question: "What's your style?",
    options: [
      { value: 'bold', label: 'Bold & modern' },
      { value: 'minimal', label: 'Clean & minimal' },
      { value: 'premium', label: 'Elegant & premium' },
      { value: 'vibrant', label: 'Playful & vibrant' },
      { value: 'guide', label: 'Not sure — guide me' },
    ],
  },
  {
    key: 'timeline', kind: 'single', question: 'When do you want to launch?',
    options: [
      { value: 'asap', label: 'As soon as possible' },
      { value: '2-4w', label: 'In 2–4 weeks' },
      { value: '1-2m', label: 'In 1–2 months' },
      { value: 'flexible', label: "I'm flexible" },
    ],
  },
  {
    key: 'planType', kind: 'plan', question: 'Which plan works for you?', subtitle: 'You can change this later — this just gets us started.',
  },
  { key: 'details', kind: 'textarea', question: 'Anything else we should know?', subtitle: 'Optional — inspiration, must-haves, competitors, colors…', placeholder: 'Tell us more about your vision…', optional: true },
  {
    key: 'referral', kind: 'single', question: 'How did you find us?', subtitle: 'Optional — helps us reach more people like you.', optional: true,
    options: [
      { value: 'google', label: 'Google search' },
      { value: 'referral', label: 'A referral / word of mouth' },
      { value: 'social', label: 'Social media' },
      { value: 'work', label: 'Saw a site you built' },
      { value: 'other', label: 'Somewhere else' },
    ],
  },
  { key: 'review', kind: 'review', question: 'Ready to kick things off?' },
]

const EMPTY: FormData = {
  fullName: '', email: '', phone: '', company: '', projectType: '', industry: '', website: '',
  goals: [], features: [], designStyle: '', timeline: '', planType: '', details: '', referral: '',
}

export function IntakeFlow({ initialPlan }: { initialPlan?: PlanType }) {
  const [data, setData] = useState<FormData>({ ...EMPTY, planType: initialPlan ?? '' })
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState<1 | -1>(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  // Capture locale + country for international lead tracking.
  const localeRef = useRef<{ locale: string; country: string }>({ locale: '', country: '' })
  useEffect(() => {
    try {
      const locale = navigator.language || ''
      let country = ''
      try {
        country = new Intl.Locale(locale).region || ''
      } catch {
        country = locale.split('-')[1] || ''
      }
      localeRef.current = { locale, country }
    } catch {
      /* noop */
    }
  }, [])

  const step = STEPS[index]
  const total = STEPS.length
  const progress = Math.round((index / (total - 1)) * 100)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 350)
    return () => clearTimeout(t)
  }, [index])

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setData((d) => ({ ...d, [key]: value }))

  const toggleMulti = (key: 'goals' | 'features', value: string) =>
    setData((d) => {
      const arr = d[key]
      return { ...d, [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] }
    })

  const canAdvance = useMemo(() => {
    if (step.kind === 'welcome' || step.kind === 'review') return true
    if (step.optional) return true
    const key = step.key as keyof FormData
    const val = data[key]
    if (step.kind === 'email') return EMAIL_RE.test(String(val).trim())
    if (step.kind === 'plan') return val !== ''
    if (Array.isArray(val)) return true
    return String(val).trim().length > 0
  }, [step, data])

  const go = (delta: 1 | -1) => {
    setError(null)
    setDir(delta)
    setIndex((i) => Math.min(Math.max(i + delta, 0), total - 1))
  }

  const next = () => {
    if (!canAdvance) {
      setError(step.kind === 'email' ? 'Please enter a valid email.' : 'This field is required.')
      return
    }
    if (index < total - 1) go(1)
  }

  const onKey = (e: KeyboardEvent) => {
    // Respect IME composition (CJK) + Safari's unreliable final event.
    if (e.nativeEvent?.isComposing || e.keyCode === 229) return
    if (e.key === 'Enter' && step.kind !== 'textarea') {
      e.preventDefault()
      next()
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)
    const payload: IntakePayload = {
      planType: (data.planType || 'undecided') as PlanType | 'undecided',
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      company: data.company,
      website: data.website,
      projectType: data.projectType,
      industry: data.industry,
      goals: data.goals,
      features: data.features,
      designStyle: data.designStyle,
      timeline: data.timeline,
      details: data.details,
      referral: data.referral,
      locale: localeRef.current.locale,
      country: localeRef.current.country,
    }
    const res = await submitIntake(payload)
    if (!res.ok) {
      setError(res.error)
      setSubmitting(false)
      return
    }
    if (res.redirectUrl) {
      window.location.href = res.redirectUrl
      return
    }
    setDone(true)
    setSubmitting(false)
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg text-center"
        >
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-accent/15">
            <PartyPopper className="h-8 w-8 text-accent" />
          </div>
          <h1 className="font-display text-4xl font-extrabold uppercase leading-[0.95]">
            Got it, {data.fullName.split(' ')[0] || 'thanks'}!
          </h1>
          <p className="mt-4 leading-relaxed text-white/60">
            Your project brief is in. Mansoor will personally review it and reach out within one
            business day to map out the plan and pricing that fits best.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent hover:underline"
          >
            Back to site <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      {/* progress bar */}
      <div className="fixed inset-x-0 top-0 z-50 h-1 bg-white/10">
        <motion.div
          className="h-full bg-accent"
          animate={{ width: `${progress}%` }}
          transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
        />
      </div>

      {/* top bar */}
      <div className="fixed inset-x-0 top-1 z-40 flex items-center justify-between px-5 py-4 md:px-10">
        <Link href="/" aria-label="Manny's Tech Furnish home">
          <Image src="/images/logo.png" alt="Manny's Tech Furnish" width={684} height={180} className="h-7 w-auto md:h-8" priority />
        </Link>
        {index > 0 && (
          <button
            onClick={() => go(-1)}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        )}
      </div>

      {/* ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[36rem] w-[36rem] rounded-full bg-accent/10 blur-[150px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-3xl items-center px-5 py-24 md:px-8">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={index}
            custom={dir}
            initial={{ opacity: 0, y: dir * 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: dir * -40 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {step.kind === 'welcome' ? (
              <div>
                <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">Project intake · 2 minutes</p>
                <h1 className="font-display text-5xl font-extrabold uppercase leading-[0.92] text-balance md:text-7xl">
                  Let&apos;s build
                  <br /> something great.
                </h1>
                <p className="mt-6 max-w-md text-lg leading-relaxed text-white/60">
                  A few quick questions so we understand your project before you pay a cent.
                  {initialPlan ? ` You picked the ${PLAN_DETAILS[initialPlan].title}.` : ''}
                </p>
                <button
                  onClick={next}
                  className="group mt-10 inline-flex items-center gap-3 bg-accent px-8 py-4 font-mono text-xs uppercase tracking-widest text-black transition-opacity hover:opacity-90"
                >
                  Start
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-white/30">
                  Press Enter ↵
                </p>
              </div>
            ) : step.kind === 'review' ? (
              <ReviewStep data={data} onSubmit={handleSubmit} submitting={submitting} />
            ) : (
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <span className="font-mono text-xs text-accent">{String(index).padStart(2, '0')}</span>
                  <span className="h-px w-6 bg-white/20" />
                  {step.optional && (
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">Optional</span>
                  )}
                </div>
                <h2 className="font-display text-3xl font-bold uppercase leading-[1.02] text-balance md:text-5xl">
                  {step.question}
                </h2>
                {step.subtitle && <p className="mt-4 text-lg text-white/50">{step.subtitle}</p>}

                <div className="mt-8">
                  {(step.kind === 'text' || step.kind === 'email' || step.kind === 'tel') && (
                    <input
                      ref={(el) => { inputRef.current = el }}
                      type={step.kind === 'email' ? 'email' : step.kind === 'tel' ? 'tel' : 'text'}
                      inputMode={step.kind === 'email' ? 'email' : step.kind === 'tel' ? 'tel' : 'text'}
                      value={String(data[step.key as keyof FormData] ?? '')}
                      onChange={(e) => set(step.key as keyof FormData, e.target.value as never)}
                      onKeyDown={onKey}
                      placeholder={step.placeholder}
                      className="w-full border-b-2 border-white/20 bg-transparent pb-3 text-2xl text-white outline-none transition-colors placeholder:text-white/25 focus:border-accent md:text-3xl"
                    />
                  )}

                  {step.kind === 'textarea' && (
                    <textarea
                      ref={(el) => { inputRef.current = el }}
                      rows={4}
                      value={data.details}
                      onChange={(e) => set('details', e.target.value)}
                      placeholder={step.placeholder}
                      className="w-full resize-none rounded-xl border-2 border-white/20 bg-white/[0.02] p-4 text-lg text-white outline-none transition-colors placeholder:text-white/25 focus:border-accent"
                    />
                  )}

                  {step.kind === 'single' && (
                    <div className="grid gap-3">
                      {step.options!.map((o) => {
                        const selected = data[step.key as keyof FormData] === o.value
                        return (
                          <button
                            key={o.value}
                            onClick={() => {
                              set(step.key as keyof FormData, o.value as never)
                              setTimeout(() => next(), 220)
                            }}
                            className={`group flex items-center justify-between rounded-xl border-2 px-5 py-4 text-left transition-all ${
                              selected ? 'border-accent bg-accent/10' : 'border-white/15 bg-white/[0.02] hover:border-white/40'
                            }`}
                          >
                            <span className="text-lg font-medium">{o.label}</span>
                            <span className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${selected ? 'border-accent bg-accent text-black' : 'border-white/25 text-transparent'}`}>
                              <Check className="h-3.5 w-3.5" />
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {step.kind === 'multi' && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {step.options!.map((o) => {
                        const arr = data[step.key as 'goals' | 'features']
                        const selected = arr.includes(o.value)
                        return (
                          <button
                            key={o.value}
                            onClick={() => toggleMulti(step.key as 'goals' | 'features', o.value)}
                            className={`flex items-center gap-3 rounded-xl border-2 px-5 py-4 text-left transition-all ${
                              selected ? 'border-accent bg-accent/10' : 'border-white/15 bg-white/[0.02] hover:border-white/40'
                            }`}
                          >
                            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${selected ? 'border-accent bg-accent text-black' : 'border-white/25 text-transparent'}`}>
                              <Check className="h-3 w-3" />
                            </span>
                            <span className="font-medium">{o.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {step.kind === 'plan' && (
                    <div className="grid gap-4 md:grid-cols-2">
                      {(['option1', 'option2'] as PlanType[]).map((p) => {
                        const plan = PLAN_DETAILS[p]
                        const selected = data.planType === p
                        return (
                          <button
                            key={p}
                            onClick={() => set('planType', p)}
                            className={`flex flex-col rounded-2xl border-2 p-6 text-left transition-all ${
                              selected ? 'border-accent bg-accent/10' : 'border-white/15 bg-white/[0.02] hover:border-white/40'
                            }`}
                          >
                            <span className="font-display text-xl font-bold uppercase">{plan.title}</span>
                            <span className="mt-1 text-sm text-white/50">{plan.subtitle}</span>
                            <span className="mt-4 font-display text-3xl font-extrabold text-accent">{plan.price}</span>
                          </button>
                        )
                      })}
                      <button
                        onClick={() => set('planType', 'undecided')}
                        className={`md:col-span-2 rounded-xl border-2 px-5 py-4 text-left transition-all ${
                          data.planType === 'undecided' ? 'border-accent bg-accent/10' : 'border-white/15 bg-white/[0.02] hover:border-white/40'
                        }`}
                      >
                        <span className="font-medium">I&apos;m not sure yet — let&apos;s talk first</span>
                        <span className="mt-1 block text-sm text-white/50">We&apos;ll review your brief and recommend the right fit. No payment now.</span>
                      </button>
                    </div>
                  )}
                </div>

                {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

                {step.kind !== 'single' && (
                  <div className="mt-8 flex items-center gap-4">
                    <button
                      onClick={next}
                      className="group inline-flex items-center gap-3 bg-accent px-7 py-3.5 font-mono text-xs uppercase tracking-widest text-black transition-opacity hover:opacity-90"
                    >
                      {step.optional && isEmpty(data, step.key as keyof FormData) ? 'Skip' : 'OK'}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                    <span className="hidden items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-white/30 sm:inline-flex">
                      press Enter <CornerDownLeft className="h-3 w-3" />
                    </span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function isEmpty(data: FormData, key: keyof FormData) {
  const v = data[key]
  return Array.isArray(v) ? v.length === 0 : String(v ?? '').trim().length === 0
}

const LABELS: Record<string, string> = {
  new: 'New website', redesign: 'Redesign', ecommerce: 'Online store', webapp: 'Web app', unsure: 'Not sure',
  bold: 'Bold & modern', minimal: 'Clean & minimal', premium: 'Elegant & premium', vibrant: 'Playful & vibrant', guide: 'Guide me',
  asap: 'ASAP', '2-4w': '2–4 weeks', '1-2m': '1–2 months', flexible: 'Flexible',
  leads: 'More leads', sell: 'Sell', credibility: 'Credibility', seo: 'SEO', bookings: 'Bookings', showcase: 'Showcase',
  forms: 'Forms', booking: 'Booking', blog: 'Blog/CMS', payments: 'Payments', i18n: 'Multi-language', motion: 'Animations & 3D', analytics: 'Analytics',
}

function ReviewStep({ data, onSubmit, submitting }: { data: FormData; onSubmit: () => void; submitting: boolean }) {
  const plan = data.planType && data.planType !== 'undecided' ? PLAN_DETAILS[data.planType] : null
  return (
    <div>
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">Final step</p>
      <h2 className="font-display text-4xl font-extrabold uppercase leading-[0.95] text-balance md:text-5xl">
        {plan ? "Review & pay securely" : 'Review your brief'}
      </h2>
      <p className="mt-4 text-lg text-white/50">
        {plan
          ? 'Confirm the details below, then continue to secure Stripe checkout.'
          : "Confirm the details below and we'll be in touch — no payment needed."}
      </p>

      <div className="mt-8 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <Row label="Name" value={data.fullName} />
        <Row label="Email" value={data.email} />
        {data.company && <Row label="Business" value={data.company} />}
        {data.projectType && <Row label="Project" value={LABELS[data.projectType] ?? data.projectType} />}
        {data.goals.length > 0 && <Row label="Goals" value={data.goals.map((g) => LABELS[g] ?? g).join(', ')} />}
        {data.features.length > 0 && <Row label="Features" value={data.features.map((f) => LABELS[f] ?? f).join(', ')} />}
        {data.timeline && <Row label="Timeline" value={LABELS[data.timeline] ?? data.timeline} />}
        {plan && <Row label="Plan" value={`${plan.title} · ${plan.price}`} accent />}
      </div>

      <button
        onClick={onSubmit}
        disabled={submitting}
        className="group mt-8 inline-flex w-full items-center justify-center gap-3 bg-accent px-8 py-4 font-mono text-xs uppercase tracking-widest text-black transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {submitting ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> {plan ? 'Redirecting to checkout…' : 'Sending…'}</>
        ) : (
          <>{plan ? 'Continue to secure payment' : 'Submit my brief'} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>
        )}
      </button>

      {plan && (
        <p className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-white/40">
          <ShieldCheck className="h-3.5 w-3.5" /> Secured by Stripe · you can cancel before paying
        </p>
      )}
    </div>
  )
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0">
      <span className="font-mono text-[11px] uppercase tracking-widest text-white/40">{label}</span>
      <span className={`text-right text-sm ${accent ? 'font-semibold text-accent' : 'text-white/85'}`}>{value}</span>
    </div>
  )
}
