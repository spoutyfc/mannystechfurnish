// Single source of truth for FAQ content. Used by both the visible FAQ
// accordion (components/site/faq.tsx) and the FAQPage JSON-LD schema on the
// homepage, so the two never drift apart (a Google rich-result requirement).
export const FAQ_ITEMS = [
  {
    q: 'How long does a website take?',
    a: 'Most projects ship in 2–4 weeks depending on scope. After our consultation I give you a clear timeline, and you get weekly updates the whole way through so you always know where things stand.',
  },
  {
    q: 'Do I own the code?',
    a: 'Yes. With the one-time package the full codebase is transferred to you immediately — no platform lock-in, no hostage situations. On the monthly plan you can buy out the code at the end of the term.',
  },
  {
    q: 'What if I need changes later?',
    a: "You've got options. You can handle updates yourself since you own the code, or grab the optional care plan (from $70/mo) where I handle updates, security, and tweaks for you.",
  },
  {
    q: 'Do you do ongoing SEO?',
    a: 'Every site ships with strong SEO foundations built in — schema markup, sitemaps, speed tuning, and on-page optimization. For ongoing SEO and content work, I offer monthly retainers we can scope to your goals.',
  },
  {
    q: 'How do payments work?',
    a: 'Simple and secure through Stripe. The one-time package is a single payment; the managed plan is a setup fee plus monthly. I send you a private payment link once we agree on scope — no hidden fees, ever.',
  },
  {
    q: 'Do you work with clients outside the US?',
    a: 'Absolutely. I work with businesses around the world. Everything runs remotely over email and video calls, payments are handled securely through Stripe in your currency where supported, and I schedule calls around your time zone.',
  },
] as const
