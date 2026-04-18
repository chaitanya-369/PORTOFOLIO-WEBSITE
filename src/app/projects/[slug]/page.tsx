import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { allProjects } from '@/core/data/all-projects'
import { CaseStudyClient } from '@/components/projects/CaseStudyClient'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'
import fs from 'fs'
import path from 'path'
import { Mermaid } from '@/components/mdx/Mermaid'
import { ProjectCockpit } from '@/components/projects/ProjectCockpit'


// ─── STATIC PARAMS ───────────────────────────────────────────────────────────
// Pre-renders only slugs that have actual MDX content files.
// Projects without content redirect to 404.

const SLUGS_WITH_CONTENT = ['api-saviour', 'org-memory'] as const

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

async function loadCaseStudy(slug: string): Promise<string | null> {
  const filePath = path.join(process.cwd(), 'src/content/projects', `${slug}.mdx`)
  if (fs.existsSync(filePath)) {
    return fs.promises.readFile(filePath, 'utf8')
  }
  return null
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

const ProjectPage = async ({ params }: ProjectPageProps): Promise<React.ReactElement> => {
  const { slug } = await params
  const project = allProjects.find((p) => p.id === slug)

  if (!project) notFound()

  const source = await loadCaseStudy(slug)
  if (!source) notFound()

  // ─── MDX SECTION SPLITTING ────────────────────────────────────────────────
  // We split the MDX source by H2/H3 headings to create discrete "branches".
  // This allows the Cockpit UI to switch between logical chunks of information.
  
  const sections: Array<{ id: string; label: string; raw: string }> = []
  
  // Basic split logic: look for ## or ### headings
  const parts = source.split(/(?=^#{2,3}\s)/m)
  
  // The first part might be lead-in text (Overview)
  if (parts.length > 0 && !parts[0].startsWith('#')) {
    sections.push({ id: 'overview', label: 'Overview', raw: parts[0] })
    parts.shift()
  }

  // Map the rest to logical branches
  parts.forEach((part, index) => {
    const headingMatch = part.match(/^#{2,3}\s+(.+)$/m)
    const title = headingMatch ? headingMatch[1].trim() : `Section ${index + 1}`
    
    // Group them into semantic IDs
    let id = title.toLowerCase().replace(/[^\w]/g, '-')
    let label = title

    // Consolidate categories
    const lowerLabel = label.toLowerCase()
    if (lowerLabel.includes('architecture') || lowerLabel.includes('lifecycle') || lowerLabel.includes('landscape') || lowerLabel.includes('diagram')) {
      id = 'architecture'
      label = 'Architecture'
    } else if (
      lowerLabel.includes('engineering') || 
      lowerLabel.includes('technical') || 
      lowerLabel.includes('protocol') || 
      lowerLabel.includes('implementation') || 
      lowerLabel.includes('security') ||
      lowerLabel.includes('decisions')
    ) {
      id = 'engineering'
      label = 'Engineering'
    } else if (lowerLabel.includes('outcome') || lowerLabel.includes('impact') || lowerLabel.includes('results') || lowerLabel.includes('scale')) {
      id = 'outcomes'
      label = 'Outcomes'
    }


    // Merge content if ID already exists
    const existing = sections.find(s => s.id === id)
    if (existing) {
      existing.raw += `\n\n${part}`
    } else {
      sections.push({ id, label, raw: part })
    }
  })

  // ─── MDX COMPONENTS ───────────────────────────────────────────────────────
  
  const mdxComponents = {
    pre: (props: any) => {
      const codeComponent = props.children
      const language = codeComponent?.props?.['data-language'] || codeComponent?.props?.className || ''
      
      if (language.includes('mermaid')) {
        let chart = ''
        const extractText = (node: any): string => {
          if (typeof node === 'string') return node
          if (Array.isArray(node)) return node.map(extractText).join('')
          if (node?.props?.children) return extractText(node.props.children)
          return ''
        }
        chart = extractText(codeComponent?.props?.children)
        if (chart) return <Mermaid chart={chart} />
      }
      return <pre {...props} />
    }
  }

  const mdxOptions = {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [[rehypePrettyCode, { theme: 'github-dark-dimmed', keepBackground: false }]],
    }
  }

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

      {/* ── COCKPIT HEADER ────────────────────────────────────────────────── */}
      <header className="max-w-4xl mx-auto px-8 mb-8 text-center sm:text-left">
        <p className="font-mono text-cobalt-glow text-xs tracking-widest uppercase mb-4">
          {project.categoryLabel}
        </p>
        <h1 className="font-display text-h1 text-white-pure tracking-tight leading-tight mb-4">
          {project.title}
        </h1>
        <p className="font-body text-white-muted text-base leading-relaxed max-w-2xl mx-auto sm:mx-0">
          {project.blurb}
        </p>
      </header>

      {/* ── BRANCHING PROJECT COCKPIT ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-8">
        <ProjectCockpit 
          title={project.id === 'api-saviour' ? 'API SAVIOUR' : project.title}
          sections={sections.map(section => ({
            id: section.id,
            label: section.label,
            content: (
              <MDXRemote 
                source={section.raw} 
                components={mdxComponents}
                options={mdxOptions}
              />
            )
          }))}
        />
      </div>
    </main>
  )
}


export default ProjectPage
