import type { Metadata } from 'next'
import { LinksPageClient } from '@/components/links/LinksPageClient'

// ─── METADATA ────────────────────────────────────────────────────────────────
// Server Component — metadata export works here.
// The animated client UI is delegated to LinksPageClient.

export const metadata: Metadata = {
  title: 'Links',
  description:
    'Connect with Chaitanya Sangana — ECE Engineer. GitHub, LinkedIn, YouTube, and portfolio links.',
  openGraph: {
    title: 'Chaitanya Sangana — Links',
    description: 'ECE Engineer · Hardware & Software Builder',
    type: 'profile',
  },
}

const LinksPage: React.FC = () => {
  return <LinksPageClient />
}

export default LinksPage
