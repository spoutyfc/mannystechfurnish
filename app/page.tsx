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
import { ArrowUpRight, ArrowRight } from 'lucide-react'

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
    description:
      'A licensed structural engineering firm serving the Bay Area for 10+ years. We rebuilt their digital presence to match their reputation.',
    points: ['500+ projects showcased', 'Ranks #1 for "structural engineer Bay Area"', '3x more consults'],
    url: 'https://oaktownengineers.com',
  },
  {
    index: '02',
    tag: 'Auto Dealership',
    name: 'United Flex Auto',
    description:
      'A premium pre-owned dealership that needed a modern site to showcase inventory and drive online leads at scale.',
    points: ['Full inventory system', 'Online test-drive booking', '200% more inquiries'],
    url: 'https://unitedflexauto.com',
  },
]

const services = [
  {
    num: '01',
    title: 'Design & Build',
    desc: 'Custom full-stack development from concept to launch. High-performance front-end, secure back-end, fully responsive.',
  },
  {
    num: '02',
    title: 'Search & SEO',
    desc: 'Schema markup, sitemaps, speed tuning and on-page optimization built in from day one so customers actually find you.',
  },
  {
    num: '03',
    title: 'Growth & Ads',
    desc: 'Google Ads setup and management, conversion optimization, and clear analytics reporting that ties spend to results.',
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
  'Basic SEO check-ins',
  'Buy out the code after term: $600',
]

const steps = [
  { num: '1', title: 'Free Consultation', desc: 'We talk goals, scope, and fit. No pressure — just a real conversation.' },
  { num: '2', title: 'Clear Proposal', desc: 'A detailed quote with everything spelled out. No hidden fees, no surprises.' },
  { num: '3', title: 'Weekly Updates', desc: 'You stay in the loop the whole build. You always know where things stand.' },
  { num: '4', title: 'Launch + Support', desc: 'Your site goes live and I stick around to keep it running smoothly.' },
]

const marqueeItems = [
  'Web Design',
  'SEO',
  'Google Ads',
  'Full-Stack Dev',
  'Conversion',
  'Branding',
  'Performance',
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
            sameAs: ['https://oaktownengineers.com', 'https://unitedflexauto.com'],
          }),
        }}
      />
      <Preloader />
      <SmoothScroll />
      <ScrollProgress />
      <SiteNav />

      <ScrollBlur>
        {/* ---------------- HERO ---------------- */}
        <section className="relative overflow-hidden px-5 pb-20 pt-36 md:px-10 md:pb-28 md:pt-44">
          {/* soft radial wash — quiet, no WebGL */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.5]"
            style={{
              background:
                'radial-gradient(60% 55% at 78% 20%, oklch(0.83 0.062 78 / 0.10), transparent 70%)',
            }}
          />
          <div className="mx-auto max-w-[1400px]">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-12 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span>Web Studio — Est. 2023</span>
            </motion.div>

            <h1 className="max-w-[16ch] font-display text-[13vw] font-medium leading-[0.95] tracking-[-0.03em] md:text-[7.5vw] lg:text-[6.5rem]">
              <AnimatedHeading as="span" text="Websites that" className="block" />
              <span className="block text-muted-foreground">
                <AnimatedHeading as="span" text="actually" className="inline" delay={0.12} />{' '}
                <span className="inline-block overflow-hidden align-bottom">
                  <motion.span
                    className="inline-block text-foreground"
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.32 }}
                  >
                    convert.
                  </motion.span>
                </span>
              </span>
            </h1>

            <div className="mt-14 grid items-end gap-10 border-t border-border pt-10 md:grid-cols-[1.5fr_1fr]">
              <FadeUp index={1}>
                <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
                  Premium, hand-built websites that rank on Google and turn visitors into paying
                  customers. No templates, no fluff — delivered on time.
                </p>
              </FadeUp>
              <FadeUp index={2} className="flex flex-col gap-3 sm:flex-row md:justify-end">
                <Magnetic strength={0.3}>
                  <Link
                    href="/contact"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-opacity hover:opacity-90 sm:w-auto"
                  >
                    Start a project
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </Magnetic>
                <Magnetic strength={0.3}>
                  <a
                    href="#work"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary sm:w-auto"
                  >
                    See the work
                  </a>
                </Magnetic>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ---------------- MARQUEE ---------------- */}
        <section className="border-y border-border py-5">
          <Marquee speed={26}>
            {marqueeItems.map((item, i) => (
              <span key={`${item}-${i}`} className="flex items-center">
                <span className="px-6 font-display text-xl font-normal tracking-tight text-muted-foreground md:text-2xl">
                  {item}
                </span>
                <span className="text-accent">·</span>
              </span>
            ))}
          </Marquee>
        </section>

        {/* ---------------- STATS ---------------- */}
        <section className="border-b border-border">
          <div className="mx-auto grid max-w-[1400px] grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <FadeUp
                key={s.label}
                index={i}
                className={`border-border px-5 py-10 md:px-10 md:py-14 ${
                  i < 2 ? 'border-b md:border-b-0' : ''
                } ${i % 2 === 0 ? 'border-r' : ''} ${i !== 3 ? 'md:border-r' : ''}`}
              >
                <CountUp
                  value={s.value}
                  className="font-display text-4xl font-medium tracking-tight md:text-6xl"
                />
                <p className="mt-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </p>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ---------------- WORK ---------------- */}
        <section id="work" className="border-b border-border px-5 py-24 md:px-10 md:py-32">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-accent">
                  Selected Work
                </p>
                <AnimatedHeading
                  as="h2"
                  text="Recent projects."
                  className="max-w-[12ch] font-display text-4xl font-medium leading-[1] tracking-[-0.02em] md:text-6xl"
                />
              </div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                ( 02 case studies )
              </p>
            </div>

            <div className="border-t border-border">
              {clients.map((client) => (
                <FadeUp key={client.name}>
                  <a
                    href={client.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group grid items-start gap-6 border-b border-border py-10 transition-colors hover:bg-secondary/40 md:grid-cols-[1fr_auto] md:gap-12 md:py-14"
                  >
                    <div className="max-w-2xl">
                      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
                        {client.tag}
                      </p>
                      <h3 className="font-display text-3xl font-medium tracking-tight transition-transform duration-300 group-hover:translate-x-2 md:text-5xl">
                        {client.name}
                      </h3>
                      <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                        {client.description}
                      </p>
                      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                        {client.points.map((point) => (
                          <span
                            key={point}
                            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground"
                          >
                            <span className="h-1 w-1 rounded-full bg-accent" />
                            {point}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border transition-all duration-300 group-hover:rotate-45 group-hover:border-foreground md:justify-self-end">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </a>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- TESTIMONIALS ---------------- */}
        <Testimonials />

        {/* ---------------- SERVICES ---------------- */}
        <section id="services" className="border-b border-border px-5 py-24 md:px-10 md:py-32">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-accent">
                  Services
                </p>
                <AnimatedHeading
                  as="h2"
                  text="What I do."
                  className="font-display text-4xl font-medium tracking-[-0.02em] md:text-6xl"
                />
              </div>
              <p className="max-w-xs font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Everything you need to launch, rank, and grow online.
              </p>
            </div>

            <div className="grid border-t border-border md:grid-cols-3">
              {services.map((service, i) => (
                <FadeUp
                  key={service.title}
                  index={i}
                  className={`group flex flex-col border-b border-border py-10 transition-colors hover:bg-secondary/40 md:border-b-0 md:py-12 ${
                    i !== 0 ? 'md:border-l md:pl-10' : 'md:pr-10'
                  } ${i === 1 ? 'md:px-10' : ''} ${i === 2 ? 'md:pl-10' : ''}`}
                >
                  <span className="font-mono text-xs tracking-widest text-muted-foreground">
                    {service.num}
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-medium tracking-tight">
                    {service.title}
                  </h3>
                  <p className="mt-4 flex-1 leading-relaxed text-muted-foreground">{service.desc}</p>
                  <ArrowRight className="mt-8 h-5 w-5 text-muted-foreground transition-all group-hover:translate-x-2 group-hover:text-accent" />
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- PROCESS ---------------- */}
        <section className="border-b border-border px-5 py-24 md:px-10 md:py-32">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-accent">
                  Process
                </p>
                <AnimatedHeading
                  as="h2"
                  text="How it works."
                  className="font-display text-4xl font-medium tracking-[-0.02em] md:text-6xl"
                />
              </div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                ( Simple. Clear. No surprises. )
              </p>
            </div>
            <div className="grid border-t border-border sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => (
                <FadeUp
                  key={step.num}
                  index={i}
                  className={`group flex flex-col border-b border-border py-10 sm:border-b-0 lg:py-12 ${
                    i !== 0 ? 'lg:border-l lg:pl-8' : 'lg:pr-8'
                  } ${i > 0 && i < 3 ? 'lg:px-8' : ''} ${i === 3 ? 'lg:pl-8' : ''} ${
                    i === 0 ? 'sm:border-r sm:pr-8' : ''
                  } ${i === 2 ? 'sm:border-r sm:pr-8' : ''} ${i === 1 ? 'sm:pl-8' : ''} ${
                    i === 3 ? 'sm:pl-8' : ''
                  }`}
                >
                  <span className="font-display text-5xl font-medium leading-none text-muted-foreground/50 transition-colors group-hover:text-accent md:text-6xl">
                    {step.num.padStart(2, '0')}
                  </span>
                  <h3 className="mt-8 font-display text-xl font-medium tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{step.desc}</p>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- WHY CHOOSE ME ---------------- */}
        <WhyChooseMe />

        {/* ---------------- PRICING ---------------- */}
        <section id="pricing" className="border-b border-border px-5 py-24 md:px-10 md:py-32">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-16">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-accent">
                Pricing
              </p>
              <AnimatedHeading
                as="h2"
                text="Pick your path."
                className="font-display text-4xl font-medium tracking-[-0.02em] md:text-6xl"
              />
              <FadeUp index={1}>
                <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
                  Two ways to work together. Same quality, same care — different commitment.
                </p>
              </FadeUp>
            </div>

            <div className="grid border-t border-border lg:grid-cols-2">
              <FadeUp className="flex flex-col border-b border-border py-10 lg:border-b-0 lg:border-r lg:py-12 lg:pr-12">
                <div className="flex items-center gap-3">
                  <p className="font-mono text-xs uppercase tracking-widest text-accent">
                    One-time — full ownership
                  </p>
                  <span className="rounded-full bg-accent px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-accent-foreground">
                    Most Popular
                  </span>
                </div>
                <h3 className="mt-5 font-display text-2xl font-medium tracking-tight">
                  Complete Digital Asset
                </h3>
                <div className="mt-6 font-display text-6xl font-medium tracking-tight md:text-7xl">
                  $1,299
                </div>
                <p className="mt-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Save $380+ vs monthly in first 3 months
                </p>
                <ul className="mt-8 flex-1 space-y-4">
                  {option1Features.map((f) => (
                    <li key={f} className="flex gap-3 border-b border-border pb-4 text-foreground/90">
                      <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-accent" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Magnetic strength={0.25} className="mt-10">
                  <Link
                    href="/contact"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-medium text-background transition-opacity hover:opacity-90"
                  >
                    Get started <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Magnetic>
              </FadeUp>

              <FadeUp index={1} className="flex flex-col py-10 lg:py-12 lg:pl-12">
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Monthly — managed for you
                </p>
                <h3 className="mt-5 font-display text-2xl font-medium tracking-tight">
                  Managed Website Plan
                </h3>
                <div className="mt-6 flex items-baseline gap-3 font-display text-5xl font-medium tracking-tight md:text-6xl">
                  $700 <span className="text-2xl text-muted-foreground/50">+</span>{' '}
                  <span className="text-accent">$120</span>
                  <span className="font-mono text-sm text-muted-foreground">/mo</span>
                </div>
                <p className="mt-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  3-month minimum — total $1,060
                </p>
                <ul className="mt-8 flex-1 space-y-4">
                  {option2Features.map((f) => (
                    <li key={f} className="flex gap-3 border-b border-border pb-4 text-foreground/90">
                      <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Magnetic strength={0.25} className="mt-10">
                  <Link
                    href="/contact"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-8 py-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    Let&apos;s do this one <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Magnetic>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ---------------- FAQ ---------------- */}
        <FAQ />

        {/* ---------------- CTA ---------------- */}
        <section className="overflow-hidden border-b border-border px-5 py-28 md:px-10 md:py-36">
          <div className="mx-auto max-w-[1400px]">
            <FadeUp>
              <p className="mb-8 font-mono text-xs uppercase tracking-[0.25em] text-accent">
                ( Let&apos;s build something )
              </p>
            </FadeUp>
            <h2 className="font-display text-[11vw] font-medium leading-[0.95] tracking-[-0.03em] md:text-[6rem]">
              <AnimatedHeading as="span" text="Ready to get" className="block" />
              <span className="block text-muted-foreground">
                <AnimatedHeading as="span" text="more" className="inline" delay={0.1} />{' '}
                <span className="inline-block overflow-hidden align-bottom">
                  <motion.span
                    className="inline-block text-foreground"
                    initial={{ y: '110%' }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.24 }}
                  >
                    customers?
                  </motion.span>
                </span>
              </span>
            </h2>
            <FadeUp index={1} className="mt-10 flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
              </span>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Currently accepting 2 new clients this month
              </p>
            </FadeUp>
            <FadeUp index={2} className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Magnetic strength={0.3}>
                <Link
                  href="/contact"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-9 py-4 text-sm font-medium text-background transition-opacity hover:opacity-90 sm:w-auto"
                >
                  Start your project
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Magnetic>
              <Magnetic strength={0.3}>
                <a
                  href="mailto:mansoor.buspro@gmail.com"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-9 py-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary sm:w-auto"
                >
                  mansoor.buspro@gmail.com
                </a>
              </Magnetic>
            </FadeUp>
            <FadeUp index={3} className="mt-6">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Or call / text <span className="text-foreground">(925) 278-9059</span>
              </p>
            </FadeUp>
          </div>
        </section>

        {/* ---------------- FOOTER ---------------- */}
        <footer className="overflow-hidden px-5 pb-8 pt-16 md:px-10">
          <div className="mx-auto max-w-[1400px]">
            <div className="flex flex-wrap items-end justify-between gap-8 border-b border-border pb-12">
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                <p className="mb-3 text-foreground">Contact</p>
                <a href="mailto:mansoor.buspro@gmail.com" className="hover:text-accent">
                  mansoor.buspro@gmail.com
                </a>
                <p className="mt-2">(925) 278-9059</p>
              </div>
              <div className="flex gap-10 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                <a href="#work" className="hover:text-foreground">
                  Work
                </a>
                <a href="#services" className="hover:text-foreground">
                  Services
                </a>
                <a href="#pricing" className="hover:text-foreground">
                  Pricing
                </a>
                <Link href="/contact" className="hover:text-foreground">
                  Contact
                </Link>
              </div>
            </div>
            <Parallax distance={30}>
              <p className="mt-8 font-display text-[14vw] font-medium leading-[0.85] tracking-[-0.03em] text-foreground md:text-[9rem]">
                Manny&apos;s
              </p>
            </Parallax>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 font-mono text-xs uppercase tracking-wider text-muted-foreground/70">
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
