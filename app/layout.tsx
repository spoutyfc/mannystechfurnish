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
  title: "Manny's Tech Furnish | Professional Websites for Growing Businesses",
  description: 'Custom website design and development for businesses that want to stand out online. SEO optimization, Google Ads ready, clear communication, on-time delivery.',
  keywords: ['web design', 'website development', 'SEO', 'small business websites', 'landing pages', 'custom websites'],
  authors: [{ name: 'Mansoor Arif' }],
  creator: 'Manny\'s Tech Furnish',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Manny\'s Tech Furnish | Professional Websites for Growing Businesses',
    description: 'Custom website design and development with SEO optimization. Clear communication, on-time delivery, real results.',
    url: 'https://mannystechfurnish.com',
    type: 'website',
    locale: 'en_US',
    siteName: 'Manny\'s Tech Furnish',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Manny\'s Tech Furnish — Websites that actually convert',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manny\'s Tech Furnish | Professional Websites',
    description: 'Custom website design and development with SEO optimization.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
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
