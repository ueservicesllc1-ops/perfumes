// Servicio para manejar almacenamiento en Backblaze B2 a través del proxy

/**
 * Subir imagen de perfume a B2
 * @param file - Archivo a subir
 * @param perfumeId - ID del perfume
 * @returns URL de la imagen
 */
export async function uploadPerfumeImage(file: File, perfumeId: string): Promise<string> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('path', `perfumes/${perfumeId}/${Date.now()}-${file.name}`)

    // Usar proxy externo en puerto 3001
    const proxyUrl = 'http://localhost:3001'
    const uploadEndpoint = `${proxyUrl}/api/b2/upload`
    
    // Intentar con proxy externo primero
    let response
    try {
      response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
        // No incluir headers automáticamente para evitar error 431
        headers: {},
      })
    } catch (proxyError: any) {
      // Si falla el proxy externo, usar API route local
      console.warn('Proxy externo no disponible, usando API route local:', proxyError.message)
      response = await fetch('/api/b2/upload', {
        method: 'POST',
        body: formData,
        headers: {},
      })
    }

    if (!response.ok) {
      const errorText = await response.text()
      let error
      try {
        error = JSON.parse(errorText)
      } catch {
        error = { error: errorText || `Error ${response.status}: ${response.statusText}` }
      }
      throw new Error(error.error || 'Error uploading image')
    }

    const data = await response.json()
    return data.url
  } catch (error: any) {
    console.error('Error uploading image to B2:', error)
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      throw new Error('No se pudo conectar al servidor proxy. Verifica que esté corriendo en el puerto 3001.')
    }
    throw new Error(error.message || 'Error al subir la imagen')
  }
}

/**
 * Eliminar imagen de B2
 * @param imagePath - Ruta de la imagen en B2
 */
export async function deletePerfumeImage(imagePath: string): Promise<void> {
  try {
    // Extraer el path de la URL si es necesario
    const path = imagePath.includes('?path=') 
      ? decodeURIComponent(imagePath.split('?path=')[1])
      : imagePath

    const response = await fetch('/api/b2/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error deleting image')
    }
  } catch (error) {
    console.error('Error deleting image from B2:', error)
    throw error
  }
}

/**
 * Obtener URL de imagen
 * @param imagePath - Ruta de la imagen en B2
 * @returns URL completa de la imagen
 */
export function getImageUrl(imagePath: string): string {
  // Si ya es una URL del proxy, retornarla
  if (imagePath.startsWith('/api/b2')) {
    return imagePath
  }
  
  // Si es una ruta relativa, usar el proxy
  return `/api/b2/image?path=${encodeURIComponent(imagePath)}`
}

/**
 * Subir múltiples imágenes
 * @param files - Array de archivos
 * @param perfumeId - ID del perfume
 * @returns Array de URLs
 */
export async function uploadMultipleImages(
  files: File[],
  perfumeId: string
): Promise<string[]> {
  const uploadPromises = files.map((file) => 
    uploadPerfumeImage(file, perfumeId)
  )
  
  return Promise.all(uploadPromises)
}

/**
 * Subir video a B2
 * @param file - Archivo de video a subir
 * @param videoId - ID del video
 * @returns URL del video
 */
export async function uploadVideo(file: File, videoId: string): Promise<string> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('path', `videos/${videoId}/${Date.now()}-${file.name}`)

    // Usar proxy externo en puerto 3001
    const proxyUrl = 'http://localhost:3001'
    const uploadEndpoint = `${proxyUrl}/api/b2/upload`
    
    // Intentar con proxy externo primero
    let response
    try {
      response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
        headers: {},
      })
    } catch (proxyError: any) {
      // Si falla el proxy externo, usar API route local
      console.warn('Proxy externo no disponible, usando API route local:', proxyError.message)
      response = await fetch('/api/b2/upload', {
        method: 'POST',
        body: formData,
        headers: {},
      })
    }

    if (!response.ok) {
      const errorText = await response.text()
      let error
      try {
        error = JSON.parse(errorText)
      } catch {
        error = { error: errorText || `Error ${response.status}: ${response.statusText}` }
      }
      throw new Error(error.error || 'Error uploading video')
    }

    const data = await response.json()
    return data.url
  } catch (error: any) {
    console.error('Error uploading video to B2:', error)
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      throw new Error('No se pudo conectar al servidor proxy. Verifica que esté corriendo en el puerto 3001.')
    }
    throw new Error(error.message || 'Error al subir el video')
  }
}

/**
 * Subir miniatura de video a B2
 * @param file - Archivo de imagen a subir
 * @param videoId - ID del video
 * @returns URL de la miniatura
 */
