'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BannerCarousel from '@/components/BannerCarousel'
import ActionButtons from '@/components/ActionButtons'
import ProductCarousel from '@/components/ProductCarousel'
import VideoGallery from '@/components/VideoGallery'
import { usePerfumes } from '@/hooks/usePerfumes'
import { useVideos } from '@/hooks/useVideos'

export default function Home() {
  const { perfumes, loading } = usePerfumes()
  const { videos } = useVideos()

  // Obtener productos nuevos (últimos 6 disponibles)
  const newPerfumes = perfumes.length > 0
    ? perfumes.filter(p => p.inStock).slice(-6).reverse()
    : []

  return (
    <motion.div 
      className="min-h-screen" 
      style={{ backgroundColor: '#182B21', color: '#F8F5EF' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <div style={{ marginTop: '35px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <BannerCarousel />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <ActionButtons />
        </motion.div>
        <motion.div 
          className="px-4 pt-2 pb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <ProductCarousel 
            products={newPerfumes}
            title="Productos Nuevos"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <VideoGallery videos={videos} />
        </motion.div>
        <motion.div
          className="px-4 py-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.button
            className="w-full py-6 rounded-lg font-bold text-lg"
            style={{
              backgroundColor: '#D4AF37',
              color: '#000000',
            }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4)',
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            Envíos Internacionales
          </motion.button>
        </motion.div>
      </div>
      <div className="pb-32">
        {/* Contenido aquí */}
      </div>
      <Footer />
    </motion.div>
  )
}
