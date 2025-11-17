'use client'

import { useState, useEffect } from 'react'
import type { Material } from '@/lib/firebase/materials'
import { addMaterial, updateMaterial } from '@/lib/firebase/materials'
import { uploadPerfumeImage, uploadVideo, uploadVideoThumbnail, getImageUrl } from '@/lib/b2/storage'

interface AdminMaterialFormProps {
  material: Material | null
  onClose: () => void
  onSuccess: () => void
}

export default function AdminMaterialForm({ material, onClose, onSuccess }: AdminMaterialFormProps) {
  const [loading, setLoading] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileUrl: '',
    fileType: 'image' as 'image' | 'video' | 'pdf' | 'other',
    fileName: '',
    fileSize: '',
    thumbnailUrl: '',
    order: '0',
  })
  const [file, setFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('')

  useEffect(() => {
    if (material) {
      setFormData({
        title: material.title || '',
        description: material.description || '',
        fileUrl: material.fileUrl || '',
        fileType: material.fileType || 'image',
        fileName: material.fileName || '',
        fileSize: material.fileSize?.toString() || '',
        thumbnailUrl: material.thumbnailUrl || '',
        order: material.order?.toString() || '0',
      })
      setThumbnailPreview(material.thumbnailUrl || '')
    }
  }, [material])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setFormData(prev => ({
        ...prev,
        fileName: selectedFile.name,
        fileSize: selectedFile.size.toString(),
      }))
      
      // Detectar tipo de archivo
      if (selectedFile.type.startsWith('image/')) {
        setFormData(prev => ({ ...prev, fileType: 'image' }))
      } else if (selectedFile.type.startsWith('video/')) {
        setFormData(prev => ({ ...prev, fileType: 'video' }))
      } else if (selectedFile.type === 'application/pdf') {
        setFormData(prev => ({ ...prev, fileType: 'pdf' }))
      } else {
        setFormData(prev => ({ ...prev, fileType: 'other' }))
      }
    }
  }

  function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setThumbnailFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  async function handleFileUpload() {
    if (!file) {
      alert('Por favor selecciona un archivo')
      return
    }

    const tempId = material?.id || `temp-${Date.now()}`

    setUploadingFile(true)
    try {
      let fileUrl: string
      
      if (formData.fileType === 'image') {
        fileUrl = await uploadPerfumeImage(file, tempId)
      } else if (formData.fileType === 'video') {
        fileUrl = await uploadVideo(file, tempId)
      } else {
        // Para PDFs y otros archivos, usar uploadPerfumeImage como genérico
        fileUrl = await uploadPerfumeImage(file, tempId)
      }
      
      setFormData(prev => ({ ...prev, fileUrl }))
      setFile(null)
      alert('Archivo subido exitosamente a B2')
    } catch (error) {
      console.error('Error subiendo archivo:', error)
      alert('Error al subir el archivo: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setUploadingFile(false)
    }
  }

  async function handleThumbnailUpload() {
    if (!thumbnailFile) {
      alert('Por favor selecciona una miniatura')
      return
    }

    const tempId = material?.id || `temp-${Date.now()}`

    setUploadingThumbnail(true)
    try {
      const thumbnailUrl = await uploadVideoThumbnail(thumbnailFile, tempId)
      setFormData(prev => ({ ...prev, thumbnailUrl }))
      setThumbnailFile(null)
      setThumbnailPreview('')
      alert('Miniatura subida exitosamente a B2')
    } catch (error) {
      console.error('Error subiendo miniatura:', error)
      alert('Error al subir la miniatura: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setUploadingThumbnail(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      let finalFileUrl = formData.fileUrl
      let finalThumbnailUrl = formData.thumbnailUrl

      // Si hay un archivo nuevo, subirlo primero
      if (file) {
        try {
          const tempId = material?.id || `temp-${Date.now()}`
          
          if (formData.fileType === 'image') {
            finalFileUrl = await uploadPerfumeImage(file, tempId)
          } else if (formData.fileType === 'video') {
            finalFileUrl = await uploadVideo(file, tempId)
          } else {
            finalFileUrl = await uploadPerfumeImage(file, tempId)
          }
          
          setFormData(prev => ({ ...prev, fileUrl: finalFileUrl }))
          setFile(null)
        } catch (error) {
          console.error('Error subiendo archivo:', error)
          alert('Error al subir el archivo. Por favor intenta de nuevo.')
          setLoading(false)
          return
        }
      }

      // Si hay una miniatura nueva, subirla primero
      if (thumbnailFile) {
        try {
          const tempId = material?.id || `temp-${Date.now()}`
          finalThumbnailUrl = await uploadVideoThumbnail(thumbnailFile, tempId)
          setFormData(prev => ({ ...prev, thumbnailUrl: finalThumbnailUrl }))
          setThumbnailFile(null)
          setThumbnailPreview('')
        } catch (error) {
          console.error('Error subiendo miniatura:', error)
          alert('Error al subir la miniatura. Por favor intenta de nuevo.')
          setLoading(false)
          return
        }
      }

      // Construir objeto de datos
      const materialData: any = {
        title: formData.title,
        fileUrl: finalFileUrl,
        fileType: formData.fileType,
        fileName: formData.fileName,
        order: parseInt(formData.order) || 0,
      }
      
      if (formData.description && formData.description.trim()) {
        materialData.description = formData.description
      }
      if (formData.fileSize) {
        materialData.fileSize = parseInt(formData.fileSize)
      }
      if (finalThumbnailUrl && finalThumbnailUrl.trim() && !finalThumbnailUrl.startsWith('data:')) {
        materialData.thumbnailUrl = finalThumbnailUrl
      }

      if (material?.id) {
        await updateMaterial(material.id, materialData)
      } else {
        await addMaterial(materialData)
      }

      onSuccess()
    } catch (error) {
      console.error('Error guardando material:', error)
      alert('Error al guardar el material: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setLoading(false)
    }
  }

  const thumbnailDisplayUrl = thumbnailPreview && thumbnailPreview.startsWith('data:')
    ? thumbnailPreview
    : formData.thumbnailUrl
      ? (formData.thumbnailUrl.startsWith('/api/b2')
          ? formData.thumbnailUrl
          : getImageUrl(formData.thumbnailUrl))
      : null

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-1" style={{ color: '#D4AF37' }}>
          {material ? 'Editar Material' : 'Nuevo Material'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Archivo Section */}
        <div className="p-4 rounded-lg" style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: '#D4AF37' }}>Archivo</h3>
          
          {formData.fileUrl && (
            <div className="mb-3 p-2 rounded" style={{ backgroundColor: '#1a1a1a' }}>
              <p className="text-xs mb-1" style={{ color: '#999' }}>Archivo actual:</p>
              <p className="text-xs break-all" style={{ color: '#D4AF37' }}>{formData.fileUrl}</p>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#D4AF37' }}>
                Seleccionar Archivo (Imagen, Video, PDF)
              </label>
              <input
                type="file"
                accept="image/*,video/*,application/pdf"
                onChange={handleFileChange}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ backgroundColor: '#1a1a1a', color: '#FFFFFF', border: '1px solid #444' }}
              />
            </div>

            {file && (
              <button
                type="button"
                onClick={handleFileUpload}
                disabled={uploadingFile}
                className="w-full px-3 py-2 rounded-lg text-xs font-medium transition-all active:scale-95"
                style={{
                  backgroundColor: '#D4AF37',
                  color: '#000000',
                  opacity: uploadingFile ? 0.6 : 1
                }}
              >
                {uploadingFile ? 'Subiendo a B2...' : 'Subir Archivo a B2'}
              </button>
            )}
          </div>
        </div>

        {/* Thumbnail Section */}
        <div className="p-4 rounded-lg" style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: '#D4AF37' }}>Miniatura (Opcional)</h3>
          
          {thumbnailDisplayUrl && (
            <div className="mb-3 w-20 h-32 mx-auto rounded overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
              {thumbnailDisplayUrl.startsWith('data:') ? (
                <img
                  src={thumbnailDisplayUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={thumbnailDisplayUrl}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#D4AF37' }}>
                Seleccionar Miniatura
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ backgroundColor: '#1a1a1a', color: '#FFFFFF', border: '1px solid #444' }}
              />
            </div>

            {thumbnailFile && (
              <button
                type="button"
                onClick={handleThumbnailUpload}
                disabled={uploadingThumbnail}
                className="w-full px-3 py-2 rounded-lg text-xs font-medium transition-all active:scale-95"
                style={{
                  backgroundColor: '#D4AF37',
                  color: '#000000',
                  opacity: uploadingThumbnail ? 0.6 : 1
                }}
              >
                {uploadingThumbnail ? 'Subiendo a B2...' : 'Subir Miniatura a B2'}
              </button>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div className="p-4 rounded-lg space-y-3" style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: '#D4AF37' }}>Información</h3>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#D4AF37' }}>
              Título *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ backgroundColor: '#1a1a1a', color: '#FFFFFF', border: '1px solid #444' }}
            />
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

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#D4AF37' }}>
              Tipo de Archivo
            </label>
            <select
              name="fileType"
              value={formData.fileType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ backgroundColor: '#1a1a1a', color: '#FFFFFF', border: '1px solid #444' }}
            >
              <option value="image">Imagen</option>
              <option value="video">Video</option>
              <option value="pdf">PDF</option>
              <option value="other">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#D4AF37' }}>
              Orden (para ordenar los materiales)
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleInputChange}
              min="0"
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ backgroundColor: '#1a1a1a', color: '#FFFFFF', border: '1px solid #444' }}
            />
          </div>
        </div>

        {/* Submit */}
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
            {loading ? 'Guardando...' : material ? 'Actualizar' : 'Crear'}
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

