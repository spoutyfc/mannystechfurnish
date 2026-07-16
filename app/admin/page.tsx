'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LogOut, Trash2, Mail, Check, RefreshCw, Inbox, LinkIcon, PenSquare } from 'lucide-react'
import { ComposeEmail, type ComposePrefill } from '@/components/admin/compose-email'

type Submission = {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: string
  createdAt: string
}

export default function AdminSubmissionsPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [active, setActive] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [composeOpen, setComposeOpen] = useState(false)
  const [composePrefill, setComposePrefill] = useState<ComposePrefill>({})

  const openCompose = (prefill: ComposePrefill = {}) => {
    setComposePrefill(prefill)
    setComposeOpen(true)
  }

  const loadSubmissions = useCallback(async () => {
    const res = await fetch('/api/admin/submissions')
    if (res.ok) {
      const data = await res.json()
      setSubmissions(data.submissions)
    }
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
        await loadSubmissions()
      } catch {
        router.push('/admin-login')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [router, loadSubmissions])

  const handleSignOut = async () => {
    await fetch('/api/admin-logout', { method: 'POST' })
    router.push('/admin-login')
  }

  const setStatus = async (id: string, status: 'read' | 'new') => {
    setBusy(id)
    await fetch(`/api/admin/submissions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)))
    setBusy(null)
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this submission permanently?')) return
    setBusy(id)
    await fetch(`/api/admin/submissions/${id}`, { method: 'DELETE' })
    setSubmissions((prev) => prev.filter((s) => s.id !== id))
    if (active === id) setActive(null)
    setBusy(null)
  }

  const openSubmission = (s: Submission) => {
    setActive(active === s.id ? null : s.id)
    if (s.status === 'new') setStatus(s.id, 'read')
  }

  const newCount = submissions.filter((s) => s.status === 'new').length

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl md:text-3xl font-extrabold uppercase">Submissions</h1>
              {newCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-accent text-black text-xs font-bold">
                  {newCount} new
                </span>
              )}
            </div>
            <p className="text-neutral-500 text-sm mt-1">Logged in as {admin?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => openCompose()} className="gap-2 bg-accent text-black hover:opacity-90">
              <PenSquare className="w-4 h-4" /> Compose
            </Button>
            <Button variant="outline" size="sm" onClick={loadSubmissions} className="gap-2 border-neutral-700 bg-transparent">
              <RefreshCw className="w-4 h-4" /> Refresh
            </Button>
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

        {/* List */}
        {submissions.length === 0 ? (
          <div className="border border-neutral-800 rounded-2xl p-16 text-center">
            <Inbox className="w-10 h-10 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400">No submissions yet.</p>
            <p className="text-neutral-600 text-sm mt-1">Contact form messages will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((s) => (
              <div
                key={s.id}
                className={`border rounded-xl overflow-hidden transition-colors ${
                  s.status === 'new' ? 'border-accent/40 bg-accent/[0.03]' : 'border-neutral-800 bg-neutral-900/40'
                }`}
              >
                <button
                  onClick={() => openSubmission(s)}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/[0.02]"
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${s.status === 'new' ? 'bg-accent' : 'bg-neutral-600'}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white truncate">{s.name}</span>
                      {s.status === 'new' && <span className="text-[10px] uppercase tracking-wider text-accent font-bold">New</span>}
                    </div>
                    <p className="text-sm text-neutral-400 truncate">{s.subject}</p>
                  </div>
                  <span className="text-xs text-neutral-500 shrink-0 hidden sm:block">
                    {new Date(s.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </button>

                {active === s.id && (
                  <div className="border-t border-neutral-800 p-4 md:p-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Email</p>
                        <a href={`mailto:${s.email}`} className="text-accent hover:underline break-all">{s.email}</a>
                      </div>
                      {s.phone && (
                        <div>
                          <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Phone</p>
                          <p className="text-white">{s.phone}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Received</p>
                        <p className="text-white">{new Date(s.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Message</p>
                      <p className="text-neutral-200 text-sm leading-relaxed whitespace-pre-wrap">{s.message}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <Button
                        size="sm"
                        onClick={() => openCompose({ to: s.email, subject: `Re: ${s.subject}` })}
                        className="gap-2 bg-accent text-black hover:opacity-90"
                      >
                        <Mail className="w-4 h-4" /> Reply
                      </Button>
                      {s.status === 'new' ? (
                        <Button size="sm" variant="outline" disabled={busy === s.id} onClick={() => setStatus(s.id, 'read')} className="gap-2 border-neutral-700 bg-transparent">
                          <Check className="w-4 h-4" /> Mark read
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled={busy === s.id} onClick={() => setStatus(s.id, 'new')} className="gap-2 border-neutral-700 bg-transparent">
                          Mark unread
                        </Button>
                      )}
                      <Button size="sm" variant="outline" disabled={busy === s.id} onClick={() => remove(s.id)} className="gap-2 border-red-900/50 text-red-400 hover:bg-red-500/10 bg-transparent ml-auto">
                        <Trash2 className="w-4 h-4" /> Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ComposeEmail
        open={composeOpen}
        prefill={composePrefill}
        onClose={() => setComposeOpen(false)}
      />
    </div>
  )
}
