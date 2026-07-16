'use client'

import Link from 'next/link'
import Image from 'next/image'
import { SiteNav } from '@/components/site/site-nav'
import { Preloader } from '@/components/site/preloader'
import { Marquee } from '@/components/site/marquee'
import { SmoothScroll } from '@/components/site/smooth-scroll'
import { ScrollProgress } from '@/components/site/scroll-progress'
import { MediaBackdrop } from '@/components/site/media-backdrop'
import { HeroOrb } from '@/components/site/hero-orb'
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
  ClipReveal,
  Tilt,
} from '@/components/site/motion'
import { PAYMENT_LINKS, ADD_ONS } from '@/lib/plans'
import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  X,
  CalendarClock,
  Sparkles,
  Box,
  PenSquare,
  Languages,
  ShieldCheck,
} from 'lucide-react'

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
    image: '/images/work-oaktown.png',
  },
  {
    index: '02',
    tag: 'Auto Dealership',
    name: 'United Flex Auto',
    description:
      'A premium pre-owned dealership that needed a modern site to showcase inventory and drive online leads at scale.',
    points: ['Full inventory system', 'Online test-drive booking', '200% more inquiries'],
    url: 'https://unitedflexauto.com',
    image: '/images/work-unitedflex.png',
  },
]

const services = [
  {
    num: '01',
    title: 'Design & Build',
    desc: 'Custom full-stack development from concept to launch. High-performance front-end, secure back-end, fully responsive.',
    image: '/images/illo-design.png',
  },
  {
    num: '02',
    title: 'Search & SEO',
    desc: 'Schema markup, sitemaps, speed tuning and on-page optimization built in from day one so customers actually find you.',
    image: '/images/illo-seo.png',
  },
  {
    num: '03',
    title: 'Growth & Ads',
    desc: 'Google Ads setup and management, conversion optimization, and clear analytics reporting that ties spend to results.',
    image: '/images/illo-growth.png',
  },
]

const option1Features = [
  { text: 'Custom full-stack development, concept to launch', included: true },
  { text: 'Complete codebase ownership — transferred immediately', included: true },
  { text: 'High-performance front-end + secure back-end', included: true },
  { text: 'Fully responsive across every device', included: true },
  { text: 'Advanced SEO + Google Analytics setup', included: true },
  { text: 'One payment — no monthly fees, ever', included: true },
  { text: 'Ongoing maintenance handled for you', included: false },
  { text: 'Hosting managed on your behalf', included: false },
  { text: 'Priority support queue', included: false },
]

