'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Material } from '@/lib/firebase/materials'
import { deleteMaterial } from '@/lib/firebase/materials'
import { getImageUrl } from '@/lib/b2/storage'

interface AdminMaterialListProps {
  materials: Material[]
  onEdit: (material: Material) => void
  onRefresh: () => void
}

export default function AdminMaterialList({ materials, onEdit, onRefresh }: AdminMaterialListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de que quieres eliminar este material?')) {
      return
    }

    setDeletingId(id)
    try {
      await deleteMaterial(id)
      onRefresh()
    } catch (error: any) {
      alert('Error al eliminar: ' + error.message)
    } finally {
      setDeletingId(null)
    }
  }

  function getFileTypeIcon(fileType: string) {
    switch (fileType) {
      case 'image':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      case 'video':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )
      case 'pdf':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
    }
  }

  if (materials.length === 0) {
    return (
      <div className="text-center py-8">
        <p style={{ color: '#999' }}>No hay materiales de apoyo.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {materials.map((material) => {
        const thumbnailUrl = material.thumbnailUrl 
          ? (material.thumbnailUrl.startsWith('/api/b2') 
              ? material.thumbnailUrl 
              : getImageUrl(material.thumbnailUrl))
          : material.fileType === 'image' 
            ? (material.fileUrl.startsWith('/api/b2') 
                ? material.fileUrl 
                : getImageUrl(material.fileUrl))
            : null

        return (
          <motion.div
            key={material.id}
            className="p-3 rounded-lg flex items-center gap-3"
            style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}
            whileHover={{ backgroundColor: '#333' }}
          >
            {thumbnailUrl && (
              <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0" style={{ backgroundColor: '#1a1a1a' }}>
                <img
                  src={thumbnailUrl}
                  alt={material.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {!thumbnailUrl && (
              <div className="w-16 h-16 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#1a1a1a', color: '#D4AF37' }}>
                {getFileTypeIcon(material.fileType)}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold mb-1" style={{ color: '#D4AF37' }}>
                {material.title}
              </h4>
              <p className="text-xs mb-1" style={{ color: '#999' }}>
                {material.fileName} • {material.fileType.toUpperCase()}
              </p>
              {material.description && (
                <p className="text-xs line-clamp-1" style={{ color: '#ccc' }}>
                  {material.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => onEdit(material)}
                className="px-3 py-1.5 rounded text-xs font-medium"
                style={{ backgroundColor: '#D4AF37', color: '#000000' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Editar
              </motion.button>
              <motion.button
                onClick={() => material.id && handleDelete(material.id)}
                disabled={deletingId === material.id}
                className="px-3 py-1.5 rounded text-xs font-medium"
                style={{ 
                  backgroundColor: '#dc2626', 
                  color: '#FFFFFF',
                  opacity: deletingId === material.id ? 0.6 : 1
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {deletingId === material.id ? 'Eliminando...' : 'Eliminar'}
              </motion.button>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

