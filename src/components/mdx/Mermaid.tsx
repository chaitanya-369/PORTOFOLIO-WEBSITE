'use client'

import React, { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

/**
 * Mermaid — Client-side SVG Generator for Diagrams
 *
 * This component takes a Mermaid DSL string and renders it as an SVG.
 * It uses a unique ID to manage the rendering lifecycle and handle
 * React 19's hydration/rendering nuances.
 */

interface MermaidProps {
  readonly chart: string
}

// Initialize Mermaid with a premium dark theme to match the portfolio
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    fontFamily: 'var(--font-geist-mono)',
    primaryColor: '#0055FF',
    primaryTextColor: '#fff',
    primaryBorderColor: '#0055FF',
    lineColor: '#52525B',
    secondaryColor: '#27272A',
    tertiaryColor: '#18181B',
  },
  securityLevel: 'loose',
})

export const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  
  // Use a stable ID for the diagram to prevent re-render flickering
  const id = useRef(`mermaid-${Math.random().toString(36).substring(2, 9)}`)

  useEffect(() => {
    let isMounted = true

    const renderChart = async () => {
      if (!chart.trim()) return

      try {
        setError(null)
        
        // Render the diagram to SVG string
        const { svg: renderedSvg } = await mermaid.render(id.current, chart)
        
        if (isMounted) {
          setSvg(renderedSvg)
        }
      } catch (err) {
        if (isMounted) {
          console.error('Mermaid rendering failed:', err)
          setError('Failed to render architecture diagram.')
        }
      }
    }

    renderChart()

    return () => {
      isMounted = false
    }
  }, [chart])

  return (
    <div className="mermaid-container my-12 flex flex-col items-center">
      {error ? (
        <div className="text-red-400 font-mono text-xs border border-red-900/50 bg-red-900/10 p-4 w-full">
          {error}
        </div>
      ) : (
        <div 
          ref={containerRef}
          className="w-full overflow-x-auto selection:bg-transparent"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
      
      {/* Hidden div used for initial mermaid parsing if needed */}
      <div id={id.current} className="hidden" />
    </div>
  )
}
