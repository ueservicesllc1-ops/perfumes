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
    
    // Obtener objeto de B2
    const command = new GetObjectCommand({
      Bucket: b2Config.bucketName,
      Key: path,
      ...(rangeHeader && { Range: rangeHeader }),
    })

    const response = await s3Client.send(command)

    if (!response.Body) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Si hay Range header, retornar 206 Partial Content (necesario para iOS/Safari)
    if (rangeHeader && response.ContentRange) {
      const stream = response.Body as any
      
      return new NextResponse(stream, {
        status: 206,
        headers: {
          'Content-Type': response.ContentType || 'video/mp4',
          'Content-Length': response.ContentLength?.toString() || '0',
          'Content-Range': response.ContentRange,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS, HEAD',
          'Access-Control-Allow-Headers': 'Content-Type, Range',
          'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges',
        },
      })
    }

    // Si no hay Range, retornar todo el video (pero mejor usar streaming)
    const stream = response.Body as any

    return new NextResponse(stream, {
      status: 200,
      headers: {
        'Content-Type': response.ContentType || 'video/mp4',
        'Content-Length': response.ContentLength?.toString() || '0',
        'Accept-Ranges': 'bytes',
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

