'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getAllMaterials } from '@/lib/firebase/materials'
import type { Material } from '@/lib/firebase/materials'
import { getImageUrl, getVideoUrl } from '@/lib/b2/storage'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme, getButtonTextColor } from '@/contexts/ThemeContext'

export default function MaterialApoyo() {
  const { t } = useLanguage()
  const { currentTheme } = useTheme()
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    loadMaterials()
  }, [])

  async function loadMaterials() {
    try {
      setLoading(true)
      const data = await getAllMaterials()
      setMaterials(data)
      setError(null)
    } catch (err: any) {
      console.error('Error loading materials:', err)
      setError(err.message || t('material.errorLoading'))
    } finally {
      setLoading(false)
    }
  }

  function handleImageClick(material: Material) {
    if (material.fileType === 'image') {
      const imageUrl = material.fileUrl.startsWith('/api/b2')
        ? material.fileUrl
        : getImageUrl(material.fileUrl)
      setSelectedImage(imageUrl)
    }
  }

  function handleDownload(material: Material) {
    // Obtener URL del archivo
    let fileUrl = material.fileUrl
    
    // Si es una imagen o video, usar las funciones de B2
    if (material.fileType === 'image') {
      fileUrl = getImageUrl(material.fileUrl)
    } else if (material.fileType === 'video') {
      fileUrl = getVideoUrl(material.fileUrl)
    }
    
    // Si es una URL relativa, convertir a absoluta
    if (fileUrl.startsWith('/')) {
      fileUrl = window.location.origin + fileUrl
    }
    
    // Para descargas, abrir en nueva pestaña o descargar directamente
    // Si el navegador soporta download, intentar descargar
    if (material.fileType === 'pdf' || material.fileType === 'other') {
      // Para PDFs y otros archivos, intentar descarga directa
      const link = document.createElement('a')
      link.href = fileUrl
      link.download = material.fileName
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      // Para imágenes y videos, abrir en nueva pestaña
      window.open(fileUrl, '_blank')
    }
  }

  function formatFileSize(bytes?: number): string {
    if (!bytes) return 'N/A'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  function renderMaterialCard(material: Material, index: number) {
    const thumbnailUrl = material.thumbnailUrl 
      ? (material.thumbnailUrl.startsWith('/api/b2') 
          ? material.thumbnailUrl 
          : getImageUrl(material.thumbnailUrl))
      : material.fileType === 'image' 
        ? (material.fileUrl.startsWith('/api/b2') 
            ? material.fileUrl 
            : getImageUrl(material.fileUrl))
        : null

    return (
      <motion.div
        key={material.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="rounded-lg overflow-hidden"
        style={{ backgroundColor: currentTheme.colors.surface }}
        whileHover={{ scale: 1.02, y: -2 }}
      >
        {thumbnailUrl && (
          <div 
            className="aspect-video overflow-hidden cursor-pointer" 
            style={{ backgroundColor: currentTheme.colors.header }}
            onClick={() => material.fileType === 'image' && handleImageClick(material)}
          >
            {material.fileType === 'image' ? (
              <img
                src={thumbnailUrl}
                alt={material.title}
                className="w-full h-full object-cover"
              />
            ) : material.fileType === 'video' ? (
              <div className="w-full h-full flex items-center justify-center relative">
                <img
                  src={thumbnailUrl}
                  alt={material.title}
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-8 h-8"
                    style={{ color: currentTheme.colors.accent }}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  className="w-8 h-8"
                  style={{ color: currentTheme.colors.accent }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            )}
          </div>
        )}
        
        <div className="p-2">
          <h3 
            className="text-xs font-semibold mb-1 line-clamp-2"
            style={{ color: currentTheme.colors.accent }}
          >
            {material.title}
          </h3>
          
          {material.description && (
            <p 
              className="text-xs mb-2 line-clamp-2"
              style={{ color: currentTheme.colors.text, opacity: 0.8 }}
            >
              {material.description}
            </p>
          )}
          
          <div className="flex flex-col gap-1">
            <div className="text-xs" style={{ color: currentTheme.colors.text, opacity: 0.6 }}>
              <span className="capitalize text-[10px]">{material.fileType}</span>
              {material.fileSize && (
                <span className="ml-1 text-[10px]">• {formatFileSize(material.fileSize)}</span>
              )}
            </div>
            
            <motion.button
              onClick={() => handleDownload(material)}
              className="px-2 py-1 rounded text-xs font-medium w-full"
              style={{ 
                backgroundColor: currentTheme.colors.accent,
                color: getButtonTextColor(currentTheme.colors.accent),
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('button.download')}
            </motion.button>
          </div>
        </div>
      </motion.div>
    )
  }

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
            {t('nav.material')}
          </h1>

          {loading && (
            <div className="text-center py-12">
              <p style={{ color: currentTheme.colors.text }}>{t('material.loading')}</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: currentTheme.colors.surface }}>
              <p style={{ color: currentTheme.colors.accent }}>⚠️ {error}</p>
            </div>
          )}

          {!loading && !error && materials.length === 0 && (
            <div className="text-center py-12">
              <p style={{ color: currentTheme.colors.text }}>{t('material.noAvailable')}</p>
            </div>
          )}

          {!loading && !error && materials.length > 0 && (() => {
            // Separar materiales por tipo
            const videos = materials.filter(m => m.fileType === 'video')
            const fotos = materials.filter(m => m.fileType === 'image')
            const pdfs = materials.filter(m => m.fileType === 'pdf')
            const otros = materials.filter(m => m.fileType === 'other')

            return (
              <div className="space-y-6">
                {/* Sección de Videos */}
                {videos.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-lg font-bold mb-3" style={{ color: '#D4AF37' }}>
                      {t('material.videos')}
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                      {videos.map((material, index) => {
                        return renderMaterialCard(material, index)
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Sección de Fotos */}
                {fotos.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <h2 className="text-lg font-bold mb-3" style={{ color: '#D4AF37' }}>
                      {t('material.photos')}
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                      {fotos.map((material, index) => {
                        return renderMaterialCard(material, index)
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Sección de PDFs */}
                {pdfs.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h2 className="text-lg font-bold mb-3" style={{ color: '#D4AF37' }}>
                      {t('material.pdfs')}
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                      {pdfs.map((material, index) => {
                        return renderMaterialCard(material, index)
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Sección de Otros */}
                {otros.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <h2 className="text-lg font-bold mb-3" style={{ color: '#D4AF37' }}>
                      {t('material.others')}
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                      {otros.map((material, index) => {
                        return renderMaterialCard(material, index)
                      })}
                    </div>
                  </motion.div>
                )}
              </div>
            )
          })()}
        </motion.div>
      </main>

      <Footer />

      {/* Modal para imagen grande */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            className="relative max-w-4xl max-h-[90vh] w-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 z-10 p-2 rounded-full"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF' }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Imagen */}
            <img
              src={selectedImage}
              alt={t('material.enlargedImage')}
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
            />
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

