/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server bundle for the Docker image (see Dockerfile).
  // Vercel ignores this setting and deploys as usual.
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  // Old URLs from earlier versions of the site. Permanent redirects keep links
  // and search results working.
  async redirects() {
    return [
      { source: '/services', destination: '/growth-partner', permanent: true },
      { source: '/pricing', destination: '/growth-partner', permanent: true },
      { source: '/portfolio', destination: '/work', permanent: true },
    ]
  },
}

export default nextConfig
