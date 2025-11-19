// Script para actualizar imágenes de Arabiyat Sugar construyendo URLs directas de Shopify
// Ejecutar con: npx tsx scripts/update-arabiyat-sugar-images-direct.ts

import { getAllPerfumes, updatePerfume } from '../lib/firebase/perfumes'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { b2Config } from '../lib/b2/config'
import fetch from 'node-fetch'

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

// Mapeo de nombres de productos a posibles nombres de archivo
const productImageMap: Record<string, string[]> = {
  'berries cream macaron': ['BERRIESCREAMMACARON', 'BERRIESCREAM', 'BERRIES', 'BERRIESMACARON', 'BERRIESCREAMMACARON01', 'BERRIESCREAMMACARON02', 'BERRIESMACARON01', 'BERRIESMACARON02'],
  'toffee ganache': ['TOFFEEGANACHE', 'TOFFEE', 'TOFFEEGANACHE01', 'TOFFEEGANACHE02'],
  'chocolate ganache': ['CHOCOLATEGANACHE', 'CHOCOLATE', 'CHOCOLATEGANACHE01', 'CHOCOLATEGANACHE02'],
  'dulce de leche': ['DULCEDELECHE', 'DULCEDELECHE01', 'DULCEDELECHE02'],
  'mango affogato': ['MANGOAFFOGATO', 'MANGO', 'MANGOAFFOGATO01', 'MANGOAFFOGATO02'],
  'matcha latte': ['MATCHALATTE', 'MATCHA', 'MATCHALATTE01', 'MATCHALATTE02', 'MATCHALATTE'],
  'french vanilla latte': ['FRENCHVANILLALATTE', 'VANILLALATTE', 'FRENCHVANILLA', 'VANILLALATTE01', 'VANILLALATTE02', 'FRENCHVANILLALATTE01', 'FRENCHVANILLALATTE02'],
  'cotton blush': ['COTTONBLUSH', 'COTTON', 'COTTONBLUSH01', 'COTTONBLUSH02'],
  'caramel chocolate macaron': ['CARAMELCHOCOLATEMACARON', 'CARAMELMACARON', 'CARAMEL', 'CARAMELMACARON01', 'CARAMELMACARON02', 'CARAMELCHOCOLATEMACARON01', 'CARAMELCHOCOLATEMACARON02'],
  'lemon sorbet': ['LEMONSORBET', 'LEMON', 'LEMONSORBET01', 'LEMONSORBET02'],
  'cookie dough': ['COOKIEDOUGH', 'COOKIE', 'COOKIEDOUGH01', 'COOKIEDOUGH02'],
  'pecan butter cookie': ['PECANBUTTERCOOKIE', 'PECAN', 'PECANCOOKIE', 'PECANBUTTERCOOKIE01', 'PECANBUTTERCOOKIE02', 'PECANCOOKIE01', 'PECANCOOKIE02'],
  'coconut chiffon': ['COCONUTCHIFFON', 'COCONUT', 'COCONUTCHIFFON01', 'COCONUTCHIFFON02'],
  'strawberry tres leches': ['STRAWBERRYTRESLECHES', 'STRAWBERRY', 'STRAWBERRYTRESLECHES01', 'STRAWBERRYTRESLECHES02', 'STRAWBERRYTRESLECHES'],
  'vanilla cream macaron': ['VANILLACREAMMACARON', 'VANILLACREAM', 'VANILLAMACARON', 'VANILLACREAMMACARON01', 'VANILLACREAMMACARON02'],
}

function generateImageUrls(productName: string): string[] {
  const normalized = productName.toLowerCase()
    .replace(/arabiyat sugar/gi, '')
    .replace(/eau de parfum/gi, '')
    .replace(/3\.4fl\.oz/gi, '')
    .replace(/100ml/gi, '')
    .replace(/3\.4 fl\.oz/gi, '')
    .trim()
  
  const urls: string[] = []
  const baseUrl = 'https://fragrancewholesalerusa.com/cdn/shop/files'
  
  // Buscar en el mapeo
  for (const [key, filenames] of Object.entries(productImageMap)) {
    if (normalized.includes(key)) {
      for (const filename of filenames) {
        urls.push(`${baseUrl}/${filename}.webp`)
        urls.push(`${baseUrl}/${filename}02.webp`)
        urls.push(`${baseUrl}/${filename}01.webp`)
      }
    }
  }
  
  // Generar variaciones basadas en el nombre
  const cleanName = normalized
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '')
    .toUpperCase()
  
  if (cleanName) {
    urls.push(`${baseUrl}/${cleanName}.webp`)
    urls.push(`${baseUrl}/${cleanName}02.webp`)
    urls.push(`${baseUrl}/${cleanName}01.webp`)
  }
  
  // Variaciones adicionales
  const words = normalized.split(' ').filter(w => w.length > 2)
  if (words.length > 0) {
    const firstWord = words[0].toUpperCase()
    urls.push(`${baseUrl}/${firstWord}.webp`)
    urls.push(`${baseUrl}/${firstWord}02.webp`)
    
    if (words.length > 1) {
      const combined = words.map(w => w.toUpperCase()).join('')
      urls.push(`${baseUrl}/${combined}.webp`)
      urls.push(`${baseUrl}/${combined}02.webp`)
    }
  }
  
  return Array.from(new Set(urls)) // Eliminar duplicados
}

