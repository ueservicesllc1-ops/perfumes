'use client'

import { useState, useEffect } from 'react'
import { getAllPerfumes, getPerfumesByCategory, type Perfume } from '@/lib/firebase/perfumes'

export function usePerfumes(category?: string) {
  const [perfumes, setPerfumes] = useState<Perfume[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchPerfumes() {
      try {
        setLoading(true)
        setError(null)
        
        const data = category && category !== 'Todos'
          ? await getPerfumesByCategory(category)
          : await getAllPerfumes()
        
        setPerfumes(data)
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching perfumes:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPerfumes()
  }, [category])

  return { perfumes, loading, error }
}

