'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme, colorPalettes } from '@/contexts/ThemeContext'

export default function ThemeSelector() {
  const { currentTheme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg"
        style={{ color: currentTheme.colors.headerText }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Seleccionar tema"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed top-16 right-4 z-50 w-72 max-h-[80vh] overflow-y-auto rounded-lg p-4"
              style={{ 
                backgroundColor: currentTheme.colors.surface,
                border: `1px solid ${currentTheme.colors.border}`,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold" style={{ color: currentTheme.colors.text }}>
                  Seleccionar Tema
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded"
                  style={{ color: currentTheme.colors.textSecondary }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {colorPalettes.map((palette) => (
                  <motion.button
                    key={palette.id}
                    onClick={() => {
                      setTheme(palette.id)
                      setIsOpen(false)
                    }}
                    className="p-3 rounded-lg text-left transition-all"
                    style={{
                      backgroundColor: currentTheme.id === palette.id ? palette.colors.accent + '30' : currentTheme.colors.background,
                      border: `2px solid ${currentTheme.id === palette.id ? palette.colors.accent : currentTheme.colors.border}`,
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {[palette.colors.primary, palette.colors.accent, palette.colors.secondary].map((color, idx) => (
                          <div
                            key={idx}
                            className="w-6 h-6 rounded-full border"
                            style={{ 
                              backgroundColor: color,
                              borderColor: currentTheme.colors.border
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold" style={{ color: currentTheme.colors.text }}>
                          {palette.name}
                        </div>
                        <div className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                          {palette.description}
                        </div>
                      </div>
                      {currentTheme.id === palette.id && (
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: palette.colors.accent }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

