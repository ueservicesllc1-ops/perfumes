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
      </div>
      <div className="pb-32">
        {/* Contenido aquí */}
      </div>
      <Footer />
    </motion.div>
  )
}
