'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useTheme } from '@/contexts/ThemeContext'

export default function Nosotros() {
  const { currentTheme } = useTheme()
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: currentTheme.colors.background, paddingTop: '60px', paddingBottom: '80px' }}>
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 
            className="text-2xl font-bold mb-6 text-center"
            style={{ color: currentTheme.colors.accent }}
          >
            Nosotros
          </h1>

          <div 
            className="p-6 rounded-lg space-y-4"
            style={{ backgroundColor: currentTheme.colors.surface }}
          >
            <p style={{ color: currentTheme.colors.text, lineHeight: '1.8' }}>
              Aquí va la información sobre la empresa...
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}

