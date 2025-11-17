'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import PerfumeImage from '@/components/PerfumeImage'
import { useCart } from '@/contexts/CartContext'
import { useTheme, isDarkColor } from '@/contexts/ThemeContext'
import type { Perfume } from '@/lib/firebase/perfumes'

interface ProductCarouselProps {
  products: Perfume[]
  title: string
}

export default function ProductCarousel({ products, title }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { addToCart } = useCart()
  const router = useRouter()
  const { currentTheme } = useTheme()

  // Calcular el número de slides (2 productos por slide)
  const itemsPerSlide = 2
  const totalSlides = Math.ceil(products.length / itemsPerSlide)

  // Auto-play del carrusel
  useEffect(() => {
    if (totalSlides <= 1) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides)
    }, 4000) // Cambia cada 4 segundos

    return () => clearInterval(interval)
  }, [totalSlides])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className="mb-6">
      <div className="relative w-full">
        {/* Carrusel */}
        <div className="overflow-hidden w-full">
          <div 
            className="flex transition-transform duration-500 ease-in-out w-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => {
              const slideProducts = products.slice(
                slideIndex * itemsPerSlide, 
                slideIndex * itemsPerSlide + itemsPerSlide
              )
              
              return (
                <div
                  key={slideIndex}
                  className="min-w-full w-full flex-shrink-0 flex gap-2 px-2"
                >
                  {slideProducts.map((perfume, idx) => (
                    <motion.div
                      key={perfume.id}
                      className="w-[calc(50%-4px)] flex-shrink-0"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                    >
                      <motion.div
                        whileHover={{ 
                          y: -8,
                          scale: 1.02,
                          boxShadow: `0 12px 30px ${currentTheme.colors.accent}40`,
                          transition: { duration: 0.3 }
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          href={`/producto/${perfume.id}`}
                          className="block overflow-hidden rounded-lg h-full flex flex-col group"
                          style={{ 
                            backgroundColor: currentTheme.colors.surface,
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                          }}
                        >
                        {/* Imagen del perfume */}
                        <div className="h-32 w-full relative flex items-center justify-center" style={{ backgroundColor: currentTheme.colors.surface }}>
                          <PerfumeImage 
                            imageUrl={perfume.imageUrl} 
                            perfumeName={perfume.name}
                            className="h-full w-full object-contain p-1"
                          />
                          {/* Chip "Nuevo" */}
                          <div 
                            className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase"
                            style={{ 
                              backgroundColor: currentTheme.colors.accent,
                              color: isDarkColor(currentTheme.colors.accent) ? '#F8F5EF' : '#1F1F1F',
                              letterSpacing: '0.05em'
                            }}
                          >
                            Nuevo
                          </div>
                        </div>

                        {/* Información del perfume - Solo nombre y precio */}
                        <div className="p-2 flex-1 flex flex-col justify-between min-h-[80px]">
                          <h3 className="font-medium text-[10px] mb-1 line-clamp-2 leading-tight" style={{ color: currentTheme.colors.text }}>
                            {perfume.name}
                          </h3>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center space-x-1 flex-wrap">
                              <span className="text-[11px] font-bold" style={{ color: currentTheme.colors.accent }}>
                                ${perfume.price.toFixed(2)}
                              </span>
                              {perfume.originalPrice && (
                                <span className="text-[9px] line-through" style={{ color: currentTheme.colors.textSecondary }}>
                                  ${perfume.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                router.push(`/producto/${perfume.id}`)
                              }}
                              className="px-2 py-1 rounded text-[9px] font-medium transition-all active:scale-95"
                              style={{
                                backgroundColor: currentTheme.colors.accent,
                                color: isDarkColor(currentTheme.colors.accent) ? '#F8F5EF' : '#1F1F1F',
                                whiteSpace: 'nowrap',
                                border: 'none',
                                cursor: 'pointer'
                              }}
                            >
                              Detalles
                            </button>
                          </div>
                        </div>
                        </Link>
                      </motion.div>
                    </motion.div>
                  ))}
                  {/* Si hay un número impar de productos, agregar un espacio vacío para mantener el centrado */}
                  {slideProducts.length === 1 && (
                    <div className="w-[calc(50%-4px)] flex-shrink-0"></div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Indicadores de puntos */}
        {totalSlides > 1 && (
          <div className="flex justify-center space-x-2 mt-4">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all rounded-full ${
                  index === currentIndex ? 'w-8 h-2' : 'w-2 h-2'
                }`}
                style={{
                  backgroundColor: index === currentIndex 
                    ? currentTheme.colors.accent
                    : currentTheme.colors.textSecondary,
                  opacity: index === currentIndex ? 1 : 0.4,
                }}
                aria-label={`Ir al producto ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

