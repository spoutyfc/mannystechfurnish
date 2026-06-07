'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Check } from 'lucide-react'

interface Service {
  id: string
  title: string
  description: string
  icon: string | null
  pricingType: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/public/services')
        const data = await res.json()
        setServices(data)
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Manny&apos;s Tech Furnish
          </Link>
          <div className="flex gap-4">
            <Link href="/portfolio" className="text-slate-300 hover:text-white">Portfolio</Link>
            <Link href="/services" className="text-slate-300 hover:text-white">Services</Link>
            <Link href="/sign-in">
              <Button variant="outline" className="bg-slate-800 hover:bg-slate-700 text-white border-slate-700">
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Our Services
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Comprehensive tech solutions tailored to your business needs
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center text-slate-400">Loading services...</div>
          ) : services.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {services.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-slate-900 border-slate-800 p-8 hover:border-cyan-500/50 transition-all h-full flex flex-col group cursor-pointer">
                    {service.icon && (
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                        {service.icon}
                      </div>
                    )}
                    <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                    <p className="text-slate-400 mb-6 flex-1">{service.description}</p>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Check size={16} className="text-cyan-400" />
                        Professional service
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Check size={16} className="text-cyan-400" />
                        Expert team
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Check size={16} className="text-cyan-400" />
                        Timely delivery
                      </div>
                    </div>

                    <div className="text-xs bg-blue-500/10 text-blue-300 px-3 py-1 rounded w-fit mb-4">
                      {service.pricingType === 'both' ? 'Flexible Pricing' : service.pricingType === 'recurring' ? 'Recurring' : 'One-Time'}
                    </div>

                    <Button className="w-full bg-cyan-600 hover:bg-cyan-700 gap-2">
                      Learn More <ArrowRight size={16} />
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center">
              <Card className="bg-slate-900 border-slate-800 p-12">
                <p className="text-slate-400 mb-4">No services published yet</p>
                <p className="text-sm text-slate-500">Check back soon for our service offerings</p>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl text-slate-300 mb-8">Let&apos;s discuss which service is right for you</p>
          <Link href="/sign-up">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-lg px-8 py-6 gap-2">
              Contact Us <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
