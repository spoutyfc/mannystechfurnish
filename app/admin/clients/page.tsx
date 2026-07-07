'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  createClient,
  getAllClients,
  getDashboardStats,
  deleteClient,
  updateClientPaymentStatus,
} from '@/app/actions/payment'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Copy,
  CheckCircle2,
  Inbox,
  Plus,
  Trash2,
  Users,
  DollarSign,
  Clock,
  X,
  RefreshCw,
  ExternalLink,
} from 'lucide-react'
import { AdminShell } from '@/components/admin/admin-shell'

type ClientRow = {
  id: number
  slug: string
  name: string
  email: string
  phone: string | null
  companyName: string | null
  planType: string
  paymentStatus: string | null
  createdAt: string | Date
}

type Stats = {
  totalClients: number
  paidCount: number
  pendingCount: number
  revenue: number
}

export default function AdminClientLinksPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<ClientRow[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [busy, setBusy] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    planType: 'option1' as 'option1' | 'option2',
  })

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  const loadData = useCallback(async () => {
    const [rows, s] = await Promise.all([getAllClients(), getDashboardStats()])
    setClients(rows as ClientRow[])
    setStats(s)
  }, [])

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch('/api/admin-session')
        const data = await res.json()
        if (!data.authenticated) {
          router.push('/admin-login')
          return
        }
        setAdmin({ email: data.email })
        await loadData()
      } catch {
        router.push('/admin-login')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [router, loadData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setGenerating(true)
    try {
      const { slug } = await createClient({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        companyName: formData.companyName,
        planType: formData.planType,
      })
      const url = `${baseUrl}/pay/${slug}`
      await navigator.clipboard.writeText(url).catch(() => {})
      setCopied(url)
      setTimeout(() => setCopied(null), 2000)
      setFormData({ name: '', email: '', phone: '', companyName: '', planType: 'option1' })
      setShowForm(false)
      await loadData()
    } catch {
      alert('Error generating payment link')
    } finally {
      setGenerating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this client and their payment link permanently?')) return
    setBusy(id)
    await deleteClient(id)
    setClients((prev) => prev.filter((c) => c.id !== id))
    await getDashboardStats().then(setStats)
    setBusy(null)
  }

  const handleMarkPaid = async (id: number) => {
    setBusy(id)
    await updateClientPaymentStatus(id, 'completed')
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, paymentStatus: 'completed' } : c)))
    await getDashboardStats().then(setStats)
    setBusy(null)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    )
  }

  const planLabel = (p: string) => (p === 'option1' ? '$1,299 One-Time' : '$700 + $120/mo')

  const statusBadge = (status: string | null) => {
    if (status === 'completed')
      return <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">Paid</span>
    if (status === 'failed')
      return <span className="inline-flex items-center rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">Failed</span>
    return <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">Pending</span>
  }

  return (
    <AdminShell
      active="payments"
      adminEmail={admin?.email}
      title="Payments"
      subtitle="Client payment links & status"
      actions={
        <>
          <Button size="sm" onClick={() => setShowForm(true)} className="gap-2 rounded-full bg-foreground text-background hover:opacity-90">
            <Plus className="h-4 w-4" /> New client
          </Button>
          <Button variant="outline" size="sm" onClick={loadData} className="gap-2 rounded-full border-border bg-transparent">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </>
      }
    >
      {/* Stats */}
      {stats && (
        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard icon={<Users className="h-4 w-4" />} label="Total clients" value={String(stats.totalClients)} />
          <StatCard icon={<CheckCircle2 className="h-4 w-4" />} label="Paid" value={String(stats.paidCount)} accent />
          <StatCard icon={<Clock className="h-4 w-4" />} label="Pending" value={String(stats.pendingCount)} />
          <StatCard icon={<DollarSign className="h-4 w-4" />} label="Collected" value={`$${stats.revenue.toLocaleString()}`} accent />
        </div>
      )}

      {/* Clients table */}
      {clients.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-16 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <Inbox className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-foreground">No clients yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">Click &quot;New client&quot; to generate a payment link.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">Plan</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="hidden px-4 py-3 font-medium lg:table-cell">Created</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => {
                  const url = `${baseUrl}/pay/${c.slug}`
                  return (
                    <tr key={c.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/40">
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.email}</div>
                        {c.companyName && <div className="text-xs text-muted-foreground/70">{c.companyName}</div>}
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{planLabel(c.planType)}</td>
                      <td className="px-4 py-3">{statusBadge(c.paymentStatus)}</td>
                      <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                        {new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => copyToClipboard(url)}
                            title="Copy payment link"
                            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                          >
                            {copied === url ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                          </button>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open payment page"
                            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                          {c.paymentStatus !== 'completed' && (
                            <button
                              onClick={() => handleMarkPaid(c.id)}
                              disabled={busy === c.id}
                              title="Mark as paid"
                              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-emerald-500/10 hover:text-emerald-400"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(c.id)}
                            disabled={busy === c.id}
                            title="Delete"
                            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create client modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-md rounded-t-2xl border border-border bg-card p-6 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-lg font-medium tracking-tight">New client link</h2>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleGenerateLink} className="space-y-4">
              <Field label="Client name *">
                <Input name="name" value={formData.name} onChange={handleInputChange} required placeholder="John Doe" className="h-11 rounded-xl border-border bg-background text-base sm:text-sm" />
              </Field>
              <Field label="Email *">
                <Input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="john@example.com" className="h-11 rounded-xl border-border bg-background text-base sm:text-sm" />
              </Field>
              <Field label="Phone">
                <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="(555) 123-4567" className="h-11 rounded-xl border-border bg-background text-base sm:text-sm" />
              </Field>
              <Field label="Company">
                <Input name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Company name" className="h-11 rounded-xl border-border bg-background text-base sm:text-sm" />
              </Field>
              <Field label="Plan *">
                <select
                  name="planType"
                  value={formData.planType}
                  onChange={handleInputChange}
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-base outline-none focus:border-accent sm:text-sm"
                >
                  <option value="option1">Option 1 — $1,299 One-Time</option>
                  <option value="option2">Option 2 — $700 + $120/mo</option>
                </select>
              </Field>
              <Button type="submit" disabled={generating} className="h-11 w-full gap-2 rounded-xl bg-foreground text-background hover:opacity-90">
                {generating ? 'Generating…' : 'Generate & copy link'}
              </Button>
              <p className="text-center text-xs text-muted-foreground">The link is copied to your clipboard automatically.</p>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  )
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ${accent ? 'bg-accent/15 text-accent' : 'bg-secondary text-muted-foreground'}`}>
        {icon}
      </div>
      <div className="font-display text-2xl font-medium">{value}</div>
      <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}