export async function uploadVideoThumbnail(file: File, videoId: string): Promise<string> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('path', `videos/${videoId}/thumbnail-${Date.now()}-${file.name}`)

    // Usar proxy externo en puerto 3001
    const proxyUrl = 'http://localhost:3001'
    const uploadEndpoint = `${proxyUrl}/api/b2/upload`
    
    // Intentar con proxy externo primero
    let response
    try {
      response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
        headers: {},
      })
    } catch (proxyError: any) {
      // Si falla el proxy externo, usar API route local
      console.warn('Proxy externo no disponible, usando API route local:', proxyError.message)
      response = await fetch('/api/b2/upload', {
        method: 'POST',
        body: formData,
        headers: {},
      })
    }

    if (!response.ok) {
      const errorText = await response.text()
      let error
      try {
        error = JSON.parse(errorText)
      } catch {
        error = { error: errorText || `Error ${response.status}: ${response.statusText}` }
      }
      throw new Error(error.error || 'Error uploading thumbnail')
    }

    const data = await response.json()
    return data.url
  } catch (error: any) {
    console.error('Error uploading thumbnail to B2:', error)
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      throw new Error('No se pudo conectar al servidor proxy. Verifica que esté corriendo en el puerto 3001.')
    }
    throw new Error(error.message || 'Error al subir la miniatura')
  }
}

/**
 * Obtener URL de video
 * @param videoPath - Ruta del video en B2
 * @returns URL completa del video
 * Para iOS/Safari, usa el proxy que maneja mejor CORS y Range requests
 * Para otros navegadores, puede usar URL directa de B2
 */
export function getVideoUrl(videoPath: string): string {
  // Si ya es una URL completa, retornarla
  if (videoPath.startsWith('https://') || videoPath.startsWith('http://')) {
    return videoPath
  }
  
  // Si ya es una URL del proxy, retornarla
  if (videoPath.startsWith('/api/b2')) {
    return videoPath
  }
  
  // Para iOS/Safari, usar el proxy que maneja mejor CORS y Range requests
  // El proxy está optimizado para streaming con soporte de Range requests
  return `/api/b2/video?path=${encodeURIComponent(videoPath)}`
}

/**
 * Subir PDF a B2
 * @param file - Archivo PDF a subir
 * @param orderId - ID de la orden
 * @returns URL del PDF
 */
export async function uploadPDF(file: File, orderId: string): Promise<string> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('path', `orders/${orderId}/${Date.now()}-${file.name}`)

    // Usar proxy externo en puerto 3001
    const proxyUrl = 'http://localhost:3001'
    const uploadEndpoint = `${proxyUrl}/api/b2/upload`
    
    // Intentar con proxy externo primero
    let response
    try {
      response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
        headers: {},
      })
    } catch (proxyError: any) {
      // Si falla el proxy externo, usar API route local
      console.warn('Proxy externo no disponible, usando API route local:', proxyError.message)
      response = await fetch('/api/b2/upload', {
        method: 'POST',
        body: formData,
        headers: {},
      })
    }

    if (!response.ok) {
      const errorText = await response.text()
      let error
      try {
        error = JSON.parse(errorText)
      } catch {
        error = { error: errorText || `Error ${response.status}: ${response.statusText}` }
      }
      throw new Error(error.error || 'Error uploading PDF')
    }

    const data = await response.json()
    // La API route ya retorna la URL pública de B2 para PDFs
    return data.url
  } catch (error: any) {
    console.error('Error uploading PDF to B2:', error)
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      throw new Error('No se pudo conectar al servidor proxy. Verifica que esté corriendo en el puerto 3001.')
    }
    throw new Error(error.message || 'Error al subir el PDF')
  }
}

/**
 * Obtener URL de PDF (URL pública real de B2)
 * @param pdfPath - Ruta del PDF en B2 (puede ser URL del proxy o path directo)
 * @returns URL completa del PDF (URL pública de B2)
 */
export function getPDFUrl(pdfPath: string): string {
  // Si ya es una URL completa de B2, retornarla
  if (pdfPath.startsWith('https://') && pdfPath.includes('backblazeb2.com')) {
    return pdfPath
  }
  
  // Extraer el path si viene del proxy
  let actualPath = pdfPath
  if (pdfPath.startsWith('/api/b2/pdf?path=')) {
    actualPath = decodeURIComponent(pdfPath.split('?path=')[1])
  } else if (pdfPath.startsWith('/api/b2/')) {
    // Si viene del proxy, extraer el path
    const match = pdfPath.match(/\/api\/b2\/pdf\?path=(.+)/)
    if (match) {
      actualPath = decodeURIComponent(match[1])
    }
  }
  
  // Retornar URL pública real de B2
  const { getB2PublicUrl } = require('@/lib/b2/config')
  return getB2PublicUrl(actualPath)
}

