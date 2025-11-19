// Script para obtener productos Arabiyat Sugar usando la API de Shopify
// Ejecutar con: npx tsx scripts/scrape-shopify-arabiyat-sugar.ts

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

interface ShopifyProduct {
  id: number
  title: string
  handle: string
  vendor: string
  product_type: string
  variants: Array<{
    id: number
    title: string
    price: string
    sku: string
  }>
  images: Array<{
    id: number
    src: string
    width: number
    height: number
  }>
  tags: string[]
}

interface ShopifyCollection {
  products: ShopifyProduct[]
}

async function getShopifyProducts(): Promise<ShopifyProduct[]> {
  console.log('🔍 Obteniendo productos desde la API de Shopify...\n')
  
  try {
    // Intentar obtener productos de la colección "bestselling" con tag "Arabiyat Sugar"
    // Shopify permite acceder a colecciones mediante /collections/{handle}/products.json
    const url = 'https://fragrancewholesalerusa.com/collections/bestselling/products.json'
    
    console.log(`📡 Consultando: ${url}`)
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json() as ShopifyCollection
    console.log(`✓ Encontrados ${data.products.length} productos en la colección\n`)
    
    // Filtrar solo productos de Arabiyat Sugar
    const arabiyatSugarProducts = data.products.filter(product => 
      product.tags.some(tag => tag.toLowerCase().includes('arabiyat sugar')) ||
      product.title.toLowerCase().includes('arabiyat sugar') ||
      product.vendor.toLowerCase().includes('arabiyat sugar')
    )
    
    console.log(`✓ Filtrados ${arabiyatSugarProducts.length} productos de Arabiyat Sugar\n`)
    return arabiyatSugarProducts
  } catch (error: any) {
    console.error('✗ Error obteniendo productos:', error.message)
    
    // Si falla, intentar obtener todos los productos
    console.log('\n🔄 Intentando obtener todos los productos...')
    try {
      const allProductsUrl = 'https://fragrancewholesalerusa.com/products.json'
      const response = await fetch(allProductsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json() as ShopifyCollection
      const arabiyatSugarProducts = data.products.filter(product => 
        product.tags.some(tag => tag.toLowerCase().includes('arabiyat sugar')) ||
        product.title.toLowerCase().includes('arabiyat sugar') ||
        product.vendor.toLowerCase().includes('arabiyat sugar')
      )
      
      console.log(`✓ Encontrados ${arabiyatSugarProducts.length} productos de Arabiyat Sugar\n`)
      return arabiyatSugarProducts
    } catch (secondError: any) {
      console.error('✗ Error en segundo intento:', secondError.message)
      return []
    }
  }
}

async function downloadAndUploadImage(imageUrl: string, productName: string): Promise<string> {
  try {
    if (!imageUrl || imageUrl.startsWith('data:')) {
      return ''
    }
    
    // Shopify normalmente usa URLs con parámetros de tamaño, removerlos para obtener imagen completa
    let cleanUrl = imageUrl.split('?')[0]
    // Reemplazar tamaño si existe (ej: _100x100.jpg -> .jpg)
    cleanUrl = cleanUrl.replace(/_[0-9]+x[0-9]+\./g, '.')
    
    console.log(`  📥 Descargando: ${cleanUrl.substring(0, 60)}...`)
    const response = await fetch(cleanUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://fragrancewholesalerusa.com/'
      }
    })
    
    if (!response.ok) {
      console.warn(`  ⚠ No se pudo descargar (${response.status})`)
      return ''
    }
    
    const buffer = Buffer.from(await response.arrayBuffer())
    
    const sanitizedName = productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50)
    
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(7)
    const fileName = `${sanitizedName}-${timestamp}-${randomId}.jpg`
    const b2Path = `perfumes/arabiyat-sugar/${fileName}`
    
    console.log(`  📤 Subiendo a B2...`)
    const command = new PutObjectCommand({
      Bucket: b2Config.bucketName,
      Key: b2Path,
      Body: buffer,
      ContentType: 'image/jpeg',
    })
    
    await s3Client.send(command)
    
    const imageUrl_proxy = `/api/b2/image?path=${encodeURIComponent(b2Path)}`
    console.log(`  ✓ Imagen subida`)
    return imageUrl_proxy
  } catch (error: any) {
    console.warn(`  ✗ Error: ${error.message}`)
    return ''
  }
}

