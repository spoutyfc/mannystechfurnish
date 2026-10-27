import { SiteFooter } from '@/components/site-aec/footer'
import { SiteHeader } from '@/components/site-aec/header'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-accent focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </div>
  )
}
