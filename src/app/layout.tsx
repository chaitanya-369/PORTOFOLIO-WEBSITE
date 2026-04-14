import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Space_Grotesk } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { PageTransitionWrapper } from '@/components/layout/PageTransitionWrapper'

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
    default: 'Chaitanya Sangana | ECE Portfolio',
    template: '%s | Chaitanya Sangana',
  },
  description: 'Chaitanya Sangana — Hardware Engineer & ECE Portfolio. Interactive 3D hardware showcase.',
  keywords: ['ECE', 'hardware engineering', 'VLSI', 'robotics', 'embedded systems', 'PCB design'],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Chaitanya Sangana | ECE Portfolio',
    description: 'Chaitanya Sangana — Hardware Engineer & ECE Portfolio',
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
      <body suppressHydrationWarning className={`${inter.className} bg-obsidian-950 text-white-pure antialiased`}>
        <Navbar />
        {/* PageTransitionWrapper is 'use client' — thin boundary for AnimatePresence */}
        <PageTransitionWrapper>
          {children}
        </PageTransitionWrapper>
        <footer className="w-full py-6 text-center border-t border-obsidian-800/50 bg-obsidian-950 relative z-10">
          <p className="font-mono text-white-muted text-[10px] tracking-widest uppercase">
            &copy; {new Date().getFullYear()} Chaitanya Sangana. All Rights Reserved.
          </p>
        </footer>
      </body>
    </html>
  )
}

export default RootLayout
