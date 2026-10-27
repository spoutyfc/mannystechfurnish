import type { Metadata } from 'next'

// The booking demo belonged to the retired add-on menu. It stays reachable for
// existing links but is kept out of search results.
export const metadata: Metadata = {
  title: 'Booking demo',
  robots: { index: false, follow: false },
}

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children
}
