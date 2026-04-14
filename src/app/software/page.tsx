import type { Metadata } from 'next'
import { SoftwareGallery } from '@/components/software/SoftwareGallery'

export const metadata: Metadata = {
  title: 'Software',
  description:
    'Software systems by Chaitanya Sangana — AI gateways, memory infrastructure, and production-grade TypeScript applications.',
}

const SoftwarePage: React.FC = () => {
  return (
    <main className="bg-obsidian-950 pt-22">
      <SoftwareGallery />
    </main>
  )
}

export default SoftwarePage
