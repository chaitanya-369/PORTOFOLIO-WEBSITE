'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/core/store'
import { mockHardwareProject } from '@/core/data/hardware-mock'

export const HardwareSidebar: React.FC = () => {
  const isOverlayOpen = useAppStore(s => s.isOverlayOpen)
  const selectedId = useAppStore(s => s.selectedComponentId)
  const setSelected = useAppStore(s => s.setSelectedComponent)
  
  // Find the selected component from the mock data
  const selectedComponent = mockHardwareProject.components.find(c => c.id === selectedId)
  
  // Constitution Law 1: Heavy springs
  const sidebarSpring = { type: 'spring' as const, stiffness: 300, damping: 35, mass: 1 }

  return (
    <AnimatePresence>
      {isOverlayOpen && selectedComponent && (
        <motion.aside
          className="absolute right-0 top-0 bottom-0 w-[400px] z-50 bg-obsidian-950/80 backdrop-blur-xl border-l border-obsidian-800 p-8 flex flex-col"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={sidebarSpring}
        >
          {/* Header Row */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="font-mono text-xs tracking-widest text-cobalt-accent uppercase">
                {selectedComponent.id}
              </span>
              <h2 className="font-display text-h3 text-white-pure mt-1 tracking-tight">
                {selectedComponent.partNumber}
              </h2>
            </div>
            <button 
              onClick={() => setSelected(null)}
              className="text-white-muted hover:text-white-pure transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-glow"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          {/* Main Content Scroll Area */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8">
            <p className="font-body text-sm text-white-muted leading-relaxed">
              {selectedComponent.description}
            </p>
            
            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-obsidian-800/50">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-white-faint tracking-widest mb-1 uppercase">Function</span>
                <span className="font-body text-sm text-white-pure">{selectedComponent.function}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-white-faint tracking-widest mb-1 uppercase">Voltage Array</span>
                <span className="font-body text-sm text-white-pure">{selectedComponent.voltage}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-white-faint tracking-widest mb-1 uppercase">Package</span>
                <span className="font-body text-sm text-white-pure">{selectedComponent.packageType}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-white-faint tracking-widest mb-1 uppercase">Manufacturer</span>
                <span className="font-body text-sm text-white-pure">{selectedComponent.manufacturer}</span>
              </div>
            </div>
          </div>
          
          {/* CTA Footer */}
          <div className="pt-6 border-t border-obsidian-800">
            <button className="w-full py-3 bg-cobalt-accent hover:bg-cobalt-glow text-white-pure font-mono text-xs tracking-widest uppercase transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white-pure focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-950">
              Download Datasheet
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
