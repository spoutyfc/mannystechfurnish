'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarClock,
  Check,
  Clock,
  Loader2,
} from 'lucide-react'
import { ADD_ONS } from '@/lib/plans'

const booking = ADD_ONS.find((a) => a.id === 'booking')!

const TIME_SLOTS = [
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '11:00 AM',
  '1:00 PM',
  '2:30 PM',
  '3:00 PM',
  '4:30 PM',
]

// Deterministic "unavailable" slots per day so the demo feels real without a backend.
function unavailableFor(dayIndex: number): Set<number> {
  const taken = new Set<number>()
  taken.add((dayIndex * 2) % TIME_SLOTS.length)
  taken.add((dayIndex * 3 + 1) % TIME_SLOTS.length)
  return taken
}

function buildDays() {
  const days: { label: string; date: string; dow: string; full: boolean }[] = []
  const now = new Date()
  let added = 0
  let offset = 1
  while (added < 6) {
    const d = new Date(now)
    d.setDate(now.getDate() + offset)
    offset++
    const dow = d.toLocaleDateString('en-US', { weekday: 'short' })
    // Skip Sundays to feel like a real schedule
    if (d.getDay() === 0) continue
    days.push({
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      date: d.toISOString(),
      dow,
      full: false,
    })
    added++
  }
  return days
}

