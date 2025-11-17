'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { getImageUrl } from '@/lib/b2/storage'

interface PerfumeImageProps {
  imageUrl?: string
  perfumeName: string
  className?: string
}

export default function PerfumeImage({ imageUrl, perfumeName, className = 'h-48' }: PerfumeImageProps) {
  // Solo mostrar imágenes si hay una URL válida de B2
  if (!imageUrl || imageUrl.trim() === '') {
    return null
  }

  // Rechazar data URLs explícitamente (causan error 431)
  if (imageUrl.startsWith('data:')) {
    console.warn(`Data URL rechazada para ${perfumeName}. Las imágenes deben subirse primero a B2.`)
    return null
  }

  // Rechazar URLs externas (http://, https:// que no sean de B2)
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    // Solo permitir URLs de B2
    if (!imageUrl.includes('backblazeb2.com') && !imageUrl.includes('s3.us-east-005')) {
      console.warn(`URL externa rechazada para ${perfumeName}:`, imageUrl)
      return null
    }
  }

  // Solo usar URLs de B2
  // Si empieza con /api/b2, usarla directamente
  // Si no, asumir que es una ruta de B2 y usar el proxy
  const imageSrc = imageUrl.startsWith('/api/b2')
    ? imageUrl
    : getImageUrl(imageUrl)

  return (
    <motion.div 
      className={`${className} relative overflow-hidden`} 
      style={{ backgroundColor: '#344A3D' }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full"
      >
        <Image
          src={imageSrc}
          alt={perfumeName}
          fill
          className="object-contain p-1"
          sizes="(max-width: 384px) 100vw, 384px"
          unoptimized
        />
      </motion.div>
    </motion.div>
  )
}

