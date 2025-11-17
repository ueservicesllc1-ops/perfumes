import { useState, useEffect } from 'react'
import { getAllVideos } from '@/lib/firebase/videos'
import type { Video } from '@/lib/firebase/videos'

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true)
        setError(null)
        const data = await getAllVideos()
        setVideos(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error fetching videos'))
        console.error('Error fetching videos:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  return { videos, loading, error }
}

