import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable MDX file extensions in the App Router
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  // React strict mode — mandatory per the blueprint
  reactStrictMode: true,

  // Compiler optimizations
  compiler: {
    // Remove console.log in production builds
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Image optimization — allow local and future CDN domains
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },

  // Experimental features for App Router performance
  experimental: {
    // Optimizes CSS loading
    optimizeCss: true,
  },
}

const withMDX = createMDX()

export default withMDX(nextConfig)
