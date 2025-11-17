'use client'

import { useState } from 'react'
import type { Video } from '@/lib/firebase/videos'
import { getImageUrl } from '@/lib/b2/storage'
import VideoModal from './VideoModal'

interface VideoGalleryProps {
  videos: Video[]
}

export default function VideoGallery({ videos }: VideoGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  // Mostrar solo los primeros 3 videos
  const displayVideos = videos.slice(0, 3)

  if (displayVideos.length === 0) {
    return null
  }

  return (
    <>
      <section className="px-4 -mt-2 pb-6">
        <div className="flex gap-3 justify-center">
          {displayVideos.map((video) => {
            const thumbnailUrl = video.thumbnailUrl 
              ? (video.thumbnailUrl.startsWith('/api/b2') 
                  ? video.thumbnailUrl 
                  : getImageUrl(video.thumbnailUrl))
              : null

            return (
              <button
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                className="flex-shrink-0 w-[calc(33.333%-8px)] aspect-[9/16] rounded-lg overflow-hidden relative group"
                style={{
                  backgroundColor: '#2a2a2a',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12"
                      style={{ color: '#D4AF37' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                )}
                {/* Overlay con título */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2"
                >
                  <p className="text-xs font-medium text-white line-clamp-2">
                    {video.title}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </>
  )
}

