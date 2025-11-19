'use client'

import { useState, useEffect, useRef } from 'react'
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
  const [selectedBrand, setSelectedBrand] = useState<string>('Todas')
  const [selectedCollection, setSelectedCollection] = useState<string>('Todas')
  const [showBrandMenu, setShowBrandMenu] = useState(false)
  const [showCollectionMenu, setShowCollectionMenu] = useState(false)
  const brandMenuRef = useRef<HTMLDivElement>(null)
  const collectionMenuRef = useRef<HTMLDivElement>(null)

  // Función para extraer la marca del nombre del perfume
  const getBrandFromName = (name: string): string => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes('arabiyat')) {
      return 'Arabiyat'
    }
    if (lowerName.includes('armaf')) {
      return 'Armaf'
    }
    // Si el producto tiene brand en el objeto, usarlo
    return 'Otras'
  }

  // Función para extraer la colección del nombre del perfume
  const getCollectionFromName = (name: string): string => {
    const lowerName = name.toLowerCase()
    
    // Solo Arabiyat tiene colecciones definidas
    if (lowerName.includes('arabiyat sugar')) {
      return 'Sugar'
    }
    if (lowerName.includes('arabiyat prestige')) {
      return 'Prestige'
    }
    if (lowerName.includes('arabiyat ash')) {
      return 'Ash\'aa'
    }
    
    if (lowerName.includes('arabiyat')) {
      return 'General'
    }
    
    // Para otras marcas, usar "General" como colección por defecto
    return 'General'
  }

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (brandMenuRef.current && !brandMenuRef.current.contains(event.target as Node)) {
        setShowBrandMenu(false)
      }
      if (collectionMenuRef.current && !collectionMenuRef.current.contains(event.target as Node)) {
        setShowCollectionMenu(false)
      }
    }

    if (showBrandMenu || showCollectionMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showBrandMenu, showCollectionMenu])

  // Obtener todas las marcas únicas
  const allBrands = Array.from(new Set(perfumes.map(p => {
    let brand = p.brand || getBrandFromName(p.name)
    // Normalizar marcas
    if (brand.toLowerCase().includes('arabiyat')) {
      brand = 'Arabiyat'
    } else if (brand.toLowerCase().includes('armaf')) {
      brand = 'Armaf'
    }
    return brand || 'Otras'
  })))
  const brands = ['Todas', ...allBrands.sort()]

  // Obtener colecciones de la marca seleccionada
  const brandPerfumes = selectedBrand === 'Todas' 
    ? perfumes 
    : perfumes.filter(p => {
        let brand = p.brand || getBrandFromName(p.name)
        // Normalizar marcas
        if (brand.toLowerCase().includes('arabiyat')) {
          brand = 'Arabiyat'
        } else if (brand.toLowerCase().includes('armaf')) {
          brand = 'Armaf'
        }
        return brand === selectedBrand
      })

  const allCollections = Array.from(new Set(brandPerfumes.map(p => {
    return getCollectionFromName(p.name)
  })))
  const collections = ['Todas', ...allCollections.sort()]

  // Resetear colección cuando cambia la marca
  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand)
    setSelectedCollection('Todas')
    setShowBrandMenu(false)
    setShowCollectionMenu(false)
  }

  // Filtrar por búsqueda, marca y colección
  const filteredPerfumes = perfumes.filter(perfume => {
    const searchMatch = perfume.name.toLowerCase().includes(searchTerm.toLowerCase())
    let brand = perfume.brand || getBrandFromName(perfume.name)
    // Normalizar marcas
    if (brand.toLowerCase().includes('arabiyat')) {
      brand = 'Arabiyat'
    } else if (brand.toLowerCase().includes('armaf')) {
      brand = 'Armaf'
    }
    const brandMatch = selectedBrand === 'Todas' || brand === selectedBrand
    const collection = getCollectionFromName(perfume.name)
    const collectionMatch = selectedCollection === 'Todas' || collection === selectedCollection
    return searchMatch && brandMatch && collectionMatch
  })

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

      {/* Filters - Brand and Collection */}
      <div className="mb-4 flex gap-2">
        {/* Brand Filter */}
        <div className="flex-1 relative" ref={brandMenuRef}>
          <button
            onClick={() => {
              setShowBrandMenu(!showBrandMenu)
              setShowCollectionMenu(false)
            }}
            className="w-full px-3 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 flex items-center justify-between"
            style={{
              backgroundColor: selectedBrand !== 'Todas' ? '#D4AF37' : '#2a2a2a',
              color: selectedBrand !== 'Todas' ? '#000000' : '#FFFFFF',
              border: `1px solid ${selectedBrand !== 'Todas' ? '#D4AF37' : '#444'}`
            }}
          >
            <span>{selectedBrand}</span>
            <svg 
              className={`w-4 h-4 transition-transform ${showBrandMenu ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showBrandMenu && (
            <div 
              className="absolute top-full left-0 right-0 z-20 mt-1 rounded-lg overflow-hidden max-h-60 overflow-y-auto"
              style={{ 
                backgroundColor: '#2a2a2a',
                border: '1px solid #444',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
              }}
            >
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => handleBrandChange(brand)}
                  className="w-full px-3 py-2 text-left text-sm transition-colors"
                  style={{
                    backgroundColor: selectedBrand === brand ? '#D4AF37' : '#2a2a2a',
                    color: selectedBrand === brand ? '#000000' : '#FFFFFF'
                  }}
                >
                  {brand}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Collection Filter - Only show if a brand is selected and has collections */}
        {selectedBrand !== 'Todas' && selectedBrand === 'Arabiyat' && collections.length > 1 && (
          <div className="flex-1 relative" ref={collectionMenuRef}>
            <button
              onClick={() => {
                setShowCollectionMenu(!showCollectionMenu)
                setShowBrandMenu(false)
              }}
              className="w-full px-3 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 flex items-center justify-between"
              style={{
                backgroundColor: selectedCollection !== 'Todas' ? '#D4AF37' : '#2a2a2a',
                color: selectedCollection !== 'Todas' ? '#000000' : '#FFFFFF',
                border: `1px solid ${selectedCollection !== 'Todas' ? '#D4AF37' : '#444'}`
              }}
            >
              <span>{selectedCollection}</span>
              <svg 
                className={`w-4 h-4 transition-transform ${showCollectionMenu ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showCollectionMenu && (
              <div 
                className="absolute top-full left-0 right-0 z-20 mt-1 rounded-lg overflow-hidden max-h-60 overflow-y-auto"
                style={{ 
                  backgroundColor: '#2a2a2a',
                  border: '1px solid #444',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
                }}
              >
                {collections.map((collection) => (
                  <button
                    key={collection}
                    onClick={() => {
                      setSelectedCollection(collection)
                      setShowCollectionMenu(false)
                    }}
                    className="w-full px-3 py-2 text-left text-sm transition-colors"
                    style={{
                      backgroundColor: selectedCollection === collection ? '#D4AF37' : '#2a2a2a',
                      color: selectedCollection === collection ? '#000000' : '#FFFFFF'
                    }}
                  >
                    {collection}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats - Mobile Optimized */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}>
          <p className="text-xs mb-1" style={{ color: '#999' }}>Mostrando</p>
          <p className="text-lg font-bold" style={{ color: '#D4AF37' }}>{filteredPerfumes.length}</p>
        </div>
        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}>
          <p className="text-xs mb-1" style={{ color: '#999' }}>Stock</p>
          <p className="text-lg font-bold" style={{ color: '#D4AF37' }}>
            {filteredPerfumes.filter(p => p.inStock).length}
          </p>
        </div>
        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}>
          <p className="text-xs mb-1" style={{ color: '#999' }}>Sin Stock</p>
          <p className="text-lg font-bold" style={{ color: '#D4AF37' }}>
            {filteredPerfumes.filter(p => !p.inStock).length}
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

