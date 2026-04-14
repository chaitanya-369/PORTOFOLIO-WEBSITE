import type { Metadata } from 'next'
import { ProjectsCatalogue } from '@/components/projects/ProjectsCatalogue'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'All engineering projects by Chaitanya Sangana — hardware PCBs, VLSI chips, AI gateways, and infrastructure systems.',
}

const ProjectsIndexPage: React.FC = () => {
  return (
    <main className="bg-obsidian-950 pt-22">
      <ProjectsCatalogue />
    </main>
  )
}

export default ProjectsIndexPage

