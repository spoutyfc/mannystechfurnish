'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { Turnstile } from '@/components/site/turnstile'
import { CONTACT, DISCIPLINES } from '@/lib/site-content'
import { trackEvent } from './analytics'

type Fields = {
  name: string
  email: string
  phone: string
  firm: string
  website: string
  discipline: string
  message: string
  company: string // honeypot
}

const EMPTY: Fields = {
  name: '',
  email: '',
  phone: '',
  firm: '',
  website: '',
  discipline: '',
  message: '',
  company: '',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(f: Fields) {
  const errors: Partial<Record<keyof Fields, string>> = {}
  if (!f.name.trim()) errors.name = 'Enter your name.'
  if (!EMAIL_RE.test(f.email.trim())) errors.email = 'Enter an email address like name@firm.com.'
  if (!f.firm.trim()) errors.firm = 'Enter your firm’s name.'
  if (!f.message.trim()) errors.message = 'Add a sentence or two so the call can be useful.'
  if (f.website.trim() && !/^(https?:\/\/)?[^\s/.]+\.[^\s]+$/i.test(f.website.trim()))
    errors.website = 'Enter a website address like acme.com, or leave it blank.'
  if (f.message.length > 4500) errors.message = 'Please keep this under 4,500 characters.'
  return errors
}

const inputClass =
  'mt-2 block min-h-12 w-full rounded-[2px] border border-rule-strong bg-transparent px-3 py-2 text-base text-white placeholder:text-white/50 focus-visible:border-accent aria-[invalid=true]:border-signal'
const labelClass = 'block font-medium text-ink'

export function FitCallForm() {
  const [fields, setFields] = useState<Fields>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({})
  const [token, setToken] = useState('')
  const [widgetKey, setWidgetKey] = useState(0)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [serverError, setServerError] = useState('')
  const started = useRef(false)
  const summaryRef = useRef<HTMLDivElement>(null)
  const siteKeyConfigured = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!started.current) {
      started.current = true
      trackEvent('form_start', { form: 'fit-call' })
    }
    setFields((prev) => ({ ...prev, [key]: e.target.value }))
  }

  const fail = (message: string) => {
    setServerError(message)
    setStatus('idle')
    // Turnstile tokens are single-use: force a fresh challenge for the retry.
    setToken('')
    setWidgetKey((k) => k + 1)
    trackEvent('form_submit_error', { form: 'fit-call' })
    requestAnimationFrame(() => summaryRef.current?.focus())
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError('')
    const found = validate(fields)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    if (siteKeyConfigured && !token) {
      setServerError('Please complete the verification check above the button, then send again.')
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fields.name,
          email: fields.email,
          phone: fields.phone,
          firm: fields.firm,
          website: fields.website,
          discipline: fields.discipline || undefined,
          subject: `Fit call request — ${fields.firm.trim()}`.slice(0, 200),
          message: fields.message,
          company: fields.company,
          turnstileToken: token,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        // 4xx messages explain what to change; a 5xx is our fault, so offer another way in.
        fail(
          res.status < 500 && data.error
            ? data.error
            : `Your request couldn’t be saved because of a problem on this site. Your answers are still here — try again in a minute, or call ${CONTACT.phoneDisplay} or email ${CONTACT.email}.`,
        )
        return
      }
      setStatus('sent')
      setFields(EMPTY)
      trackEvent('form_submit_success', { form: 'fit-call' })
    } catch {
      fail(`The message couldn’t be sent — check your connection and try again, or call ${CONTACT.phoneDisplay}.`)
    }
  }

  if (status === 'sent') {
    return (
      <div role="status" className="border border-rule-strong bg-surface p-6 md:p-8">
        <h2 className="text-2xl text-ink">Request received.</h2>
        <p className="mt-3 text-graphite">
          Thank you. You&apos;ll get a confirmation email shortly, and I&apos;ll reply within two business days to
          set a time. If it&apos;s urgent, call {CONTACT.phoneDisplay}.
        </p>
      </div>
    )
  }

  const errorList = Object.entries(errors).filter(([, v]) => v) as [keyof Fields, string][]
  const describe = (key: keyof Fields) => (errors[key] ? `${key}-error` : undefined)

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6 border border-rule-strong bg-surface p-5 md:p-8">
      <div ref={summaryRef} tabIndex={-1} aria-live="assertive" className="outline-none">
        {(errorList.length > 0 || serverError) && (
          <div role="alert" className="border-l-4 border-accent bg-accent/10 p-4 text-white">
            {serverError ? (
              <p>{serverError}</p>
            ) : (
              <>
                <p className="font-medium">Please fix the following:</p>
                <ul className="mt-2 list-disc pl-5">
                  {errorList.map(([key, msg]) => (
                    <li key={key}>
                      <a href={`#${key}`} className="underline">
                        {msg}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>

      {/* Honeypot: hidden from people and assistive technology; bots fill it. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" value={fields.company} onChange={set('company')} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Your name
          </label>
          <input id="name" name="name" autoComplete="name" required value={fields.name} onChange={set('name')}
            aria-invalid={Boolean(errors.name)} aria-describedby={describe('name')} className={inputClass} />
          {errors.name && <p id="name-error" className="mt-1 text-base text-[#ff7ab8]">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="firm" className={labelClass}>
            Firm
          </label>
          <input id="firm" name="firm" autoComplete="organization" required value={fields.firm} onChange={set('firm')}
            aria-invalid={Boolean(errors.firm)} aria-describedby={describe('firm')} className={inputClass} />
          {errors.firm && <p id="firm-error" className="mt-1 text-base text-[#ff7ab8]">{errors.firm}</p>}
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Work email
          </label>
          <input id="email" name="email" type="email" autoComplete="email" required value={fields.email} onChange={set('email')}
            aria-invalid={Boolean(errors.email)} aria-describedby={describe('email')} className={inputClass} />
          {errors.email && <p id="email-error" className="mt-1 text-base text-[#ff7ab8]">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone <span className="font-normal text-graphite">(optional)</span>
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" value={fields.phone} onChange={set('phone')} className={inputClass} />
        </div>
        <div>
          <label htmlFor="discipline" className={labelClass}>
            Discipline <span className="font-normal text-graphite">(optional)</span>
          </label>
          <select id="discipline" name="discipline" value={fields.discipline} onChange={set('discipline')} className={inputClass}>
            <option value="">Choose one</option>
            {DISCIPLINES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="website" className={labelClass}>
            Current website <span className="font-normal text-graphite">(optional)</span>
          </label>
          <input id="website" name="website" type="url" inputMode="url" autoComplete="url" placeholder="https://"
            value={fields.website} onChange={set('website')} aria-invalid={Boolean(errors.website)}
            aria-describedby={describe('website')} className={inputClass} />
          {errors.website && <p id="website-error" className="mt-1 text-base text-[#ff7ab8]">{errors.website}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          What prompted you to look at your website now?
        </label>
        <textarea id="message" name="message" rows={5} required value={fields.message} onChange={set('message')}
          aria-invalid={Boolean(errors.message)} aria-describedby={describe('message') ?? 'message-hint'}
          className={`${inputClass} resize-y`} />
        <p id="message-hint" className="mt-1 text-base text-graphite">
          A sentence or two is plenty. Suggest a couple of times that suit you, if you like.
        </p>
        {errors.message && <p id="message-error" className="mt-1 text-base text-[#ff7ab8]">{errors.message}</p>}
      </div>

      <Turnstile key={widgetKey} theme="light" onVerify={setToken} onExpire={() => setToken('')} />

      <div className="space-y-4">
        <button
          type="submit"
          disabled={status === 'sending'}
          aria-busy={status === 'sending'}
          className="inline-flex min-h-12 w-full items-center justify-center bg-accent px-8 py-4 text-sm font-semibold uppercase tracking-wider text-black transition-opacity hover:opacity-90 disabled:cursor-wait sm:w-auto"
        >
          {status === 'sending' ? 'Sending…' : 'Request a fit call'}
        </button>
        <p className="text-base text-graphite">
          Your details are used only to reply to this request. See the{' '}
          <Link href="/privacy" className="prose-link">
            privacy notice
          </Link>
          .
        </p>
      </div>
    </form>
  )
}
