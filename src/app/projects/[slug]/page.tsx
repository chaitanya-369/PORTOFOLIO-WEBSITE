import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { allProjects } from '@/core/data/all-projects'
import { CaseStudyClient } from '@/components/projects/CaseStudyClient'

// ─── STATIC PARAMS ───────────────────────────────────────────────────────────
// Pre-renders only slugs that have actual MDX content files.
// Projects without content redirect to 404.

const SLUGS_WITH_CONTENT = ['api-saviour', 'org-memory'] as const
type KnownSlug = typeof SLUGS_WITH_CONTENT[number]

export function generateStaticParams(): Array<{ slug: string }> {
  return SLUGS_WITH_CONTENT.map((slug) => ({ slug }))
}

// ─── METADATA ────────────────────────────────────────────────────────────────

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = allProjects.find((p) => p.id === slug)

  if (!project) {
    return { title: 'Project Not Found' }
  }

  return {
    title: project.title,
    description: project.blurb,
    openGraph: {
      title: `${project.title} | Chaitanya Sangana`,
      description: project.blurb,
      type: 'article',
    },
  }
}

// ─── DYNAMIC MDX LOADER ──────────────────────────────────────────────────────

const MDX_COMPONENTS: Record<string, () => Promise<{ default: React.FC }>> = {
  'api-saviour': () => import('@/content/projects/api-saviour.mdx'),
  'org-memory': () => import('@/content/projects/org-memory.mdx'),
}

async function loadCaseStudy(slug: string): Promise<React.FC | null> {
  if (slug in MDX_COMPONENTS) {
    try {
      const mod = await MDX_COMPONENTS[slug]()
      return mod.default
    } catch (err) {
      console.error(`Failed to load MDX for ${slug}`, err)
      return null
    }
  }
  return null
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

const ProjectPage = async ({ params }: ProjectPageProps): Promise<React.ReactElement> => {
  const { slug } = await params
  const project = allProjects.find((p) => p.id === slug)

  if (!project) notFound()

  const MDXContent = await loadCaseStudy(slug)
  if (!MDXContent) notFound()

  return (
    <main className="bg-obsidian-950 pt-22 pb-24">
      {/* ── BACK NAVIGATION ───────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-8 mb-12">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-white-faint hover:text-cobalt-glow transition-colors focus-visible:outline-none focus-visible:text-cobalt-glow"
        >
          <span aria-hidden="true">←</span> All Projects
        </Link>
      </div>

      {/* ── CASE STUDY HEADER ─────────────────────────────────────────────── */}
      <header className="max-w-4xl mx-auto px-8 mb-16">
        {/* Category */}
        <p className="font-mono text-cobalt-glow text-xs tracking-widest uppercase mb-4">
          {project.categoryLabel}
        </p>

        {/* Title */}
        <h1 className="font-display text-h1 text-white-pure tracking-tight leading-tight mb-6">
          {project.title}
        </h1>

        {/* Blurb */}
        <p className="font-body text-white-muted text-lg leading-relaxed max-w-2xl mb-8">
          {project.blurb}
        </p>

        {/* Meta bar */}
        <div className="flex flex-wrap gap-x-8 gap-y-3 pt-6 border-t border-obsidian-800">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[9px] tracking-widest uppercase text-white-faint">Year</span>
            <span className="font-mono text-sm text-white-pure">{project.year}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[9px] tracking-widest uppercase text-white-faint">Domain</span>
            <span className="font-mono text-sm text-white-pure capitalize">{project.domain}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[9px] tracking-widest uppercase text-white-faint">Stack</span>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span key={tag} className="font-mono text-[10px] text-cobalt-glow border border-cobalt-accent/30 bg-cobalt-accent/5 px-2 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── MDX CONTENT ───────────────────────────────────────────────────── */}
      <CaseStudyClient>
        <MDXContent />
      </CaseStudyClient>
    </main>
  )
}

export default ProjectPage
