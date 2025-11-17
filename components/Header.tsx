'use client'

import { motion } from 'framer-motion'

export default function Header() {
  return (
    <motion.header 
      className="w-full fixed top-0 left-0 right-0 z-50"
      style={{ 
        backgroundColor: '#000000',
        padding: '0.5rem 1rem',
        minHeight: '40px',
        boxShadow: 'none',
        border: 'none',
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-center">
        <motion.span 
          className="text-sm font-medium" 
          style={{ color: '#F8F5EF' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          whileHover={{ scale: 1.1 }}
        >
          www.jcsellers.com
        </motion.span>
      </div>
    </motion.header>
  )
}

