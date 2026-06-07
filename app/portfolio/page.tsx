'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, ExternalLink } from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  imageUrl: string | null
  projectUrl: string | null
  technologies: string | null
}

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/public/portfolio')
        const data = await res.json()
        setProjects(data)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
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
                Our Portfolio
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Explore our latest projects and see how we bring ideas to life
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center text-slate-400">Loading projects...</div>
          ) : projects.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-slate-900 border-slate-800 overflow-hidden hover:border-cyan-500/50 transition-all h-full group cursor-pointer">
                    {project.imageUrl && (
                      <div className="h-48 overflow-hidden bg-slate-800">
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-3">{project.description}</p>

                      {project.technologies && (
                        <div className="mb-4 flex flex-wrap gap-2">
                          {JSON.parse(project.technologies).map((tech: string) => (
                            <span
                              key={tech}
                              className="text-xs bg-cyan-500/10 text-cyan-300 px-2 py-1 rounded border border-cyan-500/30"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      {project.projectUrl && (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1"
                        >
                          View Project <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center">
              <Card className="bg-slate-900 border-slate-800 p-12">
                <p className="text-slate-400 mb-4">No portfolio projects yet</p>
                <p className="text-sm text-slate-500">Check back soon for our latest work</p>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Interested in working together?</h2>
          <p className="text-xl text-slate-300 mb-8">Let&apos;s create your next amazing project</p>
          <Link href="/sign-up">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-lg px-8 py-6 gap-2">
              Get Started <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
