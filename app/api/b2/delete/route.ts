import { NextRequest, NextResponse } from 'next/server'
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
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

export async function DELETE(request: NextRequest) {
  try {
    const { path } = await request.json()

    if (!path) {
      return NextResponse.json(
        { error: 'Path parameter is required' },
        { status: 400 }
      )
    }

    // Eliminar objeto de B2
    const command = new DeleteObjectCommand({
      Bucket: b2Config.bucketName,
      Key: path,
    })

    await s3Client.send(command)

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting from B2:', error)
    return NextResponse.json(
      { error: error.message || 'Error deleting file' },
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
      'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}


