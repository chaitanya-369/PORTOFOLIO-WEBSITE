import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Space_Grotesk } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

// Font definitions — loaded via next/font for zero layout shift
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'ECE Portfolio',
    template: '%s | ECE Portfolio',
  },
  description: 'Hardware Engineer & ECE Portfolio — Interactive 3D hardware showcase.',
  keywords: ['ECE', 'hardware engineering', 'VLSI', 'robotics', 'embedded systems', 'PCB design'],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'ECE Portfolio',
    description: 'Hardware Engineer & ECE Portfolio',
  },
}

export const viewport: Viewport = {
  themeColor: '#0A0A0B',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

interface RootLayoutProps {
  children: React.ReactNode
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${GeistMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className={`${inter.className} bg-obsidian-950 text-white-pure antialiased`}>
        {children}
      </body>
    </html>
  )
}

export default RootLayout
