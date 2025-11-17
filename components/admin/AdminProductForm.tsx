'use client'

import { useState, useEffect } from 'react'
import type { Perfume } from '@/lib/firebase/perfumes'
import { addPerfume, updatePerfume } from '@/lib/firebase/perfumes'
import { uploadPerfumeImage } from '@/lib/b2/storage'
import PerfumeImage from '@/components/PerfumeImage'

interface AdminProductFormProps {
  perfume: Perfume | null
  onClose: () => void
  onSuccess: () => void
}

export default function AdminProductForm({ perfume, onClose, onSuccess }: AdminProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'For Both' as 'For Her' | 'For Him' | 'For Both',
    brand: '',
    size: '',
    inStock: true,
    description: '',
    imageUrl: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  useEffect(() => {
    if (perfume) {
      setFormData({
        name: perfume.name || '',
        price: perfume.price?.toString() || '',
        originalPrice: perfume.originalPrice?.toString() || '',
        category: perfume.category || 'For Both',
        brand: perfume.brand || '',
        size: perfume.size || '',
        inStock: perfume.inStock ?? true,
        description: perfume.description || '',
        imageUrl: perfume.imageUrl || '',
      })
      setImagePreview(perfume.imageUrl || '')
    }
  }, [perfume])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      // Solo crear preview local para mostrar, no usar data URL en PerfumeImage
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleImageUpload() {
    if (!imageFile) {
      alert('Por favor selecciona una imagen')
      return
    }

    // Si no hay perfume.id, necesitamos un ID temporal para la subida
    // Usaremos un ID temporal basado en timestamp
    const tempId = perfume?.id || `temp-${Date.now()}`

    setUploadingImage(true)
    try {
      // Subir imagen a B2 primero
      const imageUrl = await uploadPerfumeImage(imageFile, tempId)
      // Actualizar formData con la URL de B2
      setFormData(prev => ({ ...prev, imageUrl }))
      // Limpiar el archivo y el preview local
      setImageFile(null)
      setImagePreview('')
      alert('Imagen subida exitosamente a B2')
    } catch (error) {
      console.error('Error subiendo imagen:', error)
      alert('Error al subir la imagen: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setUploadingImage(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      let finalImageUrl = formData.imageUrl

      // Construir objeto de datos, solo incluyendo campos con valores
      const perfumeData: any = {
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        inStock: formData.inStock,
      }
      
      // Agregar campos opcionales solo si tienen valor
      if (formData.originalPrice && formData.originalPrice.trim()) {
        perfumeData.originalPrice = parseFloat(formData.originalPrice)
      }
      if (formData.brand && formData.brand.trim()) {
        perfumeData.brand = formData.brand
      }
      if (formData.size && formData.size.trim()) {
        perfumeData.size = formData.size
      }
      if (formData.description && formData.description.trim()) {
        perfumeData.description = formData.description
      }
      // Solo incluir imageUrl si tiene un valor válido (URL de B2, no data URL)
      if (finalImageUrl && finalImageUrl.trim() && !finalImageUrl.startsWith('data:')) {
        perfumeData.imageUrl = finalImageUrl
      }

      let productId: string

      if (perfume?.id) {
        // Actualizar producto existente
        productId = perfume.id
        // Si hay una imagen nueva, subirla primero con el ID del producto
        if (imageFile) {
          try {
            finalImageUrl = await uploadPerfumeImage(imageFile, productId)
            perfumeData.imageUrl = finalImageUrl
          } catch (error) {
            console.error('Error subiendo imagen:', error)
            alert('Error al subir la imagen. Por favor intenta de nuevo.')
            setLoading(false)
            return
          }
        }
        await updatePerfume(productId, perfumeData)
      } else {
        // Crear nuevo producto primero
        productId = await addPerfume(perfumeData)
        
        // Si hay una imagen nueva, subirla después de crear el producto con el ID real
        if (imageFile) {
          try {
            finalImageUrl = await uploadPerfumeImage(imageFile, productId)
            await updatePerfume(productId, { imageUrl: finalImageUrl })
          } catch (error) {
            console.error('Error subiendo imagen después de crear producto:', error)
            // Continuar aunque falle la subida de imagen
          }
        }
      }

      onSuccess()
    } catch (error) {
      console.error('Error guardando producto:', error)
      alert('Error al guardar el producto: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-1" style={{ color: '#D4AF37' }}>
          {perfume ? 'Editar Producto' : 'Nuevo Producto'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Section - Mobile Optimized */}
        <div className="p-4 rounded-lg" style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: '#D4AF37' }}>Imagen</h3>
          
          {/* Preview */}
          {imagePreview && imagePreview.startsWith('data:') ? (
            // Preview local de imagen nueva (data URL)
            <div className="mb-3 w-32 h-32 mx-auto relative overflow-hidden rounded-lg" style={{ backgroundColor: '#1a1a1a' }}>
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-contain p-1"
              />
            </div>
          ) : formData.imageUrl ? (
            // Imagen de B2 (usar PerfumeImage)
            <div className="mb-3 w-32 h-32 mx-auto">
              <PerfumeImage
                imageUrl={formData.imageUrl}
                perfumeName={formData.name || 'Producto'}
                className="w-full h-full"
              />
            </div>
          ) : null}

          {/* Upload */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#D4AF37' }}>
                Seleccionar Imagen
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ backgroundColor: '#1a1a1a', color: '#FFFFFF', border: '1px solid #444' }}
              />
            </div>

            {imageFile && (
              <button
                type="button"
                onClick={handleImageUpload}
                disabled={uploadingImage}
                className="w-full px-3 py-2 rounded-lg text-xs font-medium transition-all active:scale-95"
                style={{
                  backgroundColor: '#D4AF37',
                  color: '#000000',
                  opacity: uploadingImage ? 0.6 : 1
                }}
              >
                {uploadingImage ? 'Subiendo a B2...' : 'Subir Imagen a B2'}
              </button>
            )}

          </div>
        </div>

        {/* Basic Info - Mobile Optimized */}
        <div className="p-4 rounded-lg space-y-3" style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: '#D4AF37' }}>Información</h3>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#D4AF37' }}>
              Nombre del Producto *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ backgroundColor: '#1a1a1a', color: '#FFFFFF', border: '1px solid #444' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#D4AF37' }}>
                Precio *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                step="0.01"
                min="0"
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ backgroundColor: '#1a1a1a', color: '#FFFFFF', border: '1px solid #444' }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#D4AF37' }}>
                Precio Original
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ backgroundColor: '#1a1a1a', color: '#FFFFFF', border: '1px solid #444' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#D4AF37' }}>
              Categoría *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ backgroundColor: '#1a1a1a', color: '#FFFFFF', border: '1px solid #444' }}
            >
              <option value="For Her">For Her</option>
              <option value="For Him">For Him</option>
              <option value="For Both">For Both</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#D4AF37' }}>
                Marca
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ backgroundColor: '#1a1a1a', color: '#FFFFFF', border: '1px solid #444' }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#D4AF37' }}>
                Tamaño
              </label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                placeholder="3.4FL.OZ"
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ backgroundColor: '#1a1a1a', color: '#FFFFFF', border: '1px solid #444' }}
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleInputChange}
                className="w-5 h-5"
                style={{ accentColor: '#D4AF37' }}
              />
              <span className="text-sm" style={{ color: '#D4AF37' }}>En Stock</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#D4AF37' }}>
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ backgroundColor: '#1a1a1a', color: '#FFFFFF', border: '1px solid #444' }}
            />
          </div>
        </div>

        {/* Submit - Mobile Optimized */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all active:scale-95"
            style={{
              backgroundColor: '#D4AF37',
              color: '#000000',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Guardando...' : perfume ? 'Actualizar' : 'Crear'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 rounded-lg text-sm font-medium transition-all active:scale-95"
            style={{ backgroundColor: '#2a2a2a', color: '#D4AF37', border: '1px solid #444' }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