async function checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

async function downloadAndUploadImage(imageUrl: string, productName: string): Promise<string> {
  try {
    console.log(`  📥 Descargando: ${imageUrl.substring(0, 70)}...`)
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://fragrancewholesalerusa.com/'
      }
    })
    
    if (!response.ok) {
      return ''
    }
    
    const buffer = Buffer.from(await response.arrayBuffer())
    
    // Verificar que sea una imagen válida
    if (buffer.length < 100) {
      return ''
    }
    
    const sanitizedName = productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50)
    
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(7)
    const fileName = `${sanitizedName}-${timestamp}-${randomId}.webp`
    const b2Path = `perfumes/arabiyat-sugar/${fileName}`
    
    console.log(`  📤 Subiendo a B2...`)
    const command = new PutObjectCommand({
      Bucket: b2Config.bucketName,
      Key: b2Path,
      Body: buffer,
      ContentType: 'image/webp',
    })
    
    await s3Client.send(command)
    
    const imageUrl_proxy = `/api/b2/image?path=${encodeURIComponent(b2Path)}`
    console.log(`  ✓ Imagen subida`)
    return imageUrl_proxy
  } catch (error: any) {
    return ''
  }
}

async function findAndUploadImage(productName: string): Promise<string> {
  const possibleUrls = generateImageUrls(productName)
  
  console.log(`  🔍 Probando ${possibleUrls.length} URLs posibles...`)
  
  for (const url of possibleUrls) {
    try {
      const exists = await checkImageExists(url)
      if (exists) {
        console.log(`  ✓ Imagen encontrada: ${url}`)
        const uploadedUrl = await downloadAndUploadImage(url, productName)
        if (uploadedUrl) {
          return uploadedUrl
        }
      }
    } catch (error) {
      // Continuar con la siguiente URL
      continue
    }
  }
  
  return ''
}

async function updateProductsWithImages() {
  console.log('🚀 Iniciando actualización de imágenes para productos Arabiyat Sugar...\n')
  
  // Obtener productos existentes
  const perfumes = await getAllPerfumes()
  const arabiyatSugarPerfumes = perfumes.filter(p => 
    p.name.toLowerCase().includes('arabiyat sugar') && 
    p.brand === 'Arabiyat Sugar'
  )
  
  console.log(`📦 Encontrados ${arabiyatSugarPerfumes.length} productos Arabiyat Sugar\n`)
  
  if (arabiyatSugarPerfumes.length === 0) {
    console.log('⚠ No se encontraron productos para actualizar')
    return
  }
  
  let updatedCount = 0
  let skippedCount = 0
  let errorCount = 0
  
  for (const perfume of arabiyatSugarPerfumes) {
    try {
      if (!perfume.id) {
        console.log(`⚠ Saltando producto sin ID: ${perfume.name}`)
        skippedCount++
        continue
      }
      
      // Si ya tiene imagen, actualizar de todas formas
      if (perfume.imageUrl && !perfume.imageUrl.includes('...')) {
        console.log(`\n📝 Actualizando imagen existente: ${perfume.name}`)
      } else {
        console.log(`\n📝 Procesando: ${perfume.name}`)
      }
      
      const imageUrl = await findAndUploadImage(perfume.name)
      
      if (!imageUrl) {
        console.log(`  ⚠ No se encontró imagen`)
        skippedCount++
        continue
      }
      
      // Actualizar producto
      await updatePerfume(perfume.id, { imageUrl })
      console.log(`  ✓ Actualizado en Firestore (ID: ${perfume.id})`)
      updatedCount++
      
      // Delay para no sobrecargar
      await new Promise(resolve => setTimeout(resolve, 1500))
    } catch (error: any) {
      console.error(`  ✗ Error: ${error.message}`)
      errorCount++
    }
  }
  
  console.log('\n' + '='.repeat(50))
  console.log('📊 RESUMEN')
  console.log('='.repeat(50))
  console.log(`✓ Actualizados: ${updatedCount}`)
  console.log(`⏭ Saltados: ${skippedCount}`)
  console.log(`✗ Errores: ${errorCount}`)
  console.log(`📦 Total procesado: ${arabiyatSugarPerfumes.length}`)
  console.log('='.repeat(50))
}

updateProductsWithImages().catch((error) => {
  console.error('Error fatal:', error)
  process.exit(1)
})

