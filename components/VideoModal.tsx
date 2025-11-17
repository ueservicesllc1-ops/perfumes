'use client'

import { useEffect, useRef, useState } from 'react'
import { getVideoUrl } from '@/lib/b2/storage'
import type { Video } from '@/lib/firebase/videos'

interface VideoModalProps {
  video: Video
  onClose: () => void
}

export default function VideoModal({ video, onClose }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Usar URL directa de B2 para mejor compatibilidad con iOS/Safari
  const videoUrl = getVideoUrl(video.videoUrl)

  useEffect(() => {
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  useEffect(() => {
    // Reproducir automáticamente cuando el modal se abre
    const playVideo = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play()
          setIsPlaying(true)
        } catch (error) {
          console.warn('No se pudo reproducir automáticamente:', error)
          // Si falla la reproducción automática (por políticas del navegador),
          // el usuario tendrá que hacer clic manualmente
        }
      }
    }

    // Intentar reproducir cuando el video esté listo
    const videoElement = videoRef.current
    if (videoElement) {
      const handleCanPlay = () => {
        playVideo()
      }
      
      videoElement.addEventListener('canplay', handleCanPlay)
      
      // También intentar inmediatamente si el video ya está listo
      if (videoElement.readyState >= 3) {
        playVideo()
      }

      return () => {
        videoElement.removeEventListener('canplay', handleCanPlay)
        videoElement.pause()
      }
    }
  }, [videoUrl])

  function handleError(e: React.SyntheticEvent<HTMLVideoElement, Event>) {
    const videoElement = e.currentTarget
    const error = videoElement.error
    if (error) {
      let errorMessage = 'Error al reproducir el video'
      switch (error.code) {
        case error.MEDIA_ERR_ABORTED:
          errorMessage = 'La reproducción fue abortada'
          break
        case error.MEDIA_ERR_NETWORK:
          errorMessage = 'Error de red al cargar el video'
          break
        case error.MEDIA_ERR_DECODE:
          errorMessage = 'Error al decodificar el video. El formato puede no ser compatible (debe ser H.264/MP4)'
          break
        case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = 'El formato del video no es compatible. Debe ser MP4 H.264'
          break
      }
      console.error('Error de video:', error, errorMessage)
      setError(errorMessage)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm"
        style={{ aspectRatio: '9/16' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
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

        {/* Video */}
        <div className="relative w-full h-full rounded-lg overflow-hidden" style={{ backgroundColor: '#000000' }}>
          {error && (
            <div className="absolute inset-0 flex items-center justify-center p-4 z-20" style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
              <div className="text-center">
                <p className="text-sm font-semibold mb-2" style={{ color: '#D4AF37' }}>
                  ⚠️ Error de Reproducción
                </p>
                <p className="text-xs mb-3" style={{ color: '#FFFFFF' }}>
                  {error}
                </p>
                <p className="text-xs" style={{ color: '#999' }}>
                  Asegúrate de que el video esté en formato MP4 H.264
                </p>
              </div>
            </div>
          )}
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            playsInline
            autoPlay
            preload="auto"
            className="w-full h-full"
            onPlay={() => {
              setIsPlaying(true)
              setError(null)
            }}
            onPause={() => setIsPlaying(false)}
            onError={handleError}
            onClick={(e) => e.stopPropagation()}
            {...{ 'webkit-playsinline': 'true' } as any}
          >
            Tu navegador no soporta la reproducción de videos.
          </video>
        </div>

        {/* Información del video */}
        {(video.title || video.description) && (
          <div className="mt-4 text-center">
            {video.title && (
              <h3 className="text-lg font-bold mb-1" style={{ color: '#D4AF37' }}>
                {video.title}
              </h3>
            )}
            {video.description && (
              <p className="text-sm" style={{ color: '#FFFFFF' }}>
                {video.description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

