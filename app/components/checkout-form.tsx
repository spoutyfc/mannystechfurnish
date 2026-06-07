'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient, createClientCheckoutSession } from '@/app/actions/payment'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function CheckoutForm({ initialPlan }: { initialPlan?: 'option1' | 'option2' }) {
  const router = useRouter()
  const [plan, setPlan] = useState<'option1' | 'option2'>(initialPlan || 'option1')
  const [includeCareplan, setIncludeCareplan] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    website: '',
    projectDescription: '',
    timeline: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create client in database
      const { clientId } = await createClient({
        ...formData,
        planType: plan,
        includeCareplan,
      })

      // Create Stripe checkout session
      const { sessionId } = await createClientCheckoutSession(clientId, plan, includeCareplan)

      // Redirect to Stripe checkout
      const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      if (!stripePublicKey) {
        throw new Error('Stripe public key not found')
      }

      // Use the Stripe redirect URL directly
      window.location.href = `https://checkout.stripe.com/pay/${sessionId}`
    } catch (error) {
      console.error('Error:', error)
      alert('Error creating checkout session. Please try again.')
      setLoading(false)
    }
  }

  const planDetails = {
    option1: {
      title: 'Option 1: Complete Digital Asset',
      price: '$1,299',
      subtitle: 'One-Time Investment',
      features: [
        'Custom full-stack development',
        'Complete codebase ownership',
        'Advanced SEO & Analytics',
        'Fully responsive design',
        'Optional $70/mo care plan',
      ],
    },
    option2: {
      title: 'Option 2: Managed Website Plan',
      price: '$700 + $120/mo',
      subtitle: 'Build Fee + Monthly Lease',
      features: [
        'Website build ($700)',
        'Monthly management ($120)',
        'Hosting & maintenance included',
        'Updates & security',
        'Basic SEO check-ins',
        '3-month minimum commitment',
      ],
    },
  }

  const selected = planDetails[plan]

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Plan Details */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-2">{selected.title}</h2>
            <p className="text-neutral-400 mb-6">{selected.subtitle}</p>
            <div className="text-4xl font-bold mb-8 text-fuchsia-400">{selected.price}</div>
            
            <div className="space-y-3 mb-8">
              {selected.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-neutral-300">{feature}</span>
                </div>
              ))}
            </div>

            {/* Plan Selection */}
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-semibold mb-3 block">Select Your Plan</span>
                <select 
                  value={plan} 
                  onChange={(e) => setPlan(e.target.value as 'option1' | 'option2')}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500"
                >
                  <option value="option1">Option 1 - Complete Digital Asset ($1,299)</option>
                  <option value="option2">Option 2 - Managed Plan ($700 + $120/mo)</option>
                </select>
              </label>

              {plan === 'option1' && (
                <label className="flex items-center gap-3 p-4 bg-neutral-800/50 rounded-lg cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={includeCareplan}
                    onChange={(e) => setIncludeCareplan(e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                  <div>
                    <span className="font-semibold text-white">Add Advanced Care Plan</span>
                    <p className="text-sm text-neutral-400">$70/mo for priority updates & security</p>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Right: Checkout Form */}
          <form onSubmit={handleSubmit} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6">Project Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Full Name *</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="John Doe"
                  className="bg-neutral-800 border-neutral-700"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Email Address *</label>
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
                <label className="block text-sm font-semibold mb-2">Phone Number</label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(555) 123-4567"
                  className="bg-neutral-800 border-neutral-700"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Company Name</label>
                <Input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Your Company"
                  className="bg-neutral-800 border-neutral-700"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Current Website</label>
                <Input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="bg-neutral-800 border-neutral-700"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Project Description</label>
                <textarea
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                  placeholder="Tell me about your project..."
                  rows={4}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-fuchsia-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Timeline</label>
                <Input
                  type="text"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  placeholder="e.g., 2 weeks, ASAP"
                  className="bg-neutral-800 border-neutral-700"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 hover:from-fuchsia-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg"
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
