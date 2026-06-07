'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/actions/payment'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, CheckCircle2, LogOut } from 'lucide-react'

export default function AdminClientLinksPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [generatedLink, setGeneratedLink] = useState<{ slug: string; url: string } | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    planType: 'option1' as 'option1' | 'option2',
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin-session')
        const data = await res.json()
        
        if (!data.authenticated) {
          router.push('/admin-login')
          return
        }

        setAdmin({ email: data.email })
        setLoading(false)
      } catch {
        router.push('/admin-login')
      }
    }
    
    checkAuth()
  }, [router])

  const handleSignOut = async () => {
    await fetch('/api/admin-logout', { method: 'POST' })
    router.push('/admin-login')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
        website: '',
        projectDescription: '',
        timeline: '',
        planType: formData.planType,
      })

      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const paymentUrl = `${baseUrl}/pay/${slug}`
      
      setGeneratedLink({ slug, url: paymentUrl })
      setFormData({ name: '', email: '', phone: '', companyName: '', planType: 'option1' })
    } catch (error) {
      console.error('Error generating link:', error)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-fuchsia-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-neutral-400">Logged in as {admin?.email}</p>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <form onSubmit={handleGenerateLink} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6">Create Client Payment Link</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Client Name *</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="John Doe"
                  className="bg-neutral-800 border-neutral-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="john@example.com"
                  className="bg-neutral-800 border-neutral-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(555) 123-4567"
                  className="bg-neutral-800 border-neutral-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Company</label>
                <Input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Company Name"
                  className="bg-neutral-800 border-neutral-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Plan *</label>
                <select 
                  name="planType"
                  value={formData.planType}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2"
                >
                  <option value="option1">Option 1 - $1,299 One-Time</option>
                  <option value="option2">Option 2 - $700 + $120/mo</option>
                </select>
              </div>

              <Button
                type="submit"
                disabled={generating}
                className="w-full bg-gradient-to-r from-fuchsia-500 to-cyan-500"
              >
                {generating ? 'Generating...' : 'Generate Payment Link'}
              </Button>
            </div>
          </form>

          {/* Generated Link */}
          {generatedLink && (
            <div className="bg-emerald-500/10 border border-emerald-500/50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-xl font-bold">Link Ready!</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-neutral-400 mb-1 block">Payment URL</label>
                  <div className="flex gap-2">
                    <code className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm break-all">
                      {generatedLink.url}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generatedLink.url)}
                    >
                      {copied === generatedLink.url ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-neutral-400">
                  Send this link to your client. They&apos;ll fill out project details and pay.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
