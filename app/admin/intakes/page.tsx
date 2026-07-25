'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  LogOut, Trash2, RefreshCw, Inbox, LinkIcon, ClipboardList, CheckCircle2,
  Clock, Globe, Mail, Phone, Building2, CheckCheck,
} from 'lucide-react'

type Intake = {
  id: string
  planType: string | null
  fullName: string
  email: string
  phone: string | null
  company: string | null
  website: string | null
  projectType: string | null
  industry: string | null
  goals: string | null
  features: string | null
  designStyle: string | null
  timeline: string | null
  details: string | null
  referral: string | null
  country: string | null
  locale: string | null
  paymentStatus: string | null
  amount: number | null
  currency: string | null
  createdAt: string
}

const LABELS: Record<string, string> = {
  new: 'New website', redesign: 'Redesign', ecommerce: 'Online store', webapp: 'Web app', unsure: 'Not sure',
  bold: 'Bold & modern', minimal: 'Clean & minimal', premium: 'Elegant & premium', vibrant: 'Playful & vibrant', guide: 'Guide me',
  asap: 'ASAP', '2-4w': '2–4 weeks', '1-2m': '1–2 months', flexible: 'Flexible',
  leads: 'More leads', sell: 'Sell products', credibility: 'Credibility', seo: 'SEO', bookings: 'Bookings', showcase: 'Showcase',
  forms: 'Contact forms', booking: 'Booking', blog: 'Blog/CMS', payments: 'Payments', i18n: 'Multi-language', motion: 'Animations & 3D', analytics: 'Analytics',
  google: 'Google search', referral: 'Referral', social: 'Social media', work: 'Saw our work', other: 'Other',
  option1: 'Complete Digital Asset ($1,899)', option2: 'Managed Plan ($900 + $159/mo)', undecided: 'Undecided — talk first',
}

const label = (v: string | null) => (v ? LABELS[v] ?? v : '')
const parseArr = (s: string | null): string[] => {
  if (!s) return []
  try { return JSON.parse(s) } catch { return [] }
}

