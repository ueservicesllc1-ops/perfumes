'use client'

import { useState, useEffect } from 'react'
import type { Video } from '@/lib/firebase/videos'
import { addVideo, updateVideo } from '@/lib/firebase/videos'
import { uploadVideo, uploadVideoThumbnail, getImageUrl } from '@/lib/b2/storage'

interface AdminVideoFormProps {
  video: Video | null
  onClose: () => void
  onSuccess: () => void
}

export default function AdminVideoForm({ video, onClose, onSuccess }: AdminVideoFormProps) {
  const [loading, setLoading] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    order: '0',
  })
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('')

  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title || '',
        description: video.description || '',
        videoUrl: video.videoUrl || '',
        thumbnailUrl: video.thumbnailUrl || '',
        order: video.order?.toString() || '0',
      })
      setThumbnailPreview(video.thumbnailUrl || '')
    }
  }, [video])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  function handleVideoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
    }
  }

  function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleVideoUpload() {
    if (!videoFile) {
      alert('Por favor selecciona un video')
      return
    }

    const tempId = video?.id || `temp-${Date.now()}`

    setUploadingVideo(true)
    try {
      const videoUrl = await uploadVideo(videoFile, tempId)
      setFormData(prev => ({ ...prev, videoUrl }))
      setVideoFile(null)
      alert('Video subido exitosamente a B2')
    } catch (error) {
      console.error('Error subiendo video:', error)
      alert('Error al subir el video: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setUploadingVideo(false)
    }
  }

  async function handleThumbnailUpload() {
    if (!thumbnailFile) {
      alert('Por favor selecciona una miniatura')
      return
    }

    const tempId = video?.id || `temp-${Date.now()}`

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
      let finalVideoUrl = formData.videoUrl
      let finalThumbnailUrl = formData.thumbnailUrl

      // Si hay un video nuevo, subirlo primero
      if (videoFile) {
        try {
          const tempId = video?.id || `temp-${Date.now()}`
          finalVideoUrl = await uploadVideo(videoFile, tempId)
          setFormData(prev => ({ ...prev, videoUrl: finalVideoUrl }))
          setVideoFile(null)
        } catch (error) {
          console.error('Error subiendo video:', error)
          alert('Error al subir el video. Por favor intenta de nuevo.')
          setLoading(false)
          return
        }
      }

      // Si hay una miniatura nueva, subirla primero
      if (thumbnailFile) {
        try {
          const tempId = video?.id || `temp-${Date.now()}`
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
      const videoData: any = {
        title: formData.title,
        videoUrl: finalVideoUrl,
        order: parseInt(formData.order) || 0,
      }
      
      if (formData.description && formData.description.trim()) {
        videoData.description = formData.description
      }
      if (finalThumbnailUrl && finalThumbnailUrl.trim() && !finalThumbnailUrl.startsWith('data:')) {
        videoData.thumbnailUrl = finalThumbnailUrl
      }

      if (video?.id) {
        await updateVideo(video.id, videoData)
      } else {
        await addVideo(videoData)
      }

      onSuccess()
    } catch (error) {
      console.error('Error guardando video:', error)
      alert('Error al guardar el video: ' + (error instanceof Error ? error.message : 'Error desconocido'))
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
          {video ? 'Editar Video' : 'Nuevo Video'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Video Section */}
        <div className="p-4 rounded-lg" style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: '#D4AF37' }}>Video</h3>
          
          {/* Advertencia importante sobre formato */}
          <div className="mb-3 p-3 rounded" style={{ backgroundColor: '#1a1a1a', border: '1px solid #D4AF37' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: '#D4AF37' }}>
              ⚠️ IMPORTANTE: Formato de Video
            </p>
            <p className="text-xs mb-1" style={{ color: '#FFFFFF' }}>
              Los videos <strong>DEBEN estar en formato H.264 (MP4)</strong> para funcionar en móviles.
            </p>
            <p className="text-xs" style={{ color: '#999' }}>
              Si tu video está en H.265/HEVC, conviértelo primero con:
            </p>
            <code className="text-xs block mt-1 p-2 rounded" style={{ backgroundColor: '#000000', color: '#D4AF37' }}>
              ffmpeg -i video.mp4 -vcodec libx264 -acodec aac -strict -2 video_h264.mp4
            </code>
          </div>
          
          {formData.videoUrl && (
            <div className="mb-3 p-2 rounded" style={{ backgroundColor: '#1a1a1a' }}>
              <p className="text-xs mb-1" style={{ color: '#999' }}>Video actual:</p>
              <p className="text-xs break-all" style={{ color: '#D4AF37' }}>{formData.videoUrl}</p>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#D4AF37' }}>
                Seleccionar Video (MP4 H.264)
              </label>
              <input
                type="file"
                accept="video/mp4,video/*"
                onChange={handleVideoChange}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ backgroundColor: '#1a1a1a', color: '#FFFFFF', border: '1px solid #444' }}
              />
            </div>

            {videoFile && (
              <button
                type="button"
                onClick={handleVideoUpload}
                disabled={uploadingVideo}
                className="w-full px-3 py-2 rounded-lg text-xs font-medium transition-all active:scale-95"
                style={{
                  backgroundColor: '#D4AF37',
                  color: '#000000',
                  opacity: uploadingVideo ? 0.6 : 1
                }}
              >
                {uploadingVideo ? 'Subiendo a B2...' : 'Subir Video a B2'}
              </button>
            )}
          </div>
        </div>

        {/* Thumbnail Section */}
        <div className="p-4 rounded-lg" style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: '#D4AF37' }}>Miniatura</h3>
          
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
              Orden (para ordenar los videos)
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
            {loading ? 'Guardando...' : video ? 'Actualizar' : 'Crear'}
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

