'use client'

import Link from 'next/link'
import { SiteNav } from '@/components/site/site-nav'
import { Preloader } from '@/components/site/preloader'
import { Marquee } from '@/components/site/marquee'
import { SmoothScroll } from '@/components/site/smooth-scroll'
import { ScrollProgress } from '@/components/site/scroll-progress'
import { Testimonials } from '@/components/site/testimonials'
import { WhyChooseMe } from '@/components/site/why-choose-me'
import { FAQ } from '@/components/site/faq'
import { ScrollToTop } from '@/components/site/scroll-to-top'
import { ScrollBlur } from '@/components/site/scroll-blur'
import {
  AnimatedHeading,
  FadeUp,
  Magnetic,
  CountUp,
  Parallax,
} from '@/components/site/motion'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowRight, Zap, Search, TrendingUp, Code2, Shield, Clock } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const

const stats = [
  { value: '12+', label: 'Projects shipped' },
  { value: '340%', label: 'Avg traffic lift' },
  { value: '100%', label: 'Client satisfaction' },
  { value: 'Page 1', label: 'Google rankings' },
]

const clients = [
  {
    index: '01',
    tag: 'Structural Engineering',
    name: 'Oaktown Engineers',
    year: '2024',
    description:
      'A licensed structural engineering firm serving the Bay Area for 10+ years. We rebuilt their entire digital presence from the ground up to match their reputation.',
    points: ['500+ projects showcased', 'Ranks #1 for "structural engineer Bay Area"', '3x more consults'],
    url: 'https://oaktownengineers.com',
  },
  {
    index: '02',
    tag: 'Auto Dealership',
    name: 'United Flex Auto',
    year: '2024',
    description:
      'A premium pre-owned dealership that needed a modern site to showcase their full inventory and drive qualified online leads at scale.',
    points: ['Full inventory system', 'Online test-drive booking', '200% more inquiries'],
    url: 'https://unitedflexauto.com',
  },
]

const services = [
  {
    num: '01',
    icon: Code2,
    title: 'Design & Build',
    desc: 'Custom full-stack development from concept to launch. High-performance front-end, secure back-end, fully responsive across every device.',
  },
  {
    num: '02',
    icon: Search,
    title: 'Search & SEO',
    desc: 'Schema markup, sitemaps, Core Web Vitals tuning, and on-page optimization built in from day one so real customers actually find you.',
  },
  {
    num: '03',
    icon: TrendingUp,
    title: 'Growth & Ads',
    desc: 'Google Ads setup and management, conversion rate optimization, and clean analytics reporting that ties every dollar of spend to results.',
  },
]

const option1Features = [
  'Custom full-stack development, concept to launch',
  'Complete codebase ownership — transferred immediately',
  'High-performance front-end + secure back-end',
  'Fully responsive across every device',
  'Advanced SEO + Google Analytics setup',
  'Optional $70/mo care plan for updates & security',
]

const option2Features = [
  'Website build included ($700 labor fee)',
  'Ongoing maintenance & hosting included',
  'Updates, security & priority support queue',
  'Basic SEO check-ins every month',
  'Buy out the code after term: $600',
]

const steps = [
  { num: '1', icon: Clock, title: 'Free Consultation', desc: 'We talk goals, scope, and fit. No pressure — just a real conversation about what you actually need.' },
  { num: '2', icon: Shield, title: 'Clear Proposal', desc: 'A detailed quote with everything spelled out. No hidden fees, no surprises — ever.' },
  { num: '3', icon: Zap, title: 'Weekly Updates', desc: 'You stay in the loop the whole build. You always know exactly where things stand.' },
  { num: '4', icon: TrendingUp, title: 'Launch + Support', desc: 'Your site goes live and I stick around to keep it running and growing.' },
]