export default function AdminIntakesPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [intakes, setIntakes] = useState<Intake[]>([])
  const [active, setActive] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/intakes')
    if (res.ok) setIntakes((await res.json()).intakes)
  }, [])

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch('/api/admin-session')
        const data = await res.json()
        if (!data.authenticated) { router.push('/admin-login'); return }
        setAdmin({ email: data.email })
        await load()
      } catch { router.push('/admin-login') } finally { setLoading(false) }
    }
    init()
  }, [router, load])

  const handleSignOut = async () => {
    await fetch('/api/admin-logout', { method: 'POST' })
    router.push('/admin-login')
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this project brief permanently?')) return
    setBusy(id)
    await fetch(`/api/admin/intakes/${id}`, { method: 'DELETE' })
    setIntakes((prev) => prev.filter((i) => i.id !== id))
    if (active === id) setActive(null)
    setBusy(null)
  }

  const markPaid = async (id: string) => {
    setBusy(id)
    await fetch(`/api/admin/intakes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentStatus: 'paid' }),
    })
    setIntakes((prev) => prev.map((i) => (i.id === id ? { ...i, paymentStatus: 'paid' } : i)))
    setBusy(null)
  }

  const stats = useMemo(() => {
    const paid = intakes.filter((i) => i.paymentStatus === 'paid')
    const revenue = paid.reduce((sum, i) => sum + (i.amount ?? 0), 0) / 100
    const countries = new Set(intakes.map((i) => i.country).filter(Boolean))
    return {
      total: intakes.length,
      paid: paid.length,
      pending: intakes.filter((i) => i.paymentStatus !== 'paid').length,
      revenue,
      countries: countries.size,
    }
  }, [intakes])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  const statusBadge = (s: string | null) => {
    if (s === 'paid')
      return <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-2.5 py-1"><CheckCircle2 className="w-3 h-3" /> Paid</span>
    return <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-full px-2.5 py-1"><Clock className="w-3 h-3" /> Pending</span>
  }

  return (
    <div className="min-h-screen bg-black text-white py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold uppercase">Project Briefs</h1>
            <p className="text-neutral-500 text-sm mt-1">Intake questionnaires · logged in as {admin?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={load} className="gap-2 border-neutral-700 bg-transparent">
              <RefreshCw className="w-4 h-4" /> Refresh
            </Button>
            <Link href="/admin">
              <Button variant="outline" size="sm" className="gap-2 border-neutral-700 bg-transparent">
                <Inbox className="w-4 h-4" /> Submissions
              </Button>
            </Link>
            <Link href="/admin/clients">
              <Button variant="outline" size="sm" className="gap-2 border-neutral-700 bg-transparent">
                <LinkIcon className="w-4 h-4" /> Payment Links
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2 border-neutral-700 bg-transparent">
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<ClipboardList className="w-5 h-5" />} label="Total briefs" value={String(stats.total)} />
          <StatCard icon={<CheckCircle2 className="w-5 h-5" />} label="Paid" value={String(stats.paid)} accent />
          <StatCard icon={<Clock className="w-5 h-5" />} label="Pending" value={String(stats.pending)} />
          <StatCard icon={<Globe className="w-5 h-5" />} label="Countries reached" value={String(stats.countries)} accent />
        </div>

        {/* List */}
        {intakes.length === 0 ? (
          <div className="border border-neutral-800 rounded-2xl p-16 text-center">
            <ClipboardList className="w-10 h-10 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400">No project briefs yet.</p>
            <p className="text-neutral-600 text-sm mt-1">Completed intake questionnaires will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {intakes.map((it) => {
              const goals = parseArr(it.goals)
              const features = parseArr(it.features)
              const open = active === it.id
              return (
                <div
                  key={it.id}
                  className={`border rounded-xl overflow-hidden transition-colors ${
                    it.paymentStatus === 'paid' ? 'border-emerald-500/25 bg-emerald-500/[0.02]' : 'border-neutral-800 bg-neutral-900/40'
                  }`}
                >
                  <button
                    onClick={() => setActive(open ? null : it.id)}
                    className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/[0.02]"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-white truncate">{it.fullName}</span>
                        {it.company && <span className="text-neutral-500 text-sm">· {it.company}</span>}
                        {it.country && (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-neutral-400 border border-neutral-700 rounded-full px-2 py-0.5">
                            <Globe className="w-2.5 h-2.5" /> {it.country}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-400 truncate">
                        {label(it.projectType)} {it.planType ? `· ${label(it.planType)}` : ''}
                      </p>
                    </div>
                    {statusBadge(it.paymentStatus)}
                    <span className="text-xs text-neutral-500 shrink-0 hidden sm:block">
                      {new Date(it.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </button>

                  {open && (
                    <div className="border-t border-neutral-800 p-4 md:p-5 space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <Detail icon={<Mail className="w-3.5 h-3.5" />} label="Email">
                          <a href={`mailto:${it.email}`} className="text-accent hover:underline break-all">{it.email}</a>
                        </Detail>
                        {it.phone && <Detail icon={<Phone className="w-3.5 h-3.5" />} label="Phone"><span className="text-white">{it.phone}</span></Detail>}
                        {it.company && <Detail icon={<Building2 className="w-3.5 h-3.5" />} label="Business"><span className="text-white">{it.company}</span></Detail>}
                        {it.website && <Detail icon={<Globe className="w-3.5 h-3.5" />} label="Current site"><a href={it.website} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">{it.website}</a></Detail>}
                        {it.industry && <Detail label="Industry"><span className="text-white">{it.industry}</span></Detail>}
                        {it.projectType && <Detail label="Project"><span className="text-white">{label(it.projectType)}</span></Detail>}
                        {it.designStyle && <Detail label="Style"><span className="text-white">{label(it.designStyle)}</span></Detail>}
                        {it.timeline && <Detail label="Timeline"><span className="text-white">{label(it.timeline)}</span></Detail>}
                        {it.planType && <Detail label="Plan"><span className="text-white">{label(it.planType)}</span></Detail>}
                        {it.referral && <Detail label="Found us via"><span className="text-white">{label(it.referral)}</span></Detail>}
                        {(it.locale || it.country) && <Detail label="Locale"><span className="text-white">{[it.country, it.locale].filter(Boolean).join(' · ')}</span></Detail>}
                        {it.amount != null && <Detail label="Paid"><span className="text-emerald-400 font-medium">{(it.amount / 100).toLocaleString(undefined, { style: 'currency', currency: (it.currency || 'usd').toUpperCase() })}</span></Detail>}
                      </div>

                      {goals.length > 0 && <Chips title="Goals" items={goals.map(label)} />}
                      {features.length > 0 && <Chips title="Features wanted" items={features.map(label)} />}

                      {it.details && (
                        <div>
                          <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Notes</p>
                          <p className="text-neutral-200 text-sm leading-relaxed whitespace-pre-wrap">{it.details}</p>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <Button size="sm" onClick={() => (window.location.href = `mailto:${it.email}`)} className="gap-2 bg-accent text-black hover:opacity-90">
                          <Mail className="w-4 h-4" /> Email {it.fullName.split(' ')[0]}
                        </Button>
                        {it.paymentStatus !== 'paid' && (
                          <Button size="sm" variant="outline" disabled={busy === it.id} onClick={() => markPaid(it.id)} className="gap-2 border-emerald-700/50 text-emerald-400 hover:bg-emerald-500/10 bg-transparent">
                            <CheckCheck className="w-4 h-4" /> Mark paid
                          </Button>
                        )}
                        <Button size="sm" variant="outline" disabled={busy === it.id} onClick={() => remove(it.id)} className="gap-2 border-red-900/50 text-red-400 hover:bg-red-500/10 bg-transparent ml-auto">
                          <Trash2 className="w-4 h-4" /> Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div className="border border-neutral-800 rounded-2xl p-5 bg-neutral-950/60">
      <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg mb-3 ${accent ? 'bg-accent/15 text-accent' : 'bg-white/5 text-neutral-400'}`}>
        {icon}
      </div>
      <div className="font-display text-2xl font-extrabold">{value}</div>
      <div className="text-neutral-500 text-xs uppercase tracking-wider mt-1">{label}</div>
    </div>
  )
}

function Detail({ icon, label, children }: { icon?: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">{icon}{label}</p>
      {children}
    </div>
  )
}

function Chips({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-neutral-500 text-xs uppercase tracking-wider mb-2">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((i) => (
          <span key={i} className="text-xs text-neutral-200 bg-white/5 border border-white/10 rounded-full px-3 py-1">{i}</span>
        ))}
      </div>
    </div>
  )
}
