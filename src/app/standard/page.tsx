import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'
import fs from 'fs'
import path from 'path'
import { Mermaid } from '@/components/mdx/Mermaid'
import { ProjectCockpit } from '@/components/projects/ProjectCockpit'

// ─── METADATA ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Engineering Standard',
  description: 'The technical philosophy and architecture standards of Chaitanya Sangana.',
  openGraph: {
    title: 'Engineering Standard | Chaitanya Sangana',
    description: 'System-first approach to scalable software engineering.',
    type: 'article',
  },
}

// ─── DYNAMIC MDX LOADER ──────────────────────────────────────────────────────

async function loadStandard(): Promise<string | null> {
  const filePath = path.join(process.cwd(), 'src/content/docs/engineering-standard.mdx')
  if (fs.existsSync(filePath)) {
    return fs.promises.readFile(filePath, 'utf8')
  }
  return null
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

const StandardPage = async (): Promise<React.ReactElement> => {
  const fullSource = await loadStandard()
  if (!fullSource) notFound()

  // ─── STRIP FRONTMATTER ───────────────────────────────────────────────────
  // next-mdx-remote/rsc doesn't strip yaml frontmatter by default.
  const source = fullSource.replace(/^---[\s\S]*?---/, '').trim()

  // ─── MDX SECTION SPLITTING ────────────────────────────────────────────────
  const sections: Array<{ id: string; label: string; raw: string }> = []
  
  // Split ONLY on ## headings (H2) to prevent excessive branching
  const parts = source.split(/(?=^##\s)/m)
  
  // First part is Overview
  if (parts.length > 0 && !parts[0].startsWith('##')) {
    sections.push({ id: 'overview', label: 'Overview', raw: parts[0] })
    parts.shift()
  }

  // Map and Consolidate branches
  parts.forEach((part) => {
    const headingMatch = part.match(/^##\s+(.+)$/m)
    if (!headingMatch) return

    const title = headingMatch[1].trim()
    let id = title.toLowerCase().replace(/[^\w]/g, '-')
    let label = title

    // Standardize labels for the UI
    if (label.includes('Philosophy')) { id = 'philosophy'; label = 'Philosophy' }
    else if (label.includes('Infrastructure')) { id = 'infrastructure'; label = 'Infrastructure' }
    else if (label.includes('Stack')) { id = 'stack'; label = 'Stack' }
    else if (label.includes('Interface')) { id = 'interface'; label = 'Interface' }
    else if (label.includes('Security') || label.includes('Systems')) { id = 'systems'; label = 'Systems' }

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
    <main className="bg-obsidian-950 pt-22 pb-24 min-h-screen">
      {/* ── BREADCRUMB ────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-8 mb-12">
        <nav className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-white-faint">
          <Link href="/" className="hover:text-white-pure transition-colors">Core</Link>
          <span aria-hidden="true" className="text-white-faint/30">/</span>
          <span className="text-cobalt-glow">Standard</span>
        </nav>
      </div>

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <header className="max-w-4xl mx-auto px-8 mb-16">
        <div className="inline-flex items-center gap-3 px-3 py-1 bg-cobalt-glow/10 border border-cobalt-glow/20 rounded-full mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-cobalt-glow animate-pulse" />
          <span className="font-mono text-[10px] tracking-widest uppercase text-cobalt-glow">Integrated Logic // v2026.1</span>
        </div>
        <h1 className="font-display text-h1 text-white-pure tracking-tight leading-tight mb-6 uppercase">
          Engineering <br />
          <span className="text-cobalt-glow">Standard</span>
        </h1>
        <p className="font-body text-white-muted text-lg leading-relaxed max-w-2xl">
          A definitive manifest for high-performance, type-safe, and deterministic systems design. This is how I architect software at scale.
        </p>
      </header>

      {/* ── COCKPIT ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-8">
        <ProjectCockpit 
          title="TECHNICAL // STANDARD"
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

export default StandardPage
