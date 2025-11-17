'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { RectangleStackIcon, StarIcon, TicketIcon } from '@heroicons/react/24/outline'

export default function ActionButtons() {
  const router = useRouter()
  
  return (
    <div className="w-full px-4 py-4" style={{ backgroundColor: '#182B21', marginTop: '-20px' }}>
      <div className="max-w-sm mx-auto grid grid-cols-3 gap-3">
        {/* Botón Colección */}
        <motion.button 
          onClick={() => router.push('/catalogo')}
          className="rounded-lg p-4 flex flex-col items-center justify-center space-y-2" 
          style={{ 
            backgroundColor: '#344A3D', 
            border: 'none',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ 
            scale: 1.05,
            y: -4,
            boxShadow: '0 8px 20px rgba(212, 175, 55, 0.4)',
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <RectangleStackIcon 
              className="w-7 h-7"
              style={{ color: '#D4AF37', strokeWidth: 2 }}
            />
          </motion.div>
          <span className="text-xs font-medium tracking-wide uppercase" style={{ color: '#D4AF37', letterSpacing: '0.08em' }}>
            Colección
          </span>
        </motion.button>

        {/* Botón Nuevo */}
        <motion.button 
          className="rounded-lg p-4 flex flex-col items-center justify-center space-y-2" 
          style={{ 
            backgroundColor: '#344A3D', 
            border: 'none',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ 
            scale: 1.05,
            y: -4,
            boxShadow: '0 8px 20px rgba(212, 175, 55, 0.4)',
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <StarIcon 
              className="w-7 h-7"
              style={{ color: '#D4AF37', strokeWidth: 2 }}
            />
          </motion.div>
          <span className="text-xs font-medium tracking-wide uppercase" style={{ color: '#D4AF37', letterSpacing: '0.08em' }}>
            Nuevo
          </span>
        </motion.button>

        {/* Botón Ofertas */}
        <motion.button 
          className="rounded-lg p-4 flex flex-col items-center justify-center space-y-2" 
          style={{ 
            backgroundColor: '#344A3D', 
            border: 'none',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ 
            scale: 1.05,
            y: -4,
            boxShadow: '0 8px 20px rgba(212, 175, 55, 0.4)',
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <TicketIcon 
              className="w-7 h-7"
              style={{ color: '#D4AF37', strokeWidth: 2 }}
            />
          </motion.div>
          <span className="text-xs font-medium tracking-wide uppercase" style={{ color: '#D4AF37', letterSpacing: '0.08em' }}>
            Ofertas
          </span>
        </motion.button>
      </div>
    </div>
  )
}