const marqueeItems = [
  'Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL',
  'Stripe', 'Framer Motion', 'Vercel', 'SEO', 'Google Ads',
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            name: "Manny's Tech Furnish",
            description:
              'Custom website design and development for growing businesses, with SEO optimization, Google Ads, and ongoing support.',
            url: 'https://mannystechfurnish.com',
            email: 'mansoor.buspro@gmail.com',
            image: 'https://mannystechfurnish.com/og-image.png',
            priceRange: '$$',
            founder: { '@type': 'Person', name: 'Mansoor Arif' },
            areaServed: 'US',
            serviceType: ['Web Design', 'Web Development', 'SEO', 'Google Ads'],
          }),
        }}
      />
      <Preloader />
      <SmoothScroll />
      <ScrollProgress />
      <SiteNav />

      <ScrollBlur>

        {/* ============================================================
            HERO
        ============================================================ */}
        <section className="relative min-h-screen overflow-hidden px-5 pb-16 pt-28 md:px-10 md:pb-24 md:pt-48">

          {/* Grid background — structural, technical */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 grid-bg opacity-100" />

          {/* Teal origin glow — top-right, like a distant star */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[700px] w-[700px] rounded-full"
            style={{ background: 'radial-gradient(circle, oklch(0.74 0.14 185 / 0.08) 0%, transparent 65%)' }}
          />
          {/* Secondary deep glow — bottom left */}
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -left-20 -z-10 h-[500px] w-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, oklch(0.74 0.14 185 / 0.04) 0%, transparent 70%)' }}
          />

          <div className="mx-auto max-w-[1400px]">
            {/* Status indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mb-10 flex items-center gap-3 md:mb-14"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
                Available for new projects
              </span>
              <span className="h-px flex-1 max-w-[60px] bg-border" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Est. 2023
              </span>
            </motion.div>

            {/* Main headline */}
            <div className="relative">
              <h1 className="max-w-[18ch] font-display text-[11.5vw] font-semibold leading-[0.92] tracking-[-0.04em] md:text-[7vw] lg:text-[6.2rem]">
                <AnimatedHeading as="span" text="Websites built" className="block" />
                <span className="block">
                  <AnimatedHeading as="span" text="to win" className="inline text-muted-foreground" delay={0.1} />
                  {' '}
                  <span className="inline-block overflow-hidden align-bottom">
                    <motion.span
                      className="inline-block"
                      style={{ color: 'var(--accent)' }}
                      initial={{ y: '110%', opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.8, ease: EASE, delay: 0.26 }}
                    >
                      business.
                    </motion.span>
                  </span>
                </span>
              </h1>

              {/* Decorative index — top-right */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="absolute right-0 top-0 hidden font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 lg:block"
              >
                [MTF_001]
              </motion.div>
            </div>

            {/* Sub-grid: description + CTAs */}
            <div className="mt-10 grid items-end gap-8 border-t border-border pt-8 md:mt-16 md:grid-cols-[1.5fr_1fr] md:gap-10 md:pt-10">
              <FadeUp index={1}>
                <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
                  Premium, hand-built websites that rank on Google and turn visitors into paying
                  customers. No templates, no fluff — delivered on time, every time.
                </p>
              </FadeUp>
              <FadeUp index={2} className="flex flex-col gap-3 sm:flex-row md:justify-end">
                <Magnetic strength={0.3}>
                  <Link
                    href="/contact"
                    className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-accent-foreground transition-all hover:opacity-90 sm:w-auto"
                  >
                    Start a project
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </Magnetic>
                <Magnetic strength={0.3}>
                  <a
                    href="#work"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent/40 hover:bg-secondary sm:w-auto"
                  >
                    See the work
                  </a>
                </Magnetic>
              </FadeUp>
            </div>

            {/* Tech stack row */}
            <FadeUp index={3} className="mt-16">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50">
                  Stack
                </span>
                {['Next.js', 'TypeScript', 'Tailwind CSS', 'Postgres', 'Vercel'].map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ============================================================
            MARQUEE
        ============================================================ */}
        <section className="accent-top overflow-hidden border-b border-border py-4">
          <Marquee speed={28}>
            {marqueeItems.map((item, i) => (
              <span key={`${item}-${i}`} className="flex items-center">
                <span className="px-8 font-mono text-sm uppercase tracking-[0.25em] text-muted-foreground">
                  {item}
                </span>
                <span className="text-accent opacity-60">_</span>
              </span>
            ))}
          </Marquee>
        </section>

        {/* ============================================================
            STATS
        ============================================================ */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto grid max-w-[1400px] grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <FadeUp
                key={s.label}
                index={i}
                className={`group relative border-border px-6 py-10 transition-colors hover:bg-secondary/60 md:px-10 md:py-16 ${
                  /* bottom border: all top row on mobile (i<2), plus bottom row gets it too so nothing is borderless */
                  i < 2 ? 'border-b' : 'border-b md:border-b-0'
                } ${
                  /* right border: every even index on mobile, every non-last on desktop */
                  i % 2 === 0 ? 'border-r' : ''
                } ${i !== 3 ? 'md:border-r' : ''}`}
              >
                <CountUp
                  value={s.value}
                  className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-6xl"
                />
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {s.label}
                </p>
                {/* Teal accent bottom line on hover */}
                <span className="absolute bottom-0 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full" />
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ============================================================
            WORK
        ============================================================ */}
        <section id="work" className="border-b border-border px-5 py-16 md:px-10 md:py-32">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-16">
              <div>
                <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
                  Selected Work
                </p>
                <AnimatedHeading
                  as="h2"
                  text="Recent projects."
                  className="max-w-[12ch] font-display text-4xl font-semibold leading-[1] tracking-[-0.03em] md:text-6xl"
                />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                02 case studies
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {clients.map((client, idx) => (
                <FadeUp key={client.name} index={idx}>
                  <a
                    href={client.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="work-card group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_0_60px_-12px_oklch(0.735_0.148_185_/_0.25)]"
                  >
                    {/* Colored accent band — unique per project */}
                    <div
                      className="relative h-48 w-full overflow-hidden md:h-56"
                      style={{
                        background: idx === 0
                          ? 'linear-gradient(135deg, oklch(0.18 0.04 240) 0%, oklch(0.22 0.06 200) 40%, oklch(0.25 0.10 180) 100%)'
                          : 'linear-gradient(135deg, oklch(0.18 0.04 280) 0%, oklch(0.20 0.06 260) 40%, oklch(0.15 0.03 220) 100%)',
                      }}
                    >
                      {/* Grid overlay inside the card header */}
                      <div
                        aria-hidden
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage: 'linear-gradient(oklch(0.735 0.148 185 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(0.735 0.148 185 / 0.3) 1px, transparent 1px)',
                          backgroundSize: '32px 32px',
                        }}
                      />
                      {/* Floating index */}
                      <span className="absolute left-6 top-6 font-mono text-[10px] tracking-[0.3em] text-foreground/20">
                        {client.index}
                      </span>
                      {/* Year */}
                      <span className="absolute right-6 top-6 font-mono text-[10px] tracking-[0.25em] text-foreground/30">
                        {client.year}
                      </span>
                      {/* Large ghost project name */}
                      <div className="absolute bottom-0 left-0 right-0 px-6 pb-5">
                        <p className="font-display text-5xl font-semibold leading-none tracking-[-0.04em] text-foreground/[0.07] md:text-6xl">
                          {client.name}
                        </p>
                      </div>
                      {/* Teal glow from bottom-left on hover */}
                      <div
                        aria-hidden
                        className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                        style={{ background: 'oklch(0.735 0.148 185 / 0.18)' }}
                      />
                    </div>

                    {/* Card body */}
                    <div className="flex flex-1 flex-col p-6 md:p-8">
                      {/* Tag + arrow row */}
                      <div className="mb-5 flex items-center justify-between">
                        <span className="rounded-full border border-border px-3 py-1 font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground transition-colors group-hover:border-accent/40 group-hover:text-accent">
                          {client.tag}
                        </span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground">
                          <ArrowUpRight className="h-4 w-4" />
                        </div>
                      </div>

                      {/* Project name */}
                      <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                        {client.name}
                      </h3>
                      <p className="mt-3 leading-relaxed text-muted-foreground">
                        {client.description}
                      </p>

                      {/* Results — the money row */}
                      <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-5">
                        {client.points.map((point) => (
                          <span
                            key={point}
                            className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground transition-colors group-hover:border-accent/20 group-hover:text-foreground/70"
                          >
                            <span className="h-1 w-1 shrink-0 rounded-full bg-accent" />
                            {point}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Teal shimmer sweep on hover — runs left to right */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accent/[0.04] to-transparent transition-transform duration-700 group-hover:translate-x-full"
                    />
                  </a>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            TESTIMONIALS
        ============================================================ */}
        <Testimonials />

        {/* ============================================================
            SERVICES
        ============================================================ */}
        <section id="services" className="border-b border-border px-5 py-16 md:px-10 md:py-32">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-16">
              <div>
                <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
                  Services
                </p>
                <AnimatedHeading
                  as="h2"
                  text="What I build."
                  className="font-display text-4xl font-semibold tracking-[-0.03em] md:text-6xl"
                />
              </div>
              <p className="max-w-xs font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Everything needed to launch, rank, and grow online.
              </p>
            </div>

            <div className="grid border-t border-border md:grid-cols-3">
              {services.map((service, i) => (
                <FadeUp
                  key={service.title}
                  index={i}
                  className={`group relative flex flex-col border-b border-border py-10 transition-colors hover:bg-card md:py-12 ${
                    i !== services.length - 1 ? 'md:border-b-0' : 'md:border-b-0'
                  } ${i !== 0 ? 'md:border-l md:pl-10' : 'md:pr-10'} ${i === 1 ? 'md:px-10' : ''}`}
                >
                  {/* Number */}
                  <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground/50">
                    {service.num}
                  </span>
                  {/* Icon */}
                  <div className="mt-6 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary transition-colors group-hover:border-accent/40 group-hover:bg-accent/10">
                    <service.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-accent" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">
                    {service.title}
                  </h3>
                  <p className="mt-4 flex-1 leading-relaxed text-muted-foreground">{service.desc}</p>
                  <ArrowRight className="mt-10 h-4 w-4 text-muted-foreground/40 transition-all group-hover:translate-x-2 group-hover:text-accent" />
                  {/* Bottom accent line */}
                  <span className="absolute bottom-0 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full" />
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            PROCESS
        ============================================================ */}
        <section className="border-b border-border bg-card px-5 py-16 md:px-10 md:py-32">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-16">
              <div>
                <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
                  Process
                </p>
                <AnimatedHeading
                  as="h2"
                  text="How it works."
                  className="font-display text-4xl font-semibold tracking-[-0.03em] md:text-6xl"
                />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Simple. Clear. No surprises.
              </p>
            </div>
            <div className="grid border-t border-border sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => (
                <FadeUp
                  key={step.num}
                  index={i}
                  className={`group relative flex flex-col py-10 lg:py-12 ${
                    /* mobile: border-b on all except last */
                    i < steps.length - 1 ? 'border-b border-border' : ''
                  } ${
                    /* sm: 2-col — right border on cols 0 and 2 (left of each row), bottom cleared */
                    i === 0 ? 'sm:border-b-0 sm:border-r sm:pr-8' : ''
                  } ${
                    i === 1 ? 'sm:border-b-0 sm:border-b sm:pl-8 lg:border-b-0' : ''
                  } ${
                    i === 2 ? 'sm:border-b-0 sm:border-r sm:pr-8' : ''
                  } ${
                    i === 3 ? 'sm:border-b-0 sm:pl-8' : ''
                  } ${
                    /* lg: 4-col — left border and padding */
                    i !== 0 ? 'lg:border-l lg:border-b-0 lg:pl-8' : 'lg:border-b-0 lg:pr-8'
                  } ${i > 0 && i < 3 ? 'lg:px-8' : ''}`}
                >
                  {/* Big ghost number */}
                  <span className="font-display text-6xl font-semibold leading-none text-border transition-colors duration-300 group-hover:text-accent/30 md:text-7xl">
                    {step.num.padStart(2, '0')}
                  </span>
                  <div className="mt-6 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background transition-colors group-hover:border-accent/40 group-hover:bg-accent/10">
                    <step.icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-accent" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{step.desc}</p>
                  {/* Teal hover line */}
                  <span className="absolute bottom-0 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full" />
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            WHY CHOOSE ME
        ============================================================ */}
        <WhyChooseMe />

        {/* ============================================================
            PRICING
        ============================================================ */}
        <section id="pricing" className="border-b border-border px-5 py-16 md:px-10 md:py-32">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-10 md:mb-16">
              <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
                Pricing
              </p>
              <AnimatedHeading
                as="h2"
                text="Pick your path."
                className="font-display text-4xl font-semibold tracking-[-0.03em] md:text-6xl"
              />
              <FadeUp index={1}>
                <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
                  Two ways to work together. Same quality, same care — different commitment level.
                </p>
              </FadeUp>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {/* Option 1 — Featured / Most Popular */}
              <FadeUp className="relative flex flex-col overflow-hidden rounded-2xl border border-accent/40 bg-card shadow-[0_0_80px_-20px_oklch(0.735_0.148_185_/_0.20)]">
                {/* Teal glow bleeding in from the top */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-16 left-1/2 h-40 w-2/3 -translate-x-1/2 rounded-full blur-3xl"
                  style={{ background: 'oklch(0.735 0.148 185 / 0.12)' }}
                />
                {/* Top accent line */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-accent to-transparent" />

                <div className="relative flex flex-1 flex-col p-8 lg:p-10">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-accent">
                      One-time · Full ownership
                    </span>
                    <span className="rounded-full bg-accent/10 px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-accent ring-1 ring-accent/30">
                      Most popular
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight md:text-3xl">
                    Complete Digital Asset
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    You own the full codebase the day it ships. No lock-in, no recurring surprises.
                  </p>

                  <div className="mt-8 flex items-baseline gap-2">
                    <span className="font-display text-6xl font-semibold tracking-tight md:text-7xl">$1,299</span>
                    <span className="font-mono text-sm text-muted-foreground">one-time</span>
                  </div>
                  <p className="mt-1.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                    Save $380+ vs monthly over 3 months
                  </p>

                  <ul className="mt-8 flex-1 space-y-3 border-t border-border pt-7">
                    {option1Features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-foreground/90">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        <span className="leading-relaxed">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Magnetic strength={0.2} className="mt-10">
                    <Link
                      href="/contact"
                      className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-accent px-8 py-4 text-sm font-semibold text-accent-foreground transition-all hover:opacity-90 hover:shadow-[0_0_30px_-4px_oklch(0.735_0.148_185_/_0.5)]"
                    >
                      Get started
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </Magnetic>
                </div>
              </FadeUp>

              {/* Option 2 — Managed */}
              <FadeUp index={1} className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 hover:border-border/80 hover:shadow-[0_8px_40px_-12px_oklch(0.108_0.012_240_/_0.8)]">
                {/* Subtle top line — non-teal, secondary feel */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

                <div className="relative flex flex-1 flex-col p-8 lg:p-10">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-muted-foreground">
                      Monthly · Managed for you
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight md:text-3xl">
                    Managed Website Plan
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    Low upfront cost, everything handled. Hosting, maintenance, SEO check-ins — all in.
                  </p>

                  <div className="mt-8">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-4xl font-semibold tracking-tight">$700</span>
                      <span className="font-mono text-sm text-muted-foreground">setup</span>
                      <span className="mx-2 font-display text-2xl text-border">+</span>
                      <span className="font-display text-5xl font-semibold tracking-tight text-foreground/80">$120</span>
                      <span className="font-mono text-sm text-muted-foreground">/ 3 months</span>
                    </div>
                    <p className="mt-1.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                      3-month minimum — total $1,060
                    </p>
                  </div>

                  <ul className="mt-8 flex-1 space-y-3 border-t border-border pt-7">
                    {option2Features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-foreground/75">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                        <span className="leading-relaxed">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Magnetic strength={0.2} className="mt-10">
                    <Link
                      href="/contact"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-8 py-4 text-sm font-medium text-foreground transition-all hover:border-accent/50 hover:bg-secondary"
                    >
                      Let&apos;s do this one
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Magnetic>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ============================================================
            FAQ
        ============================================================ */}
        <FAQ />

        {/* ============================================================
            CTA
        ============================================================ */}
        <section className="relative overflow-hidden border-b border-border px-5 py-32 md:px-10 md:py-44">
          {/* Grid bg continues */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 grid-bg opacity-60" />
          {/* Teal glow centered */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, oklch(0.74 0.14 185 / 0.07), transparent 70%)' }}
          />

          <div className="mx-auto max-w-[1400px]">
            <FadeUp>
              <div className="flex items-center gap-3 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
                  Currently accepting 2 new clients this month
                </p>
              </div>
            </FadeUp>

            <h2 className="font-display text-[11.5vw] font-semibold leading-[0.92] tracking-[-0.04em] md:text-[6.5rem]">
              <AnimatedHeading as="span" text="Ready to get" className="block" />
              <span className="block">
                <AnimatedHeading as="span" text="more" className="inline text-muted-foreground" delay={0.1} />
                {' '}
                <span className="inline-block overflow-hidden align-bottom">
                  <motion.span
                    className="inline-block"
                    style={{ color: 'var(--accent)' }}
                    initial={{ y: '110%' }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.24 }}
                  >
                    customers?
                  </motion.span>
                </span>
              </span>
            </h2>

            <FadeUp index={1} className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Magnetic strength={0.3}>
                <Link
                  href="/contact"
                  className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-accent px-9 py-4 text-sm font-semibold text-accent-foreground transition-all hover:opacity-90 sm:w-auto"
                >
                  Start your project
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Magnetic>
              <Magnetic strength={0.3}>
                <a
                  href="mailto:mansoor.buspro@gmail.com"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-9 py-4 text-sm font-medium text-foreground transition-colors hover:border-accent/40 hover:bg-card sm:w-auto"
                >
                  mansoor.buspro@gmail.com
                </a>
              </Magnetic>
            </FadeUp>
            <FadeUp index={2} className="mt-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Or call / text{' '}
                <a href="tel:9252789059" className="text-foreground hover:text-accent transition-colors">(925) 278-9059</a>
              </p>
            </FadeUp>
          </div>
        </section>

        {/* ============================================================
            FOOTER
        ============================================================ */}
        <footer className="overflow-hidden px-5 pb-8 pt-16 md:px-10">
          <div className="mx-auto max-w-[1400px]">
            <div className="flex flex-wrap items-end justify-between gap-8 border-b border-border pb-12">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                <p className="mb-3 text-foreground">Contact</p>
                <a href="mailto:mansoor.buspro@gmail.com" className="transition-colors hover:text-accent">
                  mansoor.buspro@gmail.com
                </a>
                <p className="mt-2">(925) 278-9059</p>
              </div>
              <div className="flex gap-10 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                <a href="#work" className="transition-colors hover:text-foreground">Work</a>
                <a href="#services" className="transition-colors hover:text-foreground">Services</a>
                <a href="#pricing" className="transition-colors hover:text-foreground">Pricing</a>
                <Link href="/contact" className="transition-colors hover:text-foreground">Contact</Link>
              </div>
            </div>
            <Parallax distance={24}>
              <p className="mt-8 font-display text-[13vw] font-semibold leading-[0.88] tracking-[-0.04em] text-foreground/10 md:text-[8.5rem]">
                Manny&apos;s
              </p>
            </Parallax>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/50">
              <span>&copy; {new Date().getFullYear()} Manny&apos;s Tech Furnish</span>
              <span>Websites that bring customers to your business</span>
            </div>
          </div>
        </footer>

      </ScrollBlur>
      <ScrollToTop />
    </div>
  )
}
