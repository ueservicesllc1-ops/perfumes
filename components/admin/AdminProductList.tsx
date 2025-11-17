'use client'

import { useState } from 'react'
import type { Perfume } from '@/lib/firebase/perfumes'
import PerfumeImage from '@/components/PerfumeImage'
import { deletePerfume } from '@/lib/firebase/perfumes'

interface AdminProductListProps {
  perfumes: Perfume[]
  onEdit: (perfume: Perfume) => void
  onRefresh: () => void
}

export default function AdminProductList({ perfumes, onEdit, onRefresh }: AdminProductListProps) {
  const [deleting, setDeleting] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPerfumes = perfumes.filter(perfume =>
    perfume.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  async function handleDelete(perfumeId: string) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return
    }

    setDeleting(perfumeId)
    try {
      await deletePerfume(perfumeId)
      onRefresh()
    } catch (error) {
      console.error('Error eliminando producto:', error)
      alert('Error al eliminar el producto')
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
          placeholder="Buscar..."
          className="w-full px-3 py-2 rounded-lg text-sm"
          style={{ backgroundColor: '#2a2a2a', color: '#FFFFFF', border: '1px solid #444' }}
        />
      </div>

      {/* Stats - Mobile Optimized */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}>
          <p className="text-xs mb-1" style={{ color: '#999' }}>Total</p>
          <p className="text-lg font-bold" style={{ color: '#D4AF37' }}>{perfumes.length}</p>
        </div>
        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}>
          <p className="text-xs mb-1" style={{ color: '#999' }}>Stock</p>
          <p className="text-lg font-bold" style={{ color: '#D4AF37' }}>
            {perfumes.filter(p => p.inStock).length}
          </p>
        </div>
        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}>
          <p className="text-xs mb-1" style={{ color: '#999' }}>Sin Stock</p>
          <p className="text-lg font-bold" style={{ color: '#D4AF37' }}>
            {perfumes.filter(p => !p.inStock).length}
          </p>
        </div>
      </div>

      {/* Product List - Mobile Optimized */}
      <div className="space-y-3">
        {filteredPerfumes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm" style={{ color: '#999' }}>No se encontraron productos</p>
          </div>
        ) : (
          filteredPerfumes.map((perfume) => (
            <div
              key={perfume.id}
              className="p-3 rounded-lg"
              style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}
            >
              <div className="flex gap-3">
                {/* Image */}
                <div className="w-16 h-16 flex-shrink-0">
                  <PerfumeImage
                    imageUrl={perfume.imageUrl}
                    perfumeName={perfume.name}
                    className="w-full h-full"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2" style={{ color: '#FFFFFF' }}>
                    {perfume.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-sm font-bold" style={{ color: '#D4AF37' }}>${perfume.price.toFixed(2)}</span>
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                      style={{
                        backgroundColor: perfume.inStock ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: perfume.inStock ? '#22c55e' : '#ef4444'
                      }}
                    >
                      {perfume.inStock ? 'Stock' : 'Sin Stock'}
                    </span>
                    <span className="text-xs" style={{ color: '#999' }}>{perfume.category}</span>
                  </div>
                  
                  {/* Actions - Mobile Optimized */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(perfume)}
                      className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95"
                      style={{ backgroundColor: '#D4AF37', color: '#000000' }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => perfume.id && handleDelete(perfume.id)}
                      disabled={deleting === perfume.id}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95"
                      style={{
                        backgroundColor: '#2a2a2a',
                        color: '#ef4444',
                        border: '1px solid #444',
                        opacity: deleting === perfume.id ? 0.6 : 1
                      }}
                    >
                      {deleting === perfume.id ? '...' : 'Eliminar'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

