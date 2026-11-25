import type { Metadata } from 'next'
import { Archivo, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
})
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://mannystechfurnish.com'),
  title: {
    default: "Manny's Tech Furnish | Custom Website Design & Development",
    template: "%s | Manny's Tech Furnish",
  },
  description:
    'Custom website design and development for growing businesses worldwide. Fast, SEO-optimized, conversion-focused websites — with Google Ads setup, clear communication, and on-time delivery. Serving clients in the US and internationally.',
  keywords: [
    // Core service
    'web design',
    'website development',
    'custom website design',
    'web developer',
    'freelance web developer',
    'website designer',
    'full-stack developer',
    'Next.js developer',
    'React developer',
    // Intent + outcome
    'affordable website design',
    'small business websites',
    'business website design',
    'landing page design',
    'ecommerce website development',
    'website redesign',
    'SEO optimization',
    'local SEO',
    'Google Ads management',
    'conversion optimization',
    // Local (US / Bay Area)
    'web design USA',
    'web design Bay Area',
    'web design California',
    'web designer near me',
    'Oakland web design',
    'San Francisco web design',
    // International
    'web design agency',
    'hire a web developer online',
    'remote web developer',
    'international web design services',
  ],
  authors: [{ name: 'Mansoor Arif', url: 'https://mannystechfurnish.com' }],
  creator: "Manny's Tech Furnish",
  publisher: "Manny's Tech Furnish",
  applicationName: "Manny's Tech Furnish",
  category: 'technology',
  formatDetection: { email: false, telephone: false, address: false },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
      'x-default': '/',
    },
  },
  openGraph: {
    title: "Manny's Tech Furnish | Custom Website Design & Development",
    description:
      'Fast, SEO-optimized, conversion-focused websites for growing businesses — anywhere in the world. Clear communication, on-time delivery, real results.',
    url: 'https://mannystechfurnish.com',
    type: 'website',
    locale: 'en_US',
    siteName: "Manny's Tech Furnish",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: "Manny's Tech Furnish — Websites that actually convert",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Manny's Tech Furnish | Custom Website Design & Development",
    description: 'Fast, SEO-optimized, conversion-focused websites for growing businesses worldwide.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  generator: 'v0.app',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark bg-black ${archivo.variable} ${inter.variable}`}>
      <body className="bg-black font-sans text-neutral-50 antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