export default function BookingDemoPage() {
  const days = useMemo(buildDays, [])
  const [dayIndex, setDayIndex] = useState(0)
  const [slot, setSlot] = useState<number | null>(null)
  const [step, setStep] = useState<'pick' | 'details' | 'done'>('pick')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const taken = useMemo(() => unavailableFor(dayIndex), [dayIndex])

  const confirm = async () => {
    setSubmitting(true)
    // Simulated booking round-trip so the demo feels live.
    await new Promise((r) => setTimeout(r, 900))
    setSubmitting(false)
    setStep('done')
  }

  const reset = () => {
    setStep('pick')
    setSlot(null)
    setName('')
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-white/15 px-5 py-5 md:px-10">
        <Link
          href="/#pricing"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to pricing
        </Link>
        <span className="inline-flex items-center gap-2 border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-accent">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          Live demo
        </span>
      </header>

      <main className="mx-auto max-w-[1100px] px-5 py-12 md:px-10 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Left: explanation */}
          <div>
            <div className="inline-flex items-center gap-2 border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white/60">
              <CalendarClock className="h-3.5 w-3.5 text-accent" /> Add-on demo
            </div>
            <h1 className="mt-6 font-display text-4xl font-semibold uppercase leading-[0.95] tracking-tight md:text-6xl">
              Booking & Scheduling
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/75">
              {booking.description} This panel is fully interactive — pick a day
              and time, add your details, and watch the confirmation flow exactly
              as your customers would experience it.
            </p>

            <ul className="mt-8 space-y-3">
              {booking.whatItDoes.map((f) => (
                <li key={f} className="flex items-start gap-3 text-white/85">
                  <Check className="mt-1 h-4 w-4 flex-shrink-0 text-accent" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-4 border-t border-white/15 pt-8 sm:flex-row sm:items-center">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-white/50">
                  Add to your site
                </p>
                <p className="font-display text-4xl font-semibold tracking-tight">
                  {booking.price}
                  <span className="ml-2 font-mono text-xs uppercase tracking-widest text-white/50">
                    one-time
                  </span>
                </p>
              </div>
              <a
                href={booking.paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 bg-accent px-7 py-4 text-sm font-semibold uppercase tracking-wider text-black transition-opacity hover:opacity-90"
              >
                Add this add-on
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* Right: the working widget */}
          <div className="relative">
            <div className="rounded-xl border border-white/15 bg-white/[0.03] p-6 md:p-8">
              <AnimatePresence mode="wait">
                {step === 'pick' && (
                  <motion.div
                    key="pick"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="font-mono text-xs uppercase tracking-widest text-white/50">
                      Select a day
                    </p>
                    <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
                      {days.map((d, i) => (
                        <button
                          key={d.date}
                          onClick={() => {
                            setDayIndex(i)
                            setSlot(null)
                          }}
                          className={`flex flex-col items-center rounded-lg border px-2 py-3 transition-colors ${
                            dayIndex === i
                              ? 'border-accent bg-accent text-black'
                              : 'border-white/15 text-white/80 hover:border-white/40'
                          }`}
                        >
                          <span className="font-mono text-[10px] uppercase tracking-wider opacity-70">
                            {d.dow}
                          </span>
                          <span className="mt-1 text-sm font-semibold">
                            {d.label}
                          </span>
                        </button>
                      ))}
                    </div>

                    <p className="mt-7 font-mono text-xs uppercase tracking-widest text-white/50">
                      Available times
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {TIME_SLOTS.map((t, i) => {
                        const isTaken = taken.has(i)
                        const isSel = slot === i
                        return (
                          <button
                            key={t}
                            disabled={isTaken}
                            onClick={() => setSlot(i)}
                            className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-3 text-sm transition-colors ${
                              isTaken
                                ? 'cursor-not-allowed border-white/5 text-white/25 line-through'
                                : isSel
                                  ? 'border-accent bg-accent font-semibold text-black'
                                  : 'border-white/15 text-white/85 hover:border-white/40'
                            }`}
                          >
                            <Clock className="h-3.5 w-3.5 opacity-60" />
                            {t}
                          </button>
                        )
                      })}
                    </div>

                    <button
                      disabled={slot === null}
                      onClick={() => setStep('details')}
                      className="mt-8 inline-flex w-full items-center justify-center gap-2 bg-accent px-6 py-4 text-sm font-semibold uppercase tracking-wider text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      Continue
                    </button>
                  </motion.div>
                )}

                {step === 'details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      onClick={() => setStep('pick')}
                      className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/50 hover:text-white"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" /> Change time
                    </button>
                    <div className="mt-4 flex items-center gap-3 rounded-lg border border-accent/30 bg-accent/10 px-4 py-3">
                      <CalendarClock className="h-5 w-5 text-accent" />
                      <p className="text-sm">
                        <span className="font-semibold">{days[dayIndex].dow}</span>{' '}
                        {days[dayIndex].label} at{' '}
                        <span className="font-semibold">
                          {slot !== null ? TIME_SLOTS[slot] : ''}
                        </span>
                      </p>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-white/50">
                          Your name
                        </label>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Jane Doe"
                          className="w-full rounded-lg border border-white/15 bg-black px-4 py-3 text-white placeholder:text-white/30 focus:border-accent focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-white/50">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="jane@company.com"
                          className="w-full rounded-lg border border-white/15 bg-black px-4 py-3 text-white placeholder:text-white/30 focus:border-accent focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      disabled={!name || !email || submitting}
                      onClick={confirm}
                      className="mt-8 inline-flex w-full items-center justify-center gap-2 bg-accent px-6 py-4 text-sm font-semibold uppercase tracking-wider text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Confirming…
                        </>
                      ) : (
                        'Confirm booking'
                      )}
                    </button>
                  </motion.div>
                )}

                {step === 'done' && (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="py-6 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                      className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent"
                    >
                      <Check className="h-8 w-8 text-black" />
                    </motion.div>
                    <h2 className="mt-6 font-display text-2xl font-semibold uppercase">
                      You&apos;re booked
                    </h2>
                    <p className="mt-3 text-white/70">
                      A confirmation was sent to{' '}
                      <span className="text-white">{email}</span> for{' '}
                      <span className="text-white">
                        {days[dayIndex].dow} {days[dayIndex].label}
                      </span>{' '}
                      at{' '}
                      <span className="text-white">
                        {slot !== null ? TIME_SLOTS[slot] : ''}
                      </span>
                      .
                    </p>
                    <p className="mt-2 font-mono text-xs uppercase tracking-widest text-white/40">
                      ( This is a demo — no real email was sent )
                    </p>
                    <button
                      onClick={reset}
                      className="mt-8 inline-flex items-center justify-center gap-2 border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black"
                    >
                      Try it again
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-white/35">
              Real bookings sync to your calendar & inbox
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
