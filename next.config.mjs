import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'

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
    // Faster resolution + better tree-shaking for heavy packages
    optimizePackageImports: ['framer-motion', '@react-three/drei', 'three', 'mermaid'],
  },
}

const withMDX = createMDX()

export default withMDX(nextConfig)
