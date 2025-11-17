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

  useEffect(() => {
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  useEffect(() => {
    // Pausar video cuando se cierra el modal
    return () => {
      if (videoRef.current) {
        videoRef.current.pause()
      }
    }
  }, [])

  function handlePlay() {
    if (videoRef.current) {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  function handlePause() {
    if (videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  function handlePlayPause() {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  // Usar URL directa de B2 para mejor compatibilidad con iOS/Safari
  const videoUrl = getVideoUrl(video.videoUrl)

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
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            playsInline
            preload="metadata"
            className="w-full h-full"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onClick={(e) => e.stopPropagation()}
            {...{ 'webkit-playsinline': 'true' } as any}
          >
            Tu navegador no soporta la reproducción de videos.
          </video>
          
          {/* Botón de reproducir centrado */}
          {!isPlaying && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handlePlay()
              }}
              className="absolute inset-0 flex items-center justify-center z-10"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center transition-all active:scale-95"
                style={{
                  backgroundColor: 'rgba(212, 175, 55, 0.9)',
                  color: '#000000',
                }}
              >
                <svg
                  className="w-12 h-12 ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
          )}
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