function normalizeProductName(name: string): string {
  return name
    .toLowerCase()
    .replace(/arabiyat sugar/gi, '')
    .replace(/eau de parfum/gi, '')
    .replace(/3\.4fl\.oz/gi, '')
    .replace(/100ml/gi, '')
    .replace(/3\.4 fl\.oz/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function findMatchingProduct(shopifyProduct: ShopifyProduct, firestoreProducts: any[]): any | null {
  const normalizedShopify = normalizeProductName(shopifyProduct.title)
  
  for (const firestoreProduct of firestoreProducts) {
    const normalizedFirestore = normalizeProductName(firestoreProduct.name)
    
    // Coincidencia exacta
    if (normalizedShopify === normalizedFirestore) {
      return firestoreProduct
    }
    
    // Coincidencia parcial (al menos 3 palabras en común)
    const shopifyWords = normalizedShopify.split(' ').filter(w => w.length > 2)
    const firestoreWords = normalizedFirestore.split(' ').filter(w => w.length > 2)
    const matchCount = shopifyWords.filter(w => firestoreWords.some(f => f.includes(w) || w.includes(f))).length
    
    if (matchCount >= 3) {
      return firestoreProduct
    }
  }
  
  return null
}

async function updateProductsWithImages() {
  console.log('🚀 Iniciando actualización de productos Arabiyat Sugar con imágenes desde Shopify API...\n')
  
  // Obtener productos de Shopify
  const shopifyProducts = await getShopifyProducts()
  
  if (shopifyProducts.length === 0) {
    console.log('⚠ No se encontraron productos en Shopify')
    return
  }
  
  // Obtener productos existentes en Firestore
  const firestorePerfumes = await getAllPerfumes()
  const arabiyatSugarPerfumes = firestorePerfumes.filter(p => 
    p.name.toLowerCase().includes('arabiyat sugar') && 
    p.brand === 'Arabiyat Sugar'
  )
  
  console.log(`📦 Encontrados ${arabiyatSugarPerfumes.length} productos en Firestore\n`)
  
  if (arabiyatSugarPerfumes.length === 0) {
    console.log('⚠ No se encontraron productos en Firestore para actualizar')
    return
  }
  
  let updatedCount = 0
  let skippedCount = 0
  let errorCount = 0
  
  for (const shopifyProduct of shopifyProducts) {
    try {
      console.log(`\n📝 Procesando: ${shopifyProduct.title}`)
      
      // Buscar producto correspondiente en Firestore
      const matchingProduct = findMatchingProduct(shopifyProduct, arabiyatSugarPerfumes)
      
      if (!matchingProduct || !matchingProduct.id) {
        console.log(`  ⚠ No se encontró producto correspondiente en Firestore`)
        skippedCount++
        continue
      }
      
      // Si ya tiene imagen, preguntar si actualizar (opcional: puedes cambiar esto)
      if (matchingProduct.imageUrl && !matchingProduct.imageUrl.includes('...')) {
        console.log(`  ⏭ Ya tiene imagen, actualizando con nueva...`)
      }
      
      // Obtener la primera imagen del producto (Shopify puede tener múltiples)
      if (shopifyProduct.images.length === 0) {
        console.log(`  ⚠ No tiene imágenes en Shopify`)
        skippedCount++
        continue
      }
      
      const shopifyImage = shopifyProduct.images[0]
      console.log(`  🖼️ Imagen encontrada: ${shopifyImage.src.substring(0, 60)}...`)
      
      // Descargar y subir imagen
      const imageUrl = await downloadAndUploadImage(shopifyImage.src, shopifyProduct.title)
      
      if (!imageUrl) {
        console.log(`  ⚠ No se pudo subir la imagen`)
        skippedCount++
        continue
      }
      
      // Actualizar producto en Firestore
      await updatePerfume(matchingProduct.id, { imageUrl })
      console.log(`  ✓ Actualizado en Firestore (ID: ${matchingProduct.id})`)
      updatedCount++
      
      // Delay para no sobrecargar
      await new Promise(resolve => setTimeout(resolve, 1000))
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
  console.log(`📦 Total procesado: ${shopifyProducts.length}`)
  console.log('='.repeat(50))
}

updateProductsWithImages().catch((error) => {
  console.error('Error fatal:', error)
  process.exit(1)
})

