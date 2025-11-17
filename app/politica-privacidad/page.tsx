'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PoliticaPrivacidad() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#182B21', paddingTop: '60px', paddingBottom: '80px' }}>
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 
            className="text-2xl font-bold mb-6 text-center"
            style={{ color: '#D4AF37' }}
          >
            Política de Privacidad
          </h1>

          <div 
            className="p-6 rounded-lg space-y-4"
            style={{ backgroundColor: '#344A3D' }}
          >
            <p style={{ color: '#F8F5EF', lineHeight: '1.8' }}>
              Aquí va el contenido de la política de privacidad...
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}

