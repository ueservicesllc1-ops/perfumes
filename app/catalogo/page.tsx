'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PerfumeImage from '@/components/PerfumeImage'
import { usePerfumes } from '@/hooks/usePerfumes'
import { useCart } from '@/contexts/CartContext'
import type { Perfume } from '@/lib/firebase/perfumes'

export default function Catalogo() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos')
  const [selectedBrand, setSelectedBrand] = useState<string>('Todas')
  const [selectedCollection, setSelectedCollection] = useState<string>('Todas')
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)
  const [showBrandMenu, setShowBrandMenu] = useState(false)
  const { perfumes, loading, error } = usePerfumes(selectedCategory)
  const { addToCart } = useCart()
  const categoryMenuRef = useRef<HTMLDivElement>(null)
  const brandMenuRef = useRef<HTMLDivElement>(null)

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
        setShowCategoryMenu(false)
      }
      if (brandMenuRef.current && !brandMenuRef.current.contains(event.target as Node)) {
        setShowBrandMenu(false)
      }
    }

    if (showCategoryMenu || showBrandMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showCategoryMenu, showBrandMenu])

  // Datos de respaldo (fallback) si Firebase no está disponible
  const fallbackPerfumes: Perfume[] = [
    // For Her
    { id: '1', name: 'Arabiyat Ash\'aa Mauve Eau De Parfum', price: 69.99, category: 'For Her', size: '3.7FL.OZ', inStock: true },
    { id: '2', name: 'Arabiyat Lutfah First Love Eau De Parfum', price: 69.99, category: 'For Her', size: '2.7FL.OZ', inStock: true },
    { id: '3', name: 'Arabiyat Lutfah Light In The Heart Eau De Parfum', price: 59.99, category: 'For Her', size: '2.7FL.OZ', inStock: true },
    { id: '4', name: 'Arabiyat Prestige Ash\'aa Amethyst Eau De Parfum', price: 49.99, originalPrice: 64.99, category: 'For Her', size: '3.7FL.OZ', inStock: true },
    { id: '5', name: 'Arabiyat Prestige Bahiya Garnet Eau De Parfum', price: 49.99, originalPrice: 69.99, category: 'For Her', size: '3.4FL.OZ', inStock: true },
    { id: '6', name: 'Arabiyat Prestige Bahiya Ruby Eau De Parfum', price: 49.99, originalPrice: 69.99, category: 'For Her', size: '3.4FL.OZ', inStock: true },
    { id: '7', name: 'Arabiyat Prestige Bedour Eau De Parfum', price: 44.99, category: 'For Her', size: '3.4FL.OZ', inStock: true },
    { id: '8', name: 'Arabiyat Prestige La Di Da Eau De Parfum', price: 49.99, category: 'For Her', size: '3.4FL.OZ', inStock: true },
    { id: '9', name: 'Arabiyat Prestige Lady Bird Eau De Parfum', price: 34.99, originalPrice: 59.99, category: 'For Her', size: '3.4FL.OZ', inStock: true },
    { id: '10', name: 'Arabiyat Prestige Lady Glamor Eau De Parfum', price: 48.99, originalPrice: 69.99, category: 'For Her', size: '3.4LF.OZ', inStock: true },
    { id: '11', name: 'Arabiyat Prestige Nayel Queen EAu De Parfum', price: 44.99, originalPrice: 59.99, category: 'For Her', size: '2.4FL.OZ', inStock: true },
    { id: '12', name: 'Arabiyat Prestige Nisma Eau De Parfum', price: 48.99, originalPrice: 54.99, category: 'For Her', size: '2.7FL.OZ', inStock: true },
    { id: '13', name: 'Arabiyat Prestige Nyla Eau De Parfum', price: 34.99, originalPrice: 49.99, category: 'For Her', size: '2.7FL.OZ', inStock: true },
    
    // For Him
    { id: '14', name: 'Arabiyat Prestige Aariz Intense Eau De Parfum', price: 44.99, category: 'For Him', size: '3.4FL.OZ', inStock: true },
    { id: '15', name: 'Arabiyat Prestige Aariz L\'absolu Eau De Parfum', price: 52.99, originalPrice: 74.99, category: 'For Him', size: '3.4FL.OZ', inStock: true },
    { id: '16', name: 'Arabiyat Prestige Marwa Eau De Parfum', price: 49.99, originalPrice: 59.99, category: 'For Him', size: '3.4FL.OZ', inStock: true },
    { id: '17', name: 'Arabiyat Prestige La-Di-Da Eau De Parfum', price: 49.99, category: 'For Him', size: '3.4FL.OZ', inStock: false },
    
    // For Both
    { id: '18', name: 'Arabiyat Elham Concentrated Perfume Oil', price: 19.99, category: 'For Both', size: '0.40FL.OZ', inStock: true },
    { id: '19', name: 'Arabiyat Intense Musk Concentrated Perfume Oil', price: 19.99, category: 'For Both', size: '0.40 FL.OZ', inStock: true },
    { id: '20', name: 'Arabiyat Jawharat Al Hayat Eau De Parfum', price: 49.99, category: 'For Both', size: '3.4FL.OZ', inStock: true },
    { id: '21', name: 'Arabiyat Jawharat Al Hayat Concentrated Perfume Oil', price: 19.99, category: 'For Both', size: '0.40FL.OZ', inStock: true },
    { id: '22', name: 'Arabiyat Lamsat Harir Concentrated Perfume Oil', price: 19.99, category: 'For Both', size: '0.40FL.OZ', inStock: true },
    { id: '23', name: 'Arabiyat Musk Tahira Concentrated Perfume Oil', price: 19.99, category: 'For Both', size: '0.40FL.OZ', inStock: true },
    { id: '24', name: 'Arabiyat Oud Al Layl Concentrated Perfume Oil', price: 19.99, category: 'For Both', size: '0.40FL.OZ', inStock: true },
    { id: '25', name: 'Arabiyat Prestige Al Dhahab Eau De Parfum', price: 47.99, originalPrice: 69.99, category: 'For Both', size: '3.4FL.OZ', inStock: true },
    { id: '26', name: 'Arabiyat Prestige Al Noor Eau De Parfum', price: 44.99, category: 'For Both', size: '3.4FL.OZ', inStock: true },
    { id: '27', name: 'Arabiyat Prestige Black Current Lolly Eau De Parfum', price: 59.99, category: 'For Both', size: '3.4FL.OZ', inStock: true },
    { id: '28', name: 'Arabiyat Prestige Hypnotic Vanilla Eau De Parfum', price: 47.99, category: 'For Both', size: '3.4FL.OZ', inStock: true },
    { id: '29', name: 'Arabiyat Prestige Lava Lush Eau De Parfum', price: 54.99, category: 'For Both', size: '3.4FL.OZ', inStock: true },
    { id: '30', name: 'Arabiyat Prestige Lychee Musk Eau De Parfume', price: 37.99, category: 'For Both', size: '3.4FL.OZ', inStock: false },
    { id: '31', name: 'Arabiyat Prestige Nayel Oud Eau De Parfum', price: 49.99, category: 'For Both', size: '2.4FL.OZ', inStock: true },
    { id: '32', name: 'Arabiyat Prestige Omniya Eau De Parfum', price: 69.99, category: 'For Both', size: '3.4FL.OZ', inStock: true },
  ]

  const categories = ['Todos', 'For Her', 'For Him', 'For Both']

  // Función para extraer la marca del nombre del perfume
  const getBrandFromName = (name: string): string => {
    if (name.includes('Arabiyat Prestige')) {
      return 'Arabiyat Prestige'
    } else if (name.includes('Arabiyat')) {
      return 'Arabiyat'
    }
    return 'Otras'
  }

  // Función para extraer la colección del nombre del perfume
  const getCollectionFromName = (name: string): string => {
    // Remover "Arabiyat" y "Prestige" del nombre
    let cleanName = name.replace(/Arabiyat\s*Prestige\s*/gi, '').replace(/Arabiyat\s*/gi, '')
    // Remover "Eau De Parfum" y variaciones
    cleanName = cleanName.replace(/\s*Eau\s*De\s*Parfum.*/gi, '').replace(/\s*Eau\s*De\s*Parfume.*/gi, '')
    // Extraer la primera palabra o palabras que forman la colección
    // Ejemplos: "Ash'aa", "Lutfah", "Bahiya", "Bedour", etc.
    const words = cleanName.trim().split(/\s+/)
    if (words.length >= 1) {
      // Tomar la primera palabra como colección
      return words[0]
    }
    return 'General'
  }

  // Usar datos de Firebase si están disponibles, sino usar fallback
  const displayPerfumes = perfumes.length > 0 ? perfumes : fallbackPerfumes
  
  // Obtener todas las marcas únicas
  const allBrands = Array.from(new Set(displayPerfumes.map(p => p.brand || getBrandFromName(p.name))))
  const brands = ['Todas', ...allBrands.sort()]

  // Obtener colecciones de la marca seleccionada
  const brandPerfumes = selectedBrand === 'Todas' 
    ? displayPerfumes 
    : displayPerfumes.filter(p => {
        const brand = p.brand || getBrandFromName(p.name)
        return brand === selectedBrand
      })

  const allCollections = Array.from(new Set(brandPerfumes.map(p => getCollectionFromName(p.name))))
  const collections = ['Todas', ...allCollections.sort()]

  // Filtrar por categoría, marca y colección
  const filteredPerfumes = displayPerfumes.filter(p => {
    const categoryMatch = selectedCategory === 'Todos' || p.category === selectedCategory
    const brand = p.brand || getBrandFromName(p.name)
    const brandMatch = selectedBrand === 'Todas' || brand === selectedBrand
    const collection = getCollectionFromName(p.name)
    const collectionMatch = selectedCollection === 'Todas' || collection === selectedCollection
    return categoryMatch && brandMatch && collectionMatch
  })

  // Resetear colección cuando cambia la marca
  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand)
    setSelectedCollection('Todas')
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#182B21', color: '#F8F5EF' }}>
      <Header />
      
      <main className="max-w-sm mx-auto pt-16 px-4 pb-24">
        {/* Título */}
        <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-2xl font-bold text-center mb-2" 
            style={{ color: '#D4AF37' }}
            whileHover={{ scale: 1.05 }}
          >
            Catálogo de Perfumes
          </motion.h1>
        </motion.section>

        {/* Botones de Filtro - Unidos */}
        <section className="mb-4">
          <div className="flex">
            {/* Botón Categorías */}
            <div className="flex-1 relative" ref={categoryMenuRef}>
              <motion.button
                onClick={() => {
                  setShowCategoryMenu(!showCategoryMenu)
                  setShowBrandMenu(false)
                }}
                className="w-full px-4 py-3 rounded-none text-sm font-medium"
                style={selectedCategory !== 'Todos' ? {
                  backgroundColor: '#D4AF37',
                  color: '#000000',
                } : {
                  backgroundColor: '#344A3D',
                  color: '#D4AF37',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Categorías
                <svg 
                  className={`w-4 h-4 inline-block ml-2 transition-transform ${showCategoryMenu ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>
              
              {/* Menú desplegable de Categorías */}
              {showCategoryMenu && (
                <div 
                  className="absolute top-full left-0 right-0 z-20 mt-1 rounded-none overflow-hidden"
                  style={{ 
                    backgroundColor: '#344A3D',
                    border: '1px solid #D4AF37',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat)
                        setShowCategoryMenu(false)
                      }}
                      className="w-full px-4 py-3 text-left text-sm font-medium transition-all active:scale-95 border-b border-b-[#444] last:border-b-0"
                      style={selectedCategory === cat ? {
                        backgroundColor: '#D4AF37',
                        color: '#000000',
                      } : {
                        backgroundColor: '#344A3D',
                        color: '#D4AF37',
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Botón Marcas */}
            <div className="flex-1 relative" ref={brandMenuRef}>
              <motion.button
                onClick={() => {
                  setShowBrandMenu(!showBrandMenu)
                  setShowCategoryMenu(false)
                }}
                className="w-full px-4 py-3 rounded-none text-sm font-medium"
                style={selectedBrand !== 'Todas' ? {
                  backgroundColor: '#D4AF37',
                  color: '#000000',
                } : {
                  backgroundColor: '#344A3D',
                  color: '#D4AF37',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Marcas
                <svg 
                  className={`w-4 h-4 inline-block ml-2 transition-transform ${showBrandMenu ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>
              
              {/* Menú desplegable de Marcas */}
              {showBrandMenu && (
                <div 
                  className="absolute top-full left-0 right-0 z-20 mt-1 rounded-none overflow-hidden max-h-64 overflow-y-auto"
                  style={{ 
                    backgroundColor: '#344A3D',
                    border: '1px solid #D4AF37',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => {
                        handleBrandChange(brand)
                        setShowBrandMenu(false)
                      }}
                      className="w-full px-4 py-3 text-left text-sm font-medium transition-all active:scale-95 border-b border-b-[#444] last:border-b-0"
                      style={selectedBrand === brand ? {
                        backgroundColor: '#D4AF37',
                        color: '#000000',
                      } : {
                        backgroundColor: '#344A3D',
                        color: '#D4AF37',
                      }}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Colecciones - Solo se muestra si hay una marca seleccionada */}
        {selectedBrand !== 'Todas' && collections.length > 1 && (
          <section className="mb-6">
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {collections.map((collection, index) => (
                <motion.button
                  key={collection}
                  onClick={() => setSelectedCollection(collection)}
                  className="px-4 py-2 rounded-none text-sm font-medium whitespace-nowrap"
                  style={selectedCollection === collection ? {
                    backgroundColor: '#D4AF37',
                    color: '#000000',
                    boxShadow: '0 2px 8px rgba(212, 175, 55, 0.4)'
                  } : {
                    backgroundColor: '#344A3D',
                    color: '#D4AF37',
                    border: '1px solid rgba(212, 175, 55, 0.3)'
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {collection}
                </motion.button>
              ))}
            </div>
          </section>
        )}

        {/* Estado de carga */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#D4AF37' }}></div>
            <p className="mt-4" style={{ color: '#999' }}>Cargando perfumes...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
            <p className="text-sm" style={{ color: '#D4AF37' }}>
              Error al cargar perfumes. Mostrando datos locales.
            </p>
          </div>
        )}

        {/* Grid de Perfumes */}
        {!loading && (
          <section className="mb-6">
            {filteredPerfumes.length === 0 ? (
              <div className="text-center py-12">
                <p style={{ color: '#999' }}>No hay perfumes disponibles en esta categoría.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredPerfumes.map((perfume, index) => (
                  <motion.div
                    key={perfume.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <motion.div
                      whileHover={{ 
                        y: -8,
                        scale: 1.02,
                        boxShadow: '0 12px 30px rgba(212, 175, 55, 0.4)',
                        transition: { duration: 0.3 }
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href={`/producto/${perfume.id}`}
                        className="block overflow-hidden rounded-lg h-full flex flex-col"
                        style={{ 
                          backgroundColor: '#344A3D',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                        }}
                      >
                        {/* Imagen del perfume */}
                        <div className="h-32 relative" style={{ backgroundColor: '#344A3D' }}>
                          <PerfumeImage 
                            imageUrl={perfume.imageUrl} 
                            perfumeName={perfume.name}
                            className="h-32"
                          />
                          {!perfume.inStock && (
                            <div className="absolute top-1 right-1 z-10">
                              <span 
                                className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full"
                                style={{ 
                                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                  color: '#D4AF37',
                                  border: '1px solid #D4AF37'
                                }}
                              >
                                Agotado
                              </span>
                            </div>
                          )}
                          {perfume.originalPrice && (
                            <div className="absolute top-1 left-1 z-10">
                              <span 
                                className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full"
                                style={{ 
                                  backgroundColor: '#D4AF37',
                                  color: '#000000'
                                }}
                              >
                                Oferta
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Información del perfume */}
                        <div className="p-2 flex-1 flex flex-col justify-between min-h-[80px]">
                          <h3 className="font-medium text-[10px] mb-1 line-clamp-2 leading-tight" style={{ color: '#F8F5EF' }}>
                            {perfume.name}
                          </h3>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center space-x-1 flex-wrap">
                              <span className="text-[11px] font-bold" style={{ color: '#D4AF37' }}>
                                ${perfume.price.toFixed(2)}
                              </span>
                              {perfume.originalPrice && (
                                <span className="text-[9px] line-through" style={{ color: '#666' }}>
                                  ${perfume.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                            <button
                              disabled={!perfume.inStock}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                if (perfume.inStock) {
                                  addToCart(perfume)
                                }
                              }}
                              className={`px-2 py-1 rounded text-[9px] font-medium transition-all ${
                                perfume.inStock
                                  ? 'active:scale-95'
                                  : 'cursor-not-allowed'
                              }`}
                              style={perfume.inStock ? {
                                backgroundColor: '#D4AF37',
                                color: '#000000',
                                whiteSpace: 'nowrap',
                                border: 'none',
                                cursor: 'pointer'
                              } : {
                                backgroundColor: '#333',
                                color: '#666',
                                whiteSpace: 'nowrap',
                                border: 'none'
                              }}
                            >
                              {perfume.inStock ? 'Agregar' : 'Agotado'}
                            </button>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Footer info */}
        {!loading && (
          <div className="text-center py-4 text-xs">
            <p style={{ color: '#666' }}>Mostrando {filteredPerfumes.length} productos</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
