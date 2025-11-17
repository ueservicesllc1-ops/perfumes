'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PerfumeImage from '@/components/PerfumeImage'
import { getPerfumeById, type Perfume } from '@/lib/firebase/perfumes'
import { useCart } from '@/contexts/CartContext'
import { useTheme, getButtonTextColor, getIconColor } from '@/contexts/ThemeContext'

export default function ProductoDetalle() {
  const params = useParams()
  const router = useRouter()
  const { currentTheme } = useTheme()
  const { addToCart } = useCart()
  const [perfume, setPerfume] = useState<Perfume | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationQuantity, setNotificationQuantity] = useState<number>(0)
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const quantityOptions = [1, 6, 12, 24, 48, 72]

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    async function fetchPerfume() {
      if (!params.id || typeof params.id !== 'string') {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await getPerfumeById(params.id)
        setPerfume(data)
      } catch (error) {
        console.error('Error fetching perfume:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPerfume()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: currentTheme.colors.background, color: currentTheme.colors.text }}>
        <Header />
        <div style={{ marginTop: '50px' }} className="flex items-center justify-center min-h-[60vh]">
          <p style={{ color: currentTheme.colors.textSecondary }}>Cargando...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!perfume) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: currentTheme.colors.background, color: currentTheme.colors.text }}>
        <Header />
        <div style={{ marginTop: '50px' }} className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <p className="text-lg mb-4" style={{ color: currentTheme.colors.textSecondary }}>Producto no encontrado</p>
          <button
            onClick={() => router.push('/catalogo')}
            className="px-6 py-2 rounded-lg font-medium"
            style={{ backgroundColor: currentTheme.colors.accent, color: getButtonTextColor(currentTheme.colors.accent) }}
          >
            Volver al catálogo
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: currentTheme.colors.background, color: currentTheme.colors.text }}>
      <Header />
      <div style={{ marginTop: '50px' }} className="pb-32">
        <div className="max-w-sm mx-auto px-4 py-6">
          {/* Botón volver */}
          <button
            onClick={() => router.back()}
            className="mb-4 flex items-center space-x-2 text-sm"
            style={{ color: currentTheme.colors.accent }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Volver</span>
          </button>

          {/* Imagen grande del producto */}
          <motion.div 
            className="mb-6 rounded-lg p-4" 
            style={{ backgroundColor: currentTheme.colors.surface }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div 
              className="h-64 relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <PerfumeImage 
                imageUrl={perfume.imageUrl} 
                perfumeName={perfume.name}
                className="h-64 object-contain"
              />
            </motion.div>
          </motion.div>

          {/* Información del producto */}
          <div className="mb-6">
            <h1 className="text-xl font-bold mb-2" style={{ color: currentTheme.colors.text }}>
              {perfume.name}
            </h1>

            {/* Precio */}
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl font-bold" style={{ color: currentTheme.colors.accent }}>
                ${perfume.price.toFixed(2)}
              </span>
              {perfume.originalPrice && (
                <>
                  <span className="text-lg line-through" style={{ color: currentTheme.colors.textSecondary }}>
                    ${perfume.originalPrice.toFixed(2)}
                  </span>
                  <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    Oferta
                  </span>
                </>
              )}
            </div>

            {/* Detalles */}
            <div className="space-y-3 mb-6">
              {perfume.size && (
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: currentTheme.colors.accent }}>Tamaño:</p>
                  <p className="text-base" style={{ color: currentTheme.colors.text }}>{perfume.size}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium mb-1" style={{ color: currentTheme.colors.accent }}>Categoría:</p>
                <p className="text-base" style={{ color: currentTheme.colors.text }}>{perfume.category}</p>
              </div>

              {perfume.brand && (
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: currentTheme.colors.accent }}>Marca:</p>
                  <p className="text-base" style={{ color: currentTheme.colors.text }}>{perfume.brand}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium mb-1" style={{ color: currentTheme.colors.accent }}>Disponibilidad:</p>
                <p className="text-base font-medium" style={{ color: perfume.inStock ? '#22c55e' : '#ef4444' }}>
                  {perfume.inStock ? 'En stock' : 'Agotado'}
                </p>
              </div>

              {perfume.description && (
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: currentTheme.colors.accent }}>Descripción:</p>
                  <p className="text-base leading-relaxed" style={{ color: currentTheme.colors.text }}>
                    {perfume.description}
                  </p>
                </div>
              )}
            </div>

            {/* Selector de cantidad */}
            {perfume.inStock && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2" style={{ color: currentTheme.colors.accent }}>
                  Cantidad:
                </p>
                <div className="flex flex-wrap gap-2">
                  {quantityOptions.map((qty) => (
                    <motion.button
                      key={qty}
                      onClick={() => setSelectedQuantity(qty)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedQuantity === qty ? '' : 'opacity-70'
                      }`}
                      style={
                        selectedQuantity === qty
                          ? {
                              backgroundColor: currentTheme.colors.accent,
                              color: getButtonTextColor(currentTheme.colors.accent),
                              boxShadow: `0 2px 8px ${currentTheme.colors.accent}40`,
                            }
                          : {
                              backgroundColor: currentTheme.colors.surface,
                              color: getIconColor(currentTheme.colors.surface, currentTheme.colors.accent),
                              border: `1px solid ${currentTheme.colors.accent}30`,
                            }
                      }
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {qty}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Botón agregar al carrito */}
            <motion.button
              disabled={!perfume.inStock}
              onClick={() => {
                if (perfume.inStock) {
                  addToCart(perfume, selectedQuantity)
                  setNotificationQuantity(selectedQuantity)
                  
                  // Limpiar timeout anterior si existe
                  if (notificationTimeoutRef.current) {
                    clearTimeout(notificationTimeoutRef.current)
                  }
                  
                  setShowNotification(true)
                  
                  // Cerrar automáticamente después de 4 segundos
                  notificationTimeoutRef.current = setTimeout(() => {
                    setShowNotification(false)
                    notificationTimeoutRef.current = null
                  }, 4000)
                }
              }}
              className={`w-full py-3 rounded-lg text-base font-semibold ${
                perfume.inStock
                  ? ''
                  : 'cursor-not-allowed opacity-50'
              }`}
              style={perfume.inStock ? {
                backgroundColor: currentTheme.colors.accent,
                color: getButtonTextColor(currentTheme.colors.accent),
              } : {
                backgroundColor: currentTheme.colors.surface,
                color: currentTheme.colors.textSecondary,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={perfume.inStock ? { 
                scale: 1.05,
                boxShadow: `0 8px 20px ${currentTheme.colors.accent}50`,
                transition: { duration: 0.3 }
              } : {}}
              whileTap={perfume.inStock ? { scale: 0.95 } : {}}
            >
              {perfume.inStock ? `Agregar ${selectedQuantity} al carrito` : 'Agotado'}
            </motion.button>
          </div>
        </div>
      </div>
      <Footer />

      {/* Popup de notificación */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (notificationTimeoutRef.current) {
                clearTimeout(notificationTimeoutRef.current)
                notificationTimeoutRef.current = null
              }
              setShowNotification(false)
            }}
          >
            <motion.div
              className="relative max-w-sm w-full rounded-lg p-6 shadow-2xl"
              style={{ backgroundColor: currentTheme.colors.surface }}
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botón cerrar */}
              <button
                onClick={() => {
                  if (notificationTimeoutRef.current) {
                    clearTimeout(notificationTimeoutRef.current)
                    notificationTimeoutRef.current = null
                  }
                  setShowNotification(false)
                }}
                className="absolute top-2 right-2 p-1 rounded-full transition-colors"
                style={{ 
                  color: currentTheme.colors.textSecondary,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.colors.accent + '20'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <svg
                  className="w-5 h-5"
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

              {/* Contenido */}
              <div className="text-center">
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: currentTheme.colors.accent }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 
                  className="text-xl font-bold mb-2"
                  style={{ color: currentTheme.colors.accent }}
                >
                  ¡Producto agregado!
                </h3>
                <p 
                  className="text-base"
                  style={{ color: currentTheme.colors.text }}
                >
                  {notificationQuantity} {notificationQuantity === 1 ? 'producto fue' : 'productos fueron'} agregado{notificationQuantity === 1 ? '' : 's'} al carrito
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

