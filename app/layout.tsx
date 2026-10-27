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

const DESCRIPTION =
  'Website and local search partner for Bay Area structural, geotechnical, civil, surveying and design-build firms. One fixed monthly fee.'

export const metadata: Metadata = {
  metadataBase: new URL('https://mannystechfurnish.com'),
  title: {
    default: "Websites for Engineering & Construction Firms | Manny's Tech Furnish",
    template: "%s | Manny's Tech Furnish",
  },
  description: DESCRIPTION,
  authors: [{ name: 'Mansoor Arif' }],
  creator: "Manny's Tech Furnish",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Websites for Engineering & Construction Firms | Manny's Tech Furnish",
    description: DESCRIPTION,
    url: 'https://mannystechfurnish.com',
    type: 'website',
    locale: 'en_US',
    siteName: "Manny's Tech Furnish",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Websites for Engineering & Construction Firms | Manny's Tech Furnish",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
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
    <html
      lang="en"
      className={`dark bg-black ${archivo.variable} ${inter.variable}`}
    >
      <body className="bg-black font-sans text-neutral-50 antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
