'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/core/store'

export const LoadingOverlay: React.FC = () => {
  const loadState = useAppStore(s => s.loadState)
  
  return (
    <AnimatePresence>
      {loadState.isLoading && (
        <motion.div 
          className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-obsidian-950/90 backdrop-blur-md"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <div className="flex flex-col items-center w-64">
            <span className="font-mono text-xs tracking-widest text-cobalt-accent mb-4 uppercase">
              INITIALIZING WEBGL
            </span>
            <div className="w-full h-px bg-obsidian-800 relative overflow-hidden">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-cobalt-glow"
                animate={{ width: `${loadState.progress}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            </div>
            <div className="w-full flex justify-between mt-2 font-mono text-[10px] text-white-muted tracking-widest">
              <span>{Math.round(loadState.progress)}%</span>
              <span>GEOMETRY LCH</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
