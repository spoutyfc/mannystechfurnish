'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
  LogOut,
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

  const handleSignOut = async () => {
    await fetch('/api/admin-logout', { method: 'POST' })
    router.push('/admin-login')
  }

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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  const planLabel = (p: string) => (p === 'option1' ? '$1,299 One-Time' : '$700 + $120/mo')

  const statusBadge = (status: string | null) => {
    if (status === 'completed')
      return <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-2.5 py-1">Paid</span>
    if (status === 'failed')
      return <span className="inline-flex items-center gap-1 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/30 rounded-full px-2.5 py-1">Failed</span>
    return <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-full px-2.5 py-1">Pending</span>
  }

  return (
    <div className="min-h-screen bg-black text-white py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold uppercase">Client Payments</h1>
            <p className="text-neutral-500 text-sm mt-1">Logged in as {admin?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setShowForm(true)} className="gap-2 bg-accent text-black hover:opacity-90">
              <Plus className="w-4 h-4" /> New client
            </Button>
            <Button variant="outline" size="sm" onClick={loadData} className="gap-2 border-neutral-700 bg-transparent">
              <RefreshCw className="w-4 h-4" /> Refresh
            </Button>
            <Link href="/admin">
              <Button variant="outline" size="sm" className="gap-2 border-neutral-700 bg-transparent">
                <Inbox className="w-4 h-4" /> Submissions
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2 border-neutral-700 bg-transparent">
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={<Users className="w-5 h-5" />} label="Total clients" value={String(stats.totalClients)} />
            <StatCard icon={<CheckCircle2 className="w-5 h-5" />} label="Paid" value={String(stats.paidCount)} accent />
            <StatCard icon={<Clock className="w-5 h-5" />} label="Pending" value={String(stats.pendingCount)} />
            <StatCard icon={<DollarSign className="w-5 h-5" />} label="Collected" value={`$${stats.revenue.toLocaleString()}`} accent />
          </div>
        )}

        {/* Clients table */}
        {clients.length === 0 ? (
          <div className="border border-neutral-800 rounded-2xl p-16 text-center">
            <Inbox className="w-10 h-10 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400">No clients yet.</p>
            <p className="text-neutral-600 text-sm mt-1">Click &quot;New client&quot; to generate a payment link.</p>
          </div>
        ) : (
          <div className="border border-neutral-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 text-left text-neutral-500 text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 font-medium">Client</th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">Plan</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium hidden lg:table-cell">Created</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => {
                    const url = `${baseUrl}/pay/${c.slug}`
                    return (
                      <tr key={c.id} className="border-b border-neutral-800/60 last:border-0 hover:bg-white/[0.02]">
                        <td className="px-4 py-3">
                          <div className="font-medium text-white">{c.name}</div>
                          <div className="text-neutral-500 text-xs">{c.email}</div>
                          {c.companyName && <div className="text-neutral-600 text-xs">{c.companyName}</div>}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-neutral-300">{planLabel(c.planType)}</td>
                        <td className="px-4 py-3">{statusBadge(c.paymentStatus)}</td>
                        <td className="px-4 py-3 hidden lg:table-cell text-neutral-500">
                          {new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => copyToClipboard(url)}
                              title="Copy payment link"
                              className="p-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-colors"
                            >
                              {copied === url ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Open payment page"
                              className="p-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            {c.paymentStatus !== 'completed' && (
                              <button
                                onClick={() => handleMarkPaid(c.id)}
                                disabled={busy === c.id}
                                title="Mark as paid"
                                className="p-2 rounded-lg hover:bg-emerald-500/10 text-neutral-400 hover:text-emerald-400 transition-colors"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(c.id)}
                              disabled={busy === c.id}
                              title="Delete"
                              className="p-2 rounded-lg hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
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
      </div>

      {/* Create client modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold uppercase">New Client Link</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-neutral-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleGenerateLink} className="space-y-4">
              <Field label="Client Name *">
                <Input name="name" value={formData.name} onChange={handleInputChange} required placeholder="John Doe" className="bg-neutral-900 border-neutral-700" />
              </Field>
              <Field label="Email *">
                <Input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="john@example.com" className="bg-neutral-900 border-neutral-700" />
              </Field>
              <Field label="Phone">
                <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="(555) 123-4567" className="bg-neutral-900 border-neutral-700" />
              </Field>
              <Field label="Company">
                <Input name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Company Name" className="bg-neutral-900 border-neutral-700" />
              </Field>
              <Field label="Plan *">
                <select
                  name="planType"
                  value={formData.planType}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
                >
                  <option value="option1">Option 1 — $1,299 One-Time</option>
                  <option value="option2">Option 2 — $700 + $120/mo</option>
                </select>
              </Field>
              <Button type="submit" disabled={generating} className="w-full gap-2 bg-accent text-black hover:opacity-90">
                {generating ? 'Generating...' : 'Generate & copy link'}
              </Button>
              <p className="text-xs text-neutral-500 text-center">The link is copied to your clipboard automatically.</p>
            </form>
          </div>
        </div>
      )}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-neutral-300">{label}</label>
      {children}
    </div>
  )
}
