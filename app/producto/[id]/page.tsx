'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PerfumeImage from '@/components/PerfumeImage'
import { getPerfumeById, type Perfume } from '@/lib/firebase/perfumes'
import { useCart } from '@/contexts/CartContext'

export default function ProductoDetalle() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const [perfume, setPerfume] = useState<Perfume | null>(null)
  const [loading, setLoading] = useState(true)

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
      <div className="min-h-screen" style={{ backgroundColor: '#182B21', color: '#F8F5EF' }}>
        <Header />
        <div style={{ marginTop: '50px' }} className="flex items-center justify-center min-h-[60vh]">
          <p style={{ color: '#999' }}>Cargando...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!perfume) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#182B21', color: '#F8F5EF' }}>
        <Header />
        <div style={{ marginTop: '50px' }} className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <p className="text-lg mb-4" style={{ color: '#999' }}>Producto no encontrado</p>
          <button
            onClick={() => router.push('/catalogo')}
            className="px-6 py-2 rounded-lg text-white font-medium"
            style={{ backgroundColor: '#000000' }}
          >
            Volver al catálogo
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#172621', color: '#FFFFFF' }}>
      <Header />
      <div style={{ marginTop: '50px' }} className="pb-32">
        <div className="max-w-sm mx-auto px-4 py-6">
          {/* Botón volver */}
          <button
            onClick={() => router.back()}
            className="mb-4 flex items-center space-x-2 text-sm"
            style={{ color: '#D4AF37' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Volver</span>
          </button>

          {/* Imagen grande del producto */}
          <motion.div 
            className="mb-6 rounded-lg p-4" 
            style={{ backgroundColor: '#344A3D' }}
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
            <h1 className="text-xl font-bold mb-2" style={{ color: '#F8F5EF' }}>
              {perfume.name}
            </h1>

            {/* Precio */}
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl font-bold" style={{ color: '#D4AF37' }}>
                ${perfume.price.toFixed(2)}
              </span>
              {perfume.originalPrice && (
                <>
                  <span className="text-lg line-through" style={{ color: '#999' }}>
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
                  <p className="text-sm font-medium mb-1" style={{ color: '#D4AF37' }}>Tamaño:</p>
                  <p className="text-base" style={{ color: '#F8F5EF' }}>{perfume.size}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium mb-1" style={{ color: '#D4AF37' }}>Categoría:</p>
                <p className="text-base" style={{ color: '#FFFFFF' }}>{perfume.category}</p>
              </div>

              {perfume.brand && (
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: '#D4AF37' }}>Marca:</p>
                  <p className="text-base" style={{ color: '#F8F5EF' }}>{perfume.brand}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium mb-1" style={{ color: '#D4AF37' }}>Disponibilidad:</p>
                <p className="text-base font-medium" style={{ color: perfume.inStock ? '#22c55e' : '#ef4444' }}>
                  {perfume.inStock ? 'En stock' : 'Agotado'}
                </p>
              </div>

              {perfume.description && (
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: '#D4AF37' }}>Descripción:</p>
                  <p className="text-base leading-relaxed" style={{ color: '#FFFFFF' }}>
                    {perfume.description}
                  </p>
                </div>
              )}
            </div>

            {/* Botón agregar al carrito */}
            <motion.button
              disabled={!perfume.inStock}
              onClick={() => {
                if (perfume.inStock) {
                  addToCart(perfume)
                  alert('Producto agregado al carrito')
                }
              }}
              className={`w-full py-3 rounded-lg text-base font-semibold ${
                perfume.inStock
                  ? ''
                  : 'cursor-not-allowed opacity-50'
              }`}
              style={perfume.inStock ? {
                backgroundColor: '#D4AF37',
                color: '#000000',
              } : {
                backgroundColor: '#2a2a2a',
                color: '#666',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={perfume.inStock ? { 
                scale: 1.05,
                boxShadow: '0 8px 20px rgba(212, 175, 55, 0.5)',
                transition: { duration: 0.3 }
              } : {}}
              whileTap={perfume.inStock ? { scale: 0.95 } : {}}
            >
              {perfume.inStock ? 'Agregar al carrito' : 'Agotado'}
            </motion.button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