const option2Features = [
  { text: 'Custom website build included ($900 setup)', included: true },
  { text: 'Ongoing maintenance & updates', included: true },
  { text: 'Hosting fully managed for you', included: true },
  { text: 'Security monitoring & backups', included: true },
  { text: 'Priority support queue', included: true },
  { text: 'Basic SEO check-ins', included: true },
  { text: 'Own the code upfront (buy out for $800 later)', included: false },
  { text: 'Lowest lifetime cost', included: false },
  { text: 'Zero recurring fees', included: false },
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

const ADDON_ICONS: Record<string, typeof Sparkles> = {
  CalendarClock,
  Sparkles,
  Box,
  PenSquare,
  Languages,
  ShieldCheck,
}

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
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
      <section className="relative overflow-hidden border-b border-white/15 px-5 pb-16 pt-32 md:px-10 md:pb-24 md:pt-40">
        {/* WebGL liquid-energy field, anchored to the right */}
        <div className="absolute inset-0 z-0">
          <div className="absolute right-[-20%] top-[-10%] h-[55%] w-[110%] sm:right-[-10%] sm:top-1/2 sm:h-[150%] sm:w-[85%] sm:-translate-y-1/2 md:right-[-6%] md:w-[72%]">
            <HeroOrb />
          </div>
          {/* contrast scrims so headline stays razor-sharp */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/55 to-transparent md:via-black/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black sm:via-transparent" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1500px]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-white/60"
          >
            <span>Manny&apos;s Tech Furnish</span>
            <span className="hidden sm:block">Web Studio — Est. 2023</span>
          </motion.div>

          <h1 className="font-display text-[14vw] font-semibold uppercase leading-[0.88] tracking-tight md:text-[10.5vw] lg:text-[9.5rem]">
            <AnimatedHeading as="span" text="Websites that" className="block" />
            <span className="block">
              <AnimatedHeading
                as="span"
                text="actually"
                className="inline"
                delay={0.12}
              />{' '}
              <span className="inline-block overflow-hidden align-bottom">
                <motion.span
                  className="inline-block text-accent"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.32 }}
                >
                  convert.
                </motion.span>
              </span>
            </span>
          </h1>

          <div className="mt-12 grid items-end gap-10 border-t border-white/15 pt-10 md:grid-cols-[1.4fr_1fr]">
            <FadeUp index={1}>
              <p className="max-w-2xl text-pretty text-xl leading-snug text-white md:text-2xl">
                Premium, hand-built websites that rank on Google and turn visitors into paying
                customers. No templates. No fluff. Delivered on time.
              </p>
            </FadeUp>
            <FadeUp index={2} className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <Magnetic strength={0.35}>
                <Link
                  href="/contact"
                  className="group inline-flex w-full items-center justify-center gap-2 bg-accent px-8 py-4 text-sm font-semibold uppercase tracking-wider text-black transition-opacity hover:opacity-90 sm:w-auto"
                >
                  Start a project
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Magnetic>
              <Magnetic strength={0.35}>
                <a
                  href="#work"
                  className="inline-flex w-full items-center justify-center gap-2 border border-white/30 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black sm:w-auto"
                >
                  See the work
                </a>
              </Magnetic>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ---------------- MARQUEE ---------------- */}
      <section className="border-b border-white/15 py-5">
        <Marquee speed={26}>
          {marqueeItems.map((item, i) => (
            <span key={`${item}-${i}`} className="flex items-center">
              <span className="px-6 font-display text-2xl font-semibold uppercase tracking-tight text-white/80 md:text-4xl">
                {item}
              </span>
              <span className="text-accent">✳</span>
            </span>
          ))}
        </Marquee>
      </section>

      {/* ---------------- STATS ---------------- */}
      <section className="border-b border-white/15">
        <div className="mx-auto grid max-w-[1500px] grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <FadeUp
              key={s.label}
              index={i}
              className={`border-white/15 px-5 py-10 md:px-10 md:py-14 ${
                i < 2 ? 'border-b md:border-b-0' : ''
              } ${i % 2 === 0 ? 'border-r' : ''} ${i !== 3 ? 'md:border-r' : ''}`}
            >
              <CountUp
                value={s.value}
                className="font-display text-5xl font-semibold tracking-tight md:text-7xl"
              />
              <p className="mt-3 font-mono text-xs uppercase tracking-widest text-white/55">
                {s.label}
              </p>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ---------------- WORK ---------------- */}
      <section id="work" className="border-b border-white/15 px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <AnimatedHeading
              as="h2"
              text="Selected Work"
              className="max-w-[8ch] font-display text-5xl font-semibold uppercase leading-[0.9] tracking-tight md:text-8xl"
            />
            <p className="font-mono text-xs uppercase tracking-widest text-white/55">
              ( Case Studies )
            </p>
          </div>

          <div className="grid gap-x-12 gap-y-20 md:gap-y-28">
            {clients.map((client, i) => (
              <a
                key={client.name}
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group grid items-center gap-8 md:gap-14 lg:grid-cols-2 ${
                  i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
                }`}
              >
                {/* Visual mockup with cinematic reveal + hover zoom */}
                <ClipReveal from={i % 2 === 1 ? 'left' : 'bottom'} className="relative">
                  <Tilt max={8} className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.02]">
                    {/* accent glow behind */}
                    <div className="pointer-events-none absolute -inset-px z-0 bg-gradient-to-br from-accent/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative z-10 overflow-hidden">
                      <Image
                        src={client.image || '/placeholder.svg'}
                        alt={`${client.name} website design`}
                        width={1024}
                        height={1024}
                        className="h-auto w-full scale-105 transition-transform duration-700 ease-out will-change-transform group-hover:scale-110"
                      />
                    </div>
                    {/* view badge on hover */}
                    <div className="absolute right-4 top-4 z-20 flex translate-y-2 items-center gap-2 rounded-full bg-accent px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-black opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      Visit site
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                  </Tilt>
                </ClipReveal>

                {/* Text */}
                <FadeUp>
                  <div className="max-w-xl">
                    <div className="flex items-center gap-4">
                      <span className="font-display text-5xl font-semibold leading-none text-white/15 md:text-6xl">
                        {client.index}
                      </span>
                      <p className="font-mono text-xs uppercase tracking-widest text-accent">
                        {client.tag}
                      </p>
                    </div>
                    <h3 className="mt-5 font-display text-4xl font-semibold uppercase tracking-tight transition-transform duration-300 group-hover:translate-x-2 md:text-6xl">
                      {client.name}
                    </h3>
                    <p className="mt-4 text-lg leading-relaxed text-white/75">{client.description}</p>
                    <div className="mt-7 flex flex-col gap-3 border-t border-white/15 pt-6">
                      {client.points.map((point) => (
                        <span
                          key={point}
                          className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-white/80"
                        >
                          <span className="h-1.5 w-1.5 flex-shrink-0 bg-accent" />
                          {point}
                        </span>
                      ))}
                    </div>
                  </div>
                </FadeUp>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <Testimonials />

      {/* ---------------- SERVICES ---------------- */}
      <section id="services" className="border-b border-white/15 px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <AnimatedHeading
              as="h2"
              text="What I Do"
              className="font-display text-5xl font-semibold uppercase tracking-tight md:text-8xl"
            />
            <p className="max-w-xs font-mono text-xs uppercase tracking-widest text-white/55">
              Everything you need to launch, rank, and grow online.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {services.map((service, i) => (
              <FadeUp key={service.title} index={i}>
                <Tilt max={9} className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] transition-colors hover:border-accent/40">
                  <div className="relative aspect-[4/3] overflow-hidden border-b border-white/10">
                    <Image
                      src={service.image || '/placeholder.svg'}
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute left-5 top-4 font-display text-2xl font-semibold text-white/80">
                      {service.num}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6 md:p-8">
                    <h3 className="font-display text-2xl font-semibold uppercase tracking-tight md:text-3xl">
                      {service.title}
                    </h3>
                    <p className="mt-4 flex-1 leading-relaxed text-white/75">{service.desc}</p>
                    <ArrowRight className="mt-8 h-6 w-6 text-white/40 transition-all group-hover:translate-x-2 group-hover:text-accent" />
                  </div>
                </Tilt>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- PROCESS ---------------- */}
      <section className="relative overflow-hidden border-b border-white/15 px-5 py-20 md:px-10 md:py-28">
        <MediaBackdrop src="/images/showcase-security.png" alt="Digital security shield" intensity={0.82} />
        <div className="relative z-10 mx-auto max-w-[1500px]">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <AnimatedHeading
              as="h2"
              text="How It Works"
              className="font-display text-5xl font-semibold uppercase tracking-tight md:text-8xl"
            />
            <p className="font-mono text-xs uppercase tracking-widest text-white/55">
              ( Simple. Clear. No surprises. )
            </p>
          </div>
          <div className="grid border-t border-white/15 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <FadeUp
                key={step.num}
                index={i}
                className={`group flex flex-col border-b border-white/15 py-10 sm:border-b-0 lg:py-12 ${
                  i !== 0 ? 'lg:border-l lg:pl-8' : 'lg:pr-8'
                } ${i > 0 && i < 3 ? 'lg:px-8' : ''} ${i === 3 ? 'lg:pl-8' : ''} ${
                  i === 0 ? 'sm:border-r sm:pr-8' : ''
                } ${i === 2 ? 'sm:border-r sm:pr-8' : ''} ${i === 1 ? 'sm:pl-8' : ''} ${
                  i === 3 ? 'sm:pl-8' : ''
                }`}
              >
                <span className="font-display text-7xl font-semibold leading-none text-white/90 transition-colors group-hover:text-accent md:text-8xl">
                  {step.num}
                </span>
                <h3 className="mt-8 font-display text-2xl font-semibold uppercase tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-3 leading-relaxed text-white/75">{step.desc}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- WHY CHOOSE ME ---------------- */}
      <WhyChooseMe />

      {/* ---------------- PRICING ---------------- */}
      <section id="pricing" className="border-b border-white/15 px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-14">
            <AnimatedHeading
              as="h2"
              text="Pick Your Path"
              className="font-display text-5xl font-semibold uppercase tracking-tight md:text-8xl"
            />
            <FadeUp index={1}>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
                Two ways to work together. Same quality, same care — different commitment.
              </p>
            </FadeUp>
          </div>

          <div className="grid border-t border-white/15 lg:grid-cols-2">
            <FadeUp className="flex flex-col border-b border-white/15 py-10 lg:border-b-0 lg:border-r lg:py-12 lg:pr-12">
              <div className="flex items-center gap-3">
                <p className="font-mono text-xs uppercase tracking-widest text-accent">
                  One-time — full ownership
                </p>
                <span className="bg-accent px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-black">
                  Most Popular
                </span>
              </div>
              <h3 className="mt-5 font-display text-3xl font-semibold uppercase">Complete Digital Asset</h3>
              <div className="mt-6 font-display text-7xl font-semibold tracking-tight md:text-8xl">
                $1,899
              </div>
              <p className="mt-3 font-mono text-xs uppercase tracking-wider text-accent">
                You own it outright — no monthly fees, ever
              </p>
              <ul className="mt-8 flex-1 space-y-3">
                {option1Features.map((f) => (
                  <li
                    key={f.text}
                    className={`flex items-center gap-3 border-b border-white/10 pb-3 ${
                      f.included ? 'text-white/85' : 'text-white/35'
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                        f.included ? 'bg-accent text-black' : 'bg-white/10 text-white/40'
                      }`}
                    >
                      {f.included ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    </span>
                    <span className={f.included ? '' : 'line-through decoration-white/25'}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>
              <Magnetic strength={0.3} className="mt-10">
                <a
                  href={PAYMENT_LINKS.option1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 bg-accent px-8 py-4 text-sm font-semibold uppercase tracking-wider text-black transition-opacity hover:opacity-90"
                >
                  Pay &amp; get started <ArrowUpRight className="h-4 w-4" />
                </a>
              </Magnetic>
            </FadeUp>

            <FadeUp index={1} className="flex flex-col py-10 lg:py-12 lg:pl-12">
              <p className="font-mono text-xs uppercase tracking-widest text-white/55">
                Monthly — managed for you
              </p>
              <h3 className="mt-5 font-display text-3xl font-semibold uppercase">Managed Website Plan</h3>
              <div className="mt-6 flex items-baseline gap-3 font-display text-6xl font-semibold tracking-tight md:text-7xl">
                $900 <span className="text-3xl text-white/40">+</span>{' '}
                <span className="text-accent">$159</span>
                <span className="font-mono text-sm text-white/55">/mo</span>
              </div>
              <p className="mt-3 font-mono text-xs uppercase tracking-wider text-white/55">
                3-month minimum — from $1,377 total
              </p>
              <ul className="mt-8 flex-1 space-y-3">
                {option2Features.map((f) => (
                  <li
                    key={f.text}
                    className={`flex items-center gap-3 border-b border-white/10 pb-3 ${
                      f.included ? 'text-white/85' : 'text-white/35'
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                        f.included ? 'bg-accent text-black' : 'bg-white/10 text-white/40'
                      }`}
                    >
                      {f.included ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    </span>
                    <span className={f.included ? '' : 'line-through decoration-white/25'}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>
              <Magnetic strength={0.3} className="mt-10">
                <a
                  href={PAYMENT_LINKS.option2}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 border border-white/30 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black"
                >
                  Start this plan <ArrowUpRight className="h-4 w-4" />
                </a>
              </Magnetic>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ---------------- ADD-ONS ---------------- */}
      <section id="addons" className="border-b border-white/15 px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
                ( Premium upgrades )
              </p>
              <AnimatedHeading
                as="h2"
                text="Power-Ups"
                className="font-display text-5xl font-semibold uppercase tracking-tight md:text-8xl"
              />
            </div>
            <p className="max-w-xs font-mono text-xs uppercase tracking-widest text-white/55">
              Bolt on serious capability. Add any of these to a plan — pay in one click.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {ADD_ONS.map((addon, i) => {
              const Icon = ADDON_ICONS[addon.icon] || Sparkles
              return (
                <FadeUp key={addon.id} index={i % 3}>
                  <Tilt
                    max={8}
                    className={`group flex h-full flex-col rounded-xl border p-6 transition-colors md:p-8 ${
                      addon.featured
                        ? 'border-accent/50 bg-accent/[0.06]'
                        : 'border-white/12 bg-white/[0.02] hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${
                          addon.featured ? 'bg-accent text-black' : 'bg-white/5 text-accent'
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </span>
                      {addon.featured && (
                        <span className="bg-accent px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-black">
                          Live demo
                        </span>
                      )}
                    </div>

                    <h3 className="mt-6 font-display text-2xl font-semibold uppercase tracking-tight">
                      {addon.name}
                    </h3>
                    <p className="mt-1 font-mono text-xs uppercase tracking-wider text-accent">
                      {addon.tagline}
                    </p>
                    <p className="mt-4 leading-relaxed text-white/70">{addon.description}</p>

                    <ul className="mt-6 flex-1 space-y-2.5 border-t border-white/10 pt-6">
                      {addon.whatItDoes.map((w) => (
                        <li key={w} className="flex items-start gap-2.5 text-sm text-white/80">
                          <ArrowRight className="mt-1 h-3.5 w-3.5 flex-shrink-0 text-accent" />
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-7 flex items-end justify-between border-t border-white/10 pt-5">
                      <div>
                        <p className="font-display text-3xl font-semibold tracking-tight">
                          {addon.price}
                        </p>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-white/45">
                          {addon.cadence === 'monthly' ? 'billed monthly' : 'one-time add-on'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-2.5">
                      {addon.demoHref && (
                        <Link
                          href={addon.demoHref}
                          className="inline-flex w-full items-center justify-center gap-2 border border-accent/50 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-accent transition-colors hover:bg-accent hover:text-black"
                        >
                          See it live <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      )}
                      <a
                        href={addon.paymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex w-full items-center justify-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-opacity hover:opacity-90 ${
                          addon.featured
                            ? 'bg-accent text-black'
                            : 'border border-white/25 text-white hover:bg-white hover:text-black'
                        }`}
                      >
                        Add this upgrade <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </Tilt>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <FAQ />

      {/* ---------------- CTA ---------------- */}
      <section className="overflow-hidden border-b border-white/15 px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1500px]">
          <FadeUp>
            <p className="mb-8 font-mono text-xs uppercase tracking-[0.2em] text-accent">
              ( Let&apos;s build something )
            </p>
          </FadeUp>
          <h2 className="font-display text-[12vw] font-semibold uppercase leading-[0.9] tracking-tight md:text-[8rem]">
            <AnimatedHeading as="span" text="Ready to get" className="block" />
            <span className="block">
              <AnimatedHeading as="span" text="more" className="inline" delay={0.1} />{' '}
              <span className="inline-block overflow-hidden align-bottom">
                <motion.span
                  className="inline-block text-accent"
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
            <p className="font-mono text-xs uppercase tracking-widest text-white/80">
              Currently accepting 2 new clients this month
            </p>
          </FadeUp>
          <FadeUp index={2} className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Magnetic strength={0.35}>
              <Link
                href="/contact"
                className="group inline-flex w-full items-center justify-center gap-2 bg-accent px-10 py-5 text-sm font-semibold uppercase tracking-wider text-black transition-opacity hover:opacity-90 sm:w-auto"
              >
                Start your project
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Magnetic>
            <Magnetic strength={0.35}>
              <a
                href="mailto:mansoor.buspro@gmail.com"
                className="inline-flex w-full items-center justify-center gap-2 border border-white/30 px-10 py-5 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black sm:w-auto"
              >
                mansoor.buspro@gmail.com
              </a>
            </Magnetic>
          </FadeUp>
          <FadeUp index={3} className="mt-6">
            <p className="font-mono text-xs uppercase tracking-widest text-white/60">
              Or call / text{' '}
              <span className="text-white">(925) 278-9059</span>
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="overflow-hidden px-5 pb-8 pt-16 md:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-wrap items-end justify-between gap-8 border-b border-white/15 pb-12">
            <div className="font-mono text-xs uppercase tracking-widest text-white/55">
              <p className="mb-3 text-white">Contact</p>
              <a href="mailto:mansoor.buspro@gmail.com" className="hover:text-accent">
                mansoor.buspro@gmail.com
              </a>
              <p className="mt-2">(925) 278-9059</p>
            </div>
            <div className="flex gap-10 font-mono text-xs uppercase tracking-widest text-white/55">
              <a href="#work" className="hover:text-white">
                Work
              </a>
              <a href="#services" className="hover:text-white">
                Services
              </a>
              <a href="#pricing" className="hover:text-white">
                Pricing
              </a>
              <a href="#addons" className="hover:text-white">
                Add-ons
              </a>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </div>
          </div>
          <Parallax distance={40}>
            <p className="mt-8 font-display text-[14vw] font-semibold uppercase leading-[0.85] tracking-tight text-white md:text-[10rem]">
              Manny&apos;s
            </p>
          </Parallax>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 font-mono text-xs uppercase tracking-wider text-white/45">
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
