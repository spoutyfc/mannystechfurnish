// Crawls the marketing routes on a running server and checks every link.
// Usage: node scripts/check-links.mjs [baseUrl]
const BASE = process.argv[2] ?? 'http://localhost:3110'
const START = ['/', '/engineering-construction', '/work', '/growth-partner', '/process', '/about', '/contact', '/privacy', '/accessibility', '/sitemap.xml', '/robots.txt', '/opengraph-image']

const seen = new Map()
const internal = new Set(START)
const external = new Set()

for (const path of START) {
  const res = await fetch(BASE + path, { redirect: 'manual' })
  seen.set(path, res.status)
  if (!(res.headers.get('content-type') ?? '').includes('text/html')) continue
  const html = await res.text()
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (href.startsWith('/_next') || href.startsWith('mailto:') || href.startsWith('tel:')) continue
    if (href.startsWith('http')) external.add(href.replace(/&amp;/g, '&'))
    else if (href.startsWith('/')) internal.add(href.split('#')[0] || '/')
  }
}

const failures = []
for (const path of internal) {
  if (!seen.has(path)) seen.set(path, (await fetch(BASE + path, { redirect: 'manual' })).status)
  const s = seen.get(path)
  if (s >= 400) failures.push(`${s} ${path}`)
}
for (const url of external) {
  try {
    const res = await fetch(url, { method: 'GET', redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 link-check' } })
    if (res.status >= 400) failures.push(`${res.status} ${url}`)
  } catch (e) {
    failures.push(`ERR ${url} ${e.message}`)
  }
}
console.log(`internal ${internal.size}, external ${external.size}, failures ${failures.length}`)
for (const f of failures) console.log(f)
process.exitCode = failures.length ? 1 : 0
