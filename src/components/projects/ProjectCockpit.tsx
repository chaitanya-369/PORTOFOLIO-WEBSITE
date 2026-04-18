'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BranchingNav } from './BranchingNav'
import { CaseStudyClient } from './CaseStudyClient'
import React from 'react'

/**
 * ProjectCockpit — The stateful orchestrator
 * 
 * Handles switching between branches and provides the 
 * smooth content transition logic.
 */

interface BranchSection {
  id: string
  label: string
  content: React.ReactNode
}

interface ProjectCockpitProps {
  title: string
  sections: BranchSection[]
}

export const ProjectCockpit: React.FC<ProjectCockpitProps> = ({ title, sections }) => {
  const [activeBranchId, setActiveBranchId] = useState(sections[0]?.id || '')

  const branches = sections.map(s => ({ id: s.id, label: s.label }))
  const activeSection = sections.find(s => s.id === activeBranchId)

  return (
    <div className="flex flex-col w-full">
      {/* ── INTERACTIVE NAV ──────────────────────────────────────────────── */}
      <BranchingNav 
        title={title}
        branches={branches}
        activeBranch={activeBranchId}
        onBranchChange={setActiveBranchId}
      />

      {/* ── CONTENT AREA ─────────────────────────────────────────────────── */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBranchId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <CaseStudyClient>
              {activeSection?.content}
            </CaseStudyClient>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
