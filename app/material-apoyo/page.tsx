'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getAllMaterials } from '@/lib/firebase/materials'
import type { Material } from '@/lib/firebase/materials'
import { getImageUrl, getVideoUrl } from '@/lib/b2/storage'

export default function MaterialApoyo() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      setError(err.message || 'Error al cargar el material de apoyo')
    } finally {
      setLoading(false)
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
            Material de Apoyo
          </h1>

          {loading && (
            <div className="text-center py-12">
              <p style={{ color: '#F8F5EF' }}>Cargando material...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: '#344A3D' }}>
              <p style={{ color: '#D4AF37' }}>⚠️ {error}</p>
            </div>
          )}

          {!loading && !error && materials.length === 0 && (
            <div className="text-center py-12">
              <p style={{ color: '#F8F5EF' }}>No hay material de apoyo disponible.</p>
            </div>
          )}

          {!loading && !error && materials.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {materials.map((material, index) => {
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
                    transition={{ delay: index * 0.1 }}
                    className="rounded-lg overflow-hidden"
                    style={{ backgroundColor: '#344A3D' }}
                    whileHover={{ scale: 1.02, y: -4 }}
                  >
                    {thumbnailUrl && (
                      <div className="aspect-video overflow-hidden" style={{ backgroundColor: '#000000' }}>
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
                                className="w-16 h-16"
                                style={{ color: '#D4AF37' }}
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
                              className="w-16 h-16"
                              style={{ color: '#D4AF37' }}
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
                    
                    <div className="p-4">
                      <h3 
                        className="text-lg font-semibold mb-2"
                        style={{ color: '#D4AF37' }}
                      >
                        {material.title}
                      </h3>
                      
                      {material.description && (
                        <p 
                          className="text-sm mb-3"
                          style={{ color: '#F8F5EF', opacity: 0.8 }}
                        >
                          {material.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs" style={{ color: '#F8F5EF', opacity: 0.6 }}>
                          <span className="capitalize">{material.fileType}</span>
                          {material.fileSize && (
                            <span className="ml-2">• {formatFileSize(material.fileSize)}</span>
                          )}
                        </div>
                        
                        <motion.button
                          onClick={() => handleDownload(material)}
                          className="px-4 py-2 rounded-lg font-medium text-sm"
                          style={{ 
                            backgroundColor: '#D4AF37',
                            color: '#000000',
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Descargar
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}

