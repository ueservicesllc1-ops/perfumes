'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const bannerImages = [
  {
    id: 1,
    src: '/banner.jpg',
    alt: 'Banner 1',
  },
  {
    id: 2,
    src: '/banner2.jpg',
    alt: 'Banner 2',
  },
  {
    id: 3,
    src: '/banner3.jpg',
    alt: 'Banner 3',
  },
  {
    id: 4,
    src: '/banner4.jpg',
    alt: 'Banner 4',
  },
  {
    id: 6,
    src: '/banner6.jpg',
    alt: 'Banner 6',
  },
  {
    id: 7,
    src: '/banner7.jpg',
    alt: 'Banner 7',
  },
]

export default function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-play del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerImages.length)
    }, 5000) // Cambia cada 5 segundos

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative w-screen overflow-hidden" style={{ height: '200px', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}>
      <div className="relative w-full h-full">
        {bannerImages.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-contain"
              sizes="100vw"
              unoptimized
              priority={index === 0}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

