'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

// Imágenes del carrusel - usando imágenes de Unsplash directamente
const carouselImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
    alt: 'Banner 1',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1595425970377-c9708b4d74e8?w=800&q=80',
    alt: 'Banner 2',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',
    alt: 'Banner 3',
  },
]

export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-play del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length)
    }, 5000) // Cambia cada 5 segundos

    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length)
  }

  return (
    <section className="relative w-full mb-6 overflow-hidden" style={{ height: '200px' }}>
      {/* Carrusel */}
      <div className="relative w-full h-full">
        {carouselImages.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="relative w-full h-full">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 384px) 100vw, 384px"
                unoptimized
                priority={index === 0}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Botones de navegación */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full backdrop-blur-sm transition-all active:scale-95"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          color: '#fff',
        }}
        aria-label="Imagen anterior"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full backdrop-blur-sm transition-all active:scale-95"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          color: '#fff',
        }}
        aria-label="Siguiente imagen"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicadores de puntos */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all rounded-full ${
              index === currentIndex ? 'w-8 h-2' : 'w-2 h-2'
            }`}
            style={{
              backgroundColor: index === currentIndex ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.4)',
            }}
            aria-label={`Ir a la imagen ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
