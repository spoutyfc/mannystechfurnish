/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server bundle for the Docker image (see Dockerfile).
  // Vercel ignores this setting and deploys as usual.
  output: 'standalone',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
