import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site-content'

// Bump when page content changes materially; a per-request date would tell
// search engines every page changes on every crawl.
const LAST_MODIFIED = new Date('2026-10-27')

const ROUTES: { path: string; priority: number }[] = [
  { path: '/', priority: 1 },
  { path: '/growth-partner', priority: 0.9 },
  { path: '/engineering-construction', priority: 0.8 },
  { path: '/work', priority: 0.8 },
  { path: '/process', priority: 0.6 },
  { path: '/about', priority: 0.6 },
  { path: '/contact', priority: 0.7 },
  { path: '/privacy', priority: 0.2 },
  { path: '/accessibility', priority: 0.2 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path === '/' ? '/' : r.path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'monthly',
    priority: r.priority,
  }))
}
