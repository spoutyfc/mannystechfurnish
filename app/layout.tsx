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
  title: "Manny's Tech Furnish | Professional Websites for Growing Businesses",
  description: 'Custom website design and development for businesses that want to stand out online. SEO optimization, Google Ads ready, clear communication, on-time delivery.',
  keywords: ['web design', 'website development', 'SEO', 'small business websites', 'landing pages', 'custom websites'],
  authors: [{ name: 'Mansoor Arif' }],
  creator: 'Manny\'s Tech Furnish',
  openGraph: {
    title: 'Manny\'s Tech Furnish | Professional Websites for Growing Businesses',
    description: 'Custom website design and development with SEO optimization. Clear communication, on-time delivery, real results.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Manny\'s Tech Furnish',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manny\'s Tech Furnish | Professional Websites',
    description: 'Custom website design and development with SEO optimization.',
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
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
