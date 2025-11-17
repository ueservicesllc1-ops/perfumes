import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { b2Config } from '@/lib/b2/config'

const s3Client = new S3Client({
  endpoint: b2Config.endpoint,
  region: b2Config.region,
  credentials: {
    accessKeyId: b2Config.keyId,
    secretAccessKey: b2Config.applicationKey,
  },
  forcePathStyle: true,
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const path = searchParams.get('path')

    if (!path) {
      return NextResponse.json(
        { error: 'Path parameter is required' },
        { status: 400 }
      )
    }

    // Rechazar data URLs explícitamente
    if (path.startsWith('data:')) {
      return NextResponse.json(
        { error: 'Data URLs are not allowed. Videos must be uploaded to B2 first.' },
        { status: 400 }
      )
    }

    // Obtener Range header para soporte de streaming (necesario para iOS/Safari)
    const rangeHeader = request.headers.get('range')
    
    // Construir URL directa de B2 para mejor soporte de Range requests
    const b2PublicUrl = `https://${b2Config.bucketName}.s3.${b2Config.region}.backblazeb2.com/${path}`
    
    // Hacer fetch directo a B2 con Range header si existe
    const fetchHeaders: HeadersInit = {}
    if (rangeHeader) {
      fetchHeaders['Range'] = rangeHeader
    }
    
    const b2Response = await fetch(b2PublicUrl, {
      headers: fetchHeaders,
    })

    if (!b2Response.ok) {
      if (b2Response.status === 404) {
        return NextResponse.json(
          { error: 'File not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: `Error fetching video: ${b2Response.statusText}` },
        { status: b2Response.status }
      )
    }

    // Obtener headers de la respuesta de B2
    const contentType = b2Response.headers.get('content-type') || 'video/mp4'
    const contentLength = b2Response.headers.get('content-length') || '0'
    const contentRange = b2Response.headers.get('content-range')
    const acceptRanges = b2Response.headers.get('accept-ranges') || 'bytes'

    // Si hay Range y Content-Range, es una respuesta 206 Partial Content
    const isPartialContent = rangeHeader && contentRange && b2Response.status === 206

    // Obtener el stream del body
    const stream = b2Response.body

    if (!stream) {
      return NextResponse.json(
        { error: 'No video content' },
        { status: 500 }
      )
    }

    // Retornar respuesta con headers apropiados
    return new NextResponse(stream, {
      status: isPartialContent ? 206 : 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': contentLength,
        ...(contentRange && { 'Content-Range': contentRange }),
        'Accept-Ranges': acceptRanges,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS, HEAD',
        'Access-Control-Allow-Headers': 'Content-Type, Range',
        'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges',
      },
    })
  } catch (error: any) {
    console.error('Error getting video from B2:', error)
    return NextResponse.json(
      { error: error.message || 'Error getting video' },
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS, HEAD',
      'Access-Control-Allow-Headers': 'Content-Type, Range',
      'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges',
    },
  })
}

// HEAD request para obtener metadatos del video
export async function HEAD(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const path = searchParams.get('path')

    if (!path) {
      return new NextResponse(null, { status: 400 })
    }

    const command = new GetObjectCommand({
      Bucket: b2Config.bucketName,
      Key: path,
    })

    const response = await s3Client.send(command)

    return new NextResponse(null, {
      status: 200,
      headers: {
        'Content-Type': response.ContentType || 'video/mp4',
        'Content-Length': response.ContentLength?.toString() || '0',
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS, HEAD',
        'Access-Control-Allow-Headers': 'Content-Type, Range',
        'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges',
      },
    })
  } catch (error: any) {
    return new NextResponse(null, { status: 500 })
  }
}

