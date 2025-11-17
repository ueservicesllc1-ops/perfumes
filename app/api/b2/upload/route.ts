import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { b2Config } from '@/lib/b2/config'

// Configurar cliente S3 para B2
const s3Client = new S3Client({
  endpoint: b2Config.endpoint,
  region: b2Config.region,
  credentials: {
    accessKeyId: b2Config.keyId,
    secretAccessKey: b2Config.applicationKey,
  },
  forcePathStyle: true,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const path = formData.get('path') as string || `perfumes/${Date.now()}-${file.name}`

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validar tamaño del archivo
    // Para videos: máximo 500MB, para PDFs: máximo 50MB, para imágenes: máximo 10MB
    const isVideo = file.type.startsWith('video/')
    const isPDF = file.type === 'application/pdf'
    let maxSize: number
    if (isVideo) {
      maxSize = 500 * 1024 * 1024 // 500MB para videos
    } else if (isPDF) {
      maxSize = 50 * 1024 * 1024 // 50MB para PDFs
    } else {
      maxSize = 10 * 1024 * 1024 // 10MB para imágenes
    }
    
    if (file.size > maxSize) {
      const maxSizeMB = isVideo ? '500MB' : isPDF ? '50MB' : '10MB'
      return NextResponse.json(
        { error: `El archivo es demasiado grande. Máximo ${maxSizeMB}.` },
        { status: 400 }
      )
    }

    // Convertir File a Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Subir a B2
    const command = new PutObjectCommand({
      Bucket: b2Config.bucketName,
      Key: path,
      Body: buffer,
      ContentType: file.type || (path.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
    })

    try {
      await s3Client.send(command)
    } catch (b2Error: any) {
      console.error('Error de B2:', b2Error)
      
      // Mensajes de error más descriptivos
      if (b2Error.name === 'NoSuchBucket' || b2Error.message?.includes('does not exist')) {
        return NextResponse.json(
          { 
            error: `El bucket "${b2Config.bucketName}" no existe. Verifica la configuración de B2.` 
          },
          { status: 500 }
        )
      }
      
      if (b2Error.name === 'InvalidAccessKeyId' || b2Error.name === 'SignatureDoesNotMatch') {
        return NextResponse.json(
          { 
            error: 'Credenciales de B2 inválidas. Verifica la configuración.' 
          },
          { status: 500 }
        )
      }
      
      throw b2Error
    }

    // Retornar URL pública
    // Para PDFs: usar URL pública real de B2
    // Para imágenes/videos: usar proxy local
    let publicUrl: string
    if (isPDF) {
      // URL pública real de B2 para PDFs
      publicUrl = `https://${b2Config.bucketName}.s3.${b2Config.region}.backblazeb2.com/${path}`
    } else {
      // URL del proxy para imágenes/videos
      const endpoint = isVideo ? 'video' : 'image'
      publicUrl = `/api/b2/${endpoint}?path=${encodeURIComponent(path)}`
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: path,
    })
  } catch (error: any) {
    console.error('Error uploading to B2:', error)
    return NextResponse.json(
      { error: error.message || 'Error uploading file' },
      { status: 500 }
    )
  }
}

// Habilitar CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

