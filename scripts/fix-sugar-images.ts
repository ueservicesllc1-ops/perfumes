// Script para verificar y actualizar imágenes faltantes de Arabiyat Sugar
// Ejecutar con: npx tsx scripts/fix-sugar-images.ts

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
  images: Array<{
    id: number
    src: string
    width: number
    height: number
  }>
}

interface ShopifyCollection {
  products: ShopifyProduct[]
}

async function getShopifySugarProducts(): Promise<ShopifyProduct[]> {
  console.log('🔍 Obteniendo productos Arabiyat Sugar desde Shopify...\n')
  
  const allProducts: ShopifyProduct[] = []
  let page = 1
  let hasMore = true
  
  try {
    while (hasMore) {
      const url = `https://fragrancewholesalerusa.com/collections/bestselling/products.json?page=${page}`
      
      console.log(`📡 Consultando página ${page}...`)
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
      
      if (data.products.length === 0) {
        hasMore = false
        break
      }
      
      // Filtrar solo productos de Arabiyat Sugar
      const sugarProducts = data.products.filter(p => 
        p.title.toLowerCase().includes('arabiyat sugar')
      )
      
      allProducts.push(...sugarProducts)
      console.log(`  ✓ Página ${page}: ${sugarProducts.length} productos Sugar (Total: ${allProducts.length})`)
      
      if (data.products.length < 30) {
        hasMore = false
      } else {
        page++
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }
    
    console.log(`\n✓ Total encontrados: ${allProducts.length} productos Sugar\n`)
    return allProducts
  } catch (error: any) {
    console.error('✗ Error obteniendo productos:', error.message)
    return allProducts
  }
}

async function downloadAndUploadImage(imageUrl: string, productName: string): Promise<string> {
  try {
    if (!imageUrl || imageUrl.startsWith('data:')) {
      return ''
    }
    
    let cleanUrl = imageUrl.split('?')[0]
    cleanUrl = cleanUrl.replace(/_[0-9]+x[0-9]+\./g, '.')
    
    console.log(`  📥 Descargando imagen...`)
    const response = await fetch(cleanUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://fragrancewholesalerusa.com/'
      }
    })
    
    if (!response.ok) {
      return ''
    }
    
    const buffer = Buffer.from(await response.arrayBuffer())
    
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
    const ext = cleanUrl.includes('.webp') ? 'webp' : 'jpg'
    const fileName = `${sanitizedName}-${timestamp}-${randomId}.${ext}`
    const b2Path = `perfumes/arabiyat-sugar/${fileName}`
    
    console.log(`  📤 Subiendo a B2...`)
    const command = new PutObjectCommand({
      Bucket: b2Config.bucketName,
      Key: b2Path,
      Body: buffer,
      ContentType: ext === 'webp' ? 'image/webp' : 'image/jpeg',
    })
    
    await s3Client.send(command)
    
    const imageUrl_proxy = `/api/b2/image?path=${encodeURIComponent(b2Path)}`
    console.log(`  ✓ Imagen subida`)
    return imageUrl_proxy
  } catch (error: any) {
    return ''
  }
}

function normalizeProductName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function productsMatch(shopifyName: string, firestoreName: string): boolean {
  const normalizedShopify = normalizeProductName(shopifyName)
  const normalizedFirestore = normalizeProductName(firestoreName)
  
  if (normalizedShopify === normalizedFirestore) {
    return true
  }
  
  const shopifyWords = normalizedShopify.split(' ').filter(w => w.length > 2)
  const firestoreWords = normalizedFirestore.split(' ').filter(w => w.length > 2)
  const matchCount = shopifyWords.filter(w => firestoreWords.some(f => f.includes(w) || w.includes(f))).length
  const matchRatio = matchCount / Math.max(shopifyWords.length, firestoreWords.length)
  
  return matchRatio >= 0.8
}

async function fixSugarImages() {
  console.log('🚀 Verificando y actualizando imágenes de productos Arabiyat Sugar...\n')
  
  // Obtener productos de Shopify
  const shopifyProducts = await getShopifySugarProducts()
  
  if (shopifyProducts.length === 0) {
    console.log('⚠ No se encontraron productos Sugar en Shopify')
    return
  }
  
  // Obtener productos de Firestore
  const firestorePerfumes = await getAllPerfumes()
  const sugarPerfumes = firestorePerfumes.filter(p => 
    p.name.toLowerCase().includes('arabiyat sugar')
  )
  
  console.log(`📦 Productos Sugar en Firestore: ${sugarPerfumes.length}\n`)
  
  let updatedCount = 0
  let skippedCount = 0
  let errorCount = 0
  let noImageCount = 0
  
  for (const firestoreProduct of sugarPerfumes) {
    try {
      if (!firestoreProduct.id) {
        console.log(`⚠ Saltando producto sin ID: ${firestoreProduct.name}`)
        skippedCount++
        continue
      }
      
      // Verificar si tiene imagen
      const hasImage = firestoreProduct.imageUrl && 
                      !firestoreProduct.imageUrl.includes('...') &&
                      firestoreProduct.imageUrl.trim() !== ''
      
      if (hasImage) {
        console.log(`✓ Ya tiene imagen: ${firestoreProduct.name}`)
        skippedCount++
        continue
      }
      
      console.log(`\n📝 Sin imagen: ${firestoreProduct.name}`)
      
      // Buscar producto correspondiente en Shopify
      const matchingShopify = shopifyProducts.find(sp => 
        productsMatch(sp.title, firestoreProduct.name)
      )
      
      if (!matchingShopify || matchingShopify.images.length === 0) {
        console.log(`  ⚠ No se encontró en Shopify o no tiene imagen`)
        noImageCount++
        continue
      }
      
      console.log(`  🖼️ Imagen encontrada en Shopify`)
      
      // Descargar y subir imagen
      const imageUrl = await downloadAndUploadImage(matchingShopify.images[0].src, firestoreProduct.name)
      
      if (!imageUrl) {
        console.log(`  ⚠ No se pudo subir la imagen`)
        noImageCount++
        continue
      }
      
      // Actualizar producto
      await updatePerfume(firestoreProduct.id, { imageUrl })
      console.log(`  ✓ Actualizado en Firestore (ID: ${firestoreProduct.id})`)
      updatedCount++
      
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
  console.log(`✓ Ya tenían imagen: ${skippedCount}`)
  console.log(`⚠ Sin imagen disponible: ${noImageCount}`)
  console.log(`✗ Errores: ${errorCount}`)
  console.log(`📦 Total procesado: ${sugarPerfumes.length}`)
  console.log('='.repeat(50))
}

fixSugarImages().catch((error) => {
  console.error('Error fatal:', error)
  process.exit(1)
})

