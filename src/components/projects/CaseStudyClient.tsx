'use client'

/**
 * CaseStudyClient — MDX Prose Wrapper
 *
 * Applies premium typographic styles to MDX content.
 * Also handles the scroll-reveal entrance animation for the article body.
 *
 * Separation: the page shell ([slug]/page.tsx) is a Server Component
 * that loads MDX and metadata. This thin 'use client' wrapper owns
 * only the entrance animation and prose CSS — Law 5 compliant.
 */

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface CaseStudyClientProps {
  readonly children: ReactNode
}

const SPRING = { type: 'spring', stiffness: 200, damping: 26, mass: 1.5 } as const

export const CaseStudyClient: React.FC<CaseStudyClientProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING, delay: 0.12 }}
    >
      {/*
        Prose container — custom Tailwind classes for MDX content.
        Target: editorial-quality typesetting that feels like a Stripe engineering post.
      */}
      <article
        className="
          max-w-4xl mx-auto px-8
          prose prose-invert
          prose-headings:font-display prose-headings:tracking-tight prose-headings:text-white-pure
          prose-h2:text-h2 prose-h2:mt-16 prose-h2:mb-6
          prose-h3:text-h3 prose-h3:mt-10 prose-h3:mb-4
          prose-p:font-body prose-p:text-white-muted prose-p:leading-relaxed prose-p:text-base
          prose-a:text-cobalt-glow prose-a:no-underline hover:prose-a:underline
          prose-strong:text-white-pure prose-strong:font-semibold
          prose-code:font-mono prose-code:text-cobalt-glow prose-code:bg-obsidian-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:rounded-none
          prose-pre:bg-obsidian-900 prose-pre:border prose-pre:border-obsidian-800 prose-pre:rounded-none
          prose-blockquote:border-l-cobalt-accent prose-blockquote:border-l-2 prose-blockquote:pl-6 prose-blockquote:text-white-muted prose-blockquote:not-italic
          prose-hr:border-obsidian-800
          prose-li:text-white-muted
          prose-ul:list-none prose-ul:pl-0
          prose-ol:pl-4
          max-w-none
        "
      >
        {children}
      </article>
    </motion.div>
  )
}
