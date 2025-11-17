// Script para verificar la configuración de B2
// Ejecutar con: npx tsx scripts/verify-b2-config.ts

import { S3Client, ListBucketsCommand, HeadBucketCommand } from '@aws-sdk/client-s3'
import { b2Config } from '../lib/b2/config'

async function verifyB2Config() {
  console.log('Verificando configuración de B2...\n')
  
  const s3Client = new S3Client({
    endpoint: b2Config.endpoint,
    region: b2Config.region,
    credentials: {
      accessKeyId: b2Config.keyId,
      secretAccessKey: b2Config.applicationKey,
    },
    forcePathStyle: true,
  })

  try {
    // Intentar listar buckets
    console.log('1. Verificando credenciales...')
    const listCommand = new ListBucketsCommand({})
    const bucketsResponse = await s3Client.send(listCommand)
    
    console.log('✓ Credenciales válidas')
    console.log(`   Buckets disponibles: ${bucketsResponse.Buckets?.length || 0}`)
    
    if (bucketsResponse.Buckets && bucketsResponse.Buckets.length > 0) {
      console.log('\n   Buckets encontrados:')
      bucketsResponse.Buckets.forEach(bucket => {
        console.log(`   - ${bucket.Name} (creado: ${bucket.CreationDate})`)
      })
    }
    
    // Verificar si el bucket configurado existe
    console.log(`\n2. Verificando bucket "${b2Config.bucketName}"...`)
    try {
      const headCommand = new HeadBucketCommand({ Bucket: b2Config.bucketName })
      await s3Client.send(headCommand)
      console.log(`✓ El bucket "${b2Config.bucketName}" existe y es accesible`)
    } catch (error: any) {
      if (error.name === 'NotFound' || error.name === 'NoSuchBucket') {
        console.log(`✗ El bucket "${b2Config.bucketName}" NO existe`)
        console.log('\n💡 Soluciones:')
        console.log('   1. Verifica el nombre del bucket en Backblaze B2 Console')
        console.log('   2. Crea el bucket si no existe')
        console.log('   3. Actualiza el nombre en lib/b2/config.ts')
      } else {
        console.log(`✗ Error verificando bucket: ${error.message}`)
      }
    }
    
    console.log('\n✓ Verificación completada')
    process.exit(0)
  } catch (error: any) {
    console.error('\n✗ Error:', error.message)
    
    if (error.name === 'InvalidAccessKeyId') {
      console.log('\n💡 El Key ID es inválido. Verifica las credenciales en lib/b2/config.ts')
    } else if (error.name === 'SignatureDoesNotMatch') {
      console.log('\n💡 El Application Key es inválido. Verifica las credenciales en lib/b2/config.ts')
    } else if (error.message?.includes('ENOTFOUND') || error.message?.includes('getaddrinfo')) {
      console.log('\n💡 No se pudo conectar a B2. Verifica tu conexión a internet.')
    }
    
    process.exit(1)
  }
}

verifyB2Config()

