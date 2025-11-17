'use client'

import { useState } from 'react'
import type { Video } from '@/lib/firebase/videos'
import { getImageUrl } from '@/lib/b2/storage'
import { deleteVideo } from '@/lib/firebase/videos'

interface AdminVideoListProps {
  videos: Video[]
  onEdit: (video: Video) => void
  onRefresh: () => void
}

export default function AdminVideoList({ videos, onEdit, onRefresh }: AdminVideoListProps) {
  const [deleting, setDeleting] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  async function handleDelete(videoId: string) {
    if (!confirm('¿Estás seguro de que deseas eliminar este video?')) {
      return
    }

    setDeleting(videoId)
    try {
      await deleteVideo(videoId)
      onRefresh()
    } catch (error) {
      console.error('Error eliminando video:', error)
      alert('Error al eliminar el video')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      {/* Search - Mobile Optimized */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar videos..."
          className="w-full px-3 py-2 rounded-lg text-sm"
          style={{ backgroundColor: '#2a2a2a', color: '#FFFFFF', border: '1px solid #444' }}
        />
      </div>

      {/* Stats - Mobile Optimized */}
      <div className="mb-4">
        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}>
          <p className="text-xs mb-1" style={{ color: '#999' }}>Total de Videos</p>
          <p className="text-lg font-bold" style={{ color: '#D4AF37' }}>{videos.length}</p>
        </div>
      </div>

      {/* Video List - Mobile Optimized */}
      <div className="space-y-3">
        {filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm" style={{ color: '#999' }}>No se encontraron videos</p>
          </div>
        ) : (
          filteredVideos.map((video) => {
            const thumbnailUrl = video.thumbnailUrl 
              ? (video.thumbnailUrl.startsWith('/api/b2') 
                  ? video.thumbnailUrl 
                  : getImageUrl(video.thumbnailUrl))
              : null

            return (
              <div
                key={video.id}
                className="p-3 rounded-lg"
                style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}
              >
                <div className="flex gap-3">
                  {/* Thumbnail */}
                  <div className="w-20 h-32 flex-shrink-0 rounded overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
                    {thumbnailUrl ? (
                      <img
                        src={thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8"
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
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2" style={{ color: '#FFFFFF' }}>
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-xs mb-2 line-clamp-2" style={{ color: '#999' }}>
                        {video.description}
                      </p>
                    )}
                    
                    {/* Actions - Mobile Optimized */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(video)}
                        className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95"
                        style={{ backgroundColor: '#D4AF37', color: '#000000' }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => video.id && handleDelete(video.id)}
                        disabled={deleting === video.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95"
                        style={{
                          backgroundColor: '#2a2a2a',
                          color: '#ef4444',
                          border: '1px solid #444',
                          opacity: deleting === video.id ? 0.6 : 1
                        }}
                      >
                        {deleting === video.id ? '...' : 'Eliminar'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

