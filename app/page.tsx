'use client'

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
    <div className="min-h-screen" style={{ backgroundColor: '#172621', color: '#FFFFFF' }}>
      <Header />
      <div style={{ marginTop: '35px' }}>
        <BannerCarousel />
        <ActionButtons />
        <div className="px-4 pt-2 pb-2">
          <ProductCarousel 
            products={newPerfumes}
            title="Productos Nuevos"
          />
        </div>
        <VideoGallery videos={videos} />
      </div>
      <div className="pb-32">
        {/* Contenido aquí */}
      </div>
      <Footer />
    </div>
  )
}
