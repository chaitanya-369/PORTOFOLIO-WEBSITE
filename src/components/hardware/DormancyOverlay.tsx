'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/core/store'
import Image from 'next/image'

/**
 * DormancyOverlay — Human + AI Hybrid Logic
 * A high-fidelity interface reflecting the transition from
 * pure software orchestration to ECE 2026 hardware synthesis.
 */
export const DormancyOverlay: React.FC = () => {
  const isPaused = useAppStore(s => s.isPaused)

  if (!isPaused) return null

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-[60] flex items-center justify-center p-6 overflow-hidden"
    >
      {/* ── BACKGROUND LAYER: The Blueprint ── */}
      <div className="absolute inset-0 bg-obsidian-950/60 backdrop-blur-xl" />
      <motion.div 
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 pointer-events-none"
      >
        <Image 
          src="/images/hardware/blueprint_bg.png"
          alt="PCB Blueprint"
          fill
          className="object-cover"
        />
        {/* Scanline Effect Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%),linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:100%_4px,40px_100%] pointer-events-none opacity-20" />
      </motion.div>

      {/* ── CORE COMPONENT: The Container ── */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        className="relative max-w-3xl w-full border border-white/10 bg-black/40 p-8 md:p-14 rounded-sm shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Glow Element */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cobalt-accent/10 blur-[100px] rounded-full pointer-events-none" />

        {/* ── HEADER: Identity & Vision ── */}
        <div className="flex flex-col gap-3 mb-10">
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-6 h-6 rounded-full border border-cobalt-accent/30 text-[10px] font-mono text-cobalt-accent animate-pulse">
              AI
            </span>
            <span className="font-mono text-[10px] tracking-[0.4em] text-white/40 uppercase">
              Hybrid Identity // Chaitanya Sangana
            </span>
          </div>
          <h1 className="font-display text-h3 md:text-h2 text-white-pure tracking-tight leading-tight mt-2">
            Mastering the Bits<span className="text-cobalt-accent">.</span><br />
            Architecting the Atoms<span className="text-white/20">.</span>
          </h1>
        </div>

        {/* ── NARRATIVE: The Bridge ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-8 space-y-6">
            <p className="font-mono text-[11px] tracking-widest text-cobalt-accent uppercase">
              Current Vector: Software Synthesis Phase
            </p>
            
            <div className="space-y-4 font-body text-sm md:text-base text-white/70 leading-relaxed text-justify">
              <p>
                As an <span className="text-white-pure font-medium">ECE Undergraduate</span>, 
                I view software not as a destination, but as the high-fidelity blueprint for hardware. 
                I build as an <span className="text-white-pure font-medium">AI-assisted developer</span>, 
                using neural orchestration to scale complex architectures at the speed of thought.
              </p>
              <p>
                The hardware lab is currently in a state of 
                <span className="text-white-pure font-medium italic"> strategic preparation</span>. 
                I am mastering the software ecosystems and AI pipelines that will eventually 
                drive the silicon I design during my engineering journey.
              </p>
              <p className="border-l-2 border-cobalt-accent/30 pl-4 py-2 text-white/50 italic text-sm">
                "Building the logic today to fuel the circuits of tomorrow."
              </p>
            </div>
          </div>

          {/* ── DIAGNOSTICS: Technical Specs ── */}
          <div className="md:col-span-4 flex flex-col gap-6 pt-2">
            <div className="space-y-4">
              <DiagnosticItem label="Identity" value="Hybrid_Engineer" />
              <DiagnosticItem label="Workflow" value="AI_Augmented" />
              <DiagnosticItem label="Status" value="ECE_UNDERGRAD" />
              <DiagnosticItem label="Stack" value="Bits_Over_Atoms" />
            </div>

            {/* Status Pulse */}
            <div className="mt-4 p-4 border border-white/5 bg-white/[0.02] rounded-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">System Readiness</span>
              </div>
              <div className="h-1 w-full bg-white/5 overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "74%" }}
                  transition={{ duration: 1.5, delay: 1 }}
                  className="h-full bg-cobalt-accent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER: System Metadata ── */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="font-mono text-[9px] text-white/20 tracking-widest uppercase mb-1">Current Academic Focus</span>
            <span className="font-mono text-[11px] text-white/60 uppercase">Electronics & Comm // Undergrad</span>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end">
               <span className="font-mono text-[9px] text-white/20 tracking-widest uppercase mb-1">Session ID</span>
               <span className="font-mono text-[11px] text-white/40 uppercase">VIBE-NODE-01</span>
             </div>
             <motion.button
                whileHover={{ scale: 1.05, color: '#FFFFFF' }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 border border-white/10 text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] bg-white/5 hover:bg-white/10 transition-colors"
             >
                Pulse Reset
             </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

const DiagnosticItem = ({ label, value }: { label: string, value: string }) => (
  <div className="flex flex-col border-b border-white/5 pb-2">
    <span className="font-mono text-[8px] text-white/20 uppercase tracking-widest">{label}</span>
    <span className="font-mono text-[10px] text-white/80 tracking-normal uppercase">{value}</span>
  </div>
)

