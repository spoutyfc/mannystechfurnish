/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server bundle for the Docker image (see Dockerfile).
  // Vercel ignores this setting and deploys as usual.
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  // These standalone pages were folded into sections of the home page.
  // Permanent redirects keep any old links and search results working.
  async redirects() {
    return [
      { source: '/services', destination: '/#services', permanent: true },
      { source: '/portfolio', destination: '/#work', permanent: true },
    ]
  },
}

export default nextConfig
