'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
      <div className="min-h-screen" style={{ backgroundColor: '#172621', color: '#FFFFFF' }}>
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
      <div className="min-h-screen" style={{ backgroundColor: '#172621', color: '#FFFFFF' }}>
        <Header />
        <div style={{ marginTop: '50px' }} className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <p className="text-lg mb-4" style={{ color: '#999' }}>Producto no encontrado</p>
          <button
            onClick={() => router.push('/catalogo')}
            className="px-6 py-2 rounded-lg text-white font-medium"
            style={{ backgroundColor: '#172621' }}
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
          <div className="mb-6 rounded-lg p-4" style={{ backgroundColor: '#2a2a2a' }}>
            <div className="h-64 relative">
              <PerfumeImage 
                imageUrl={perfume.imageUrl} 
                perfumeName={perfume.name}
                className="h-64 object-contain"
              />
            </div>
          </div>

          {/* Información del producto */}
          <div className="mb-6">
            <h1 className="text-xl font-bold mb-2" style={{ color: '#FFFFFF' }}>
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
                  <p className="text-base" style={{ color: '#FFFFFF' }}>{perfume.size}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium mb-1" style={{ color: '#D4AF37' }}>Categoría:</p>
                <p className="text-base" style={{ color: '#FFFFFF' }}>{perfume.category}</p>
              </div>

              {perfume.brand && (
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: '#D4AF37' }}>Marca:</p>
                  <p className="text-base" style={{ color: '#FFFFFF' }}>{perfume.brand}</p>
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
            <button
              disabled={!perfume.inStock}
              onClick={() => {
                if (perfume.inStock) {
                  addToCart(perfume)
                  alert('Producto agregado al carrito')
                }
              }}
              className={`w-full py-3 rounded-lg text-base font-semibold transition-all active:scale-95 ${
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
            >
              {perfume.inStock ? 'Agregar al carrito' : 'Agotado'}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

