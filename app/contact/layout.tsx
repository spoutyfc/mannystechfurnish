import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | Manny\'s Tech Furnish',
  description: 'Get in touch about your website project. Free consultation, clear proposals, and a reply within 24-48 hours.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact | Manny\'s Tech Furnish',
    description: 'Get in touch about your website project. Free consultation and a reply within 24-48 hours.',
    url: 'https://mannystechfurnish.com/contact',
    type: 'website',
    siteName: 'Manny\'s Tech Furnish',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Manny\'s Tech Furnish' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | Manny\'s Tech Furnish',
    description: 'Get in touch about your website project.',
    images: ['/og-image.png'],
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
