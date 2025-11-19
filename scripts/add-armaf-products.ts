// Script para agregar todos los productos de la marca Armaf desde Shopify
// Ejecutar con: npx tsx scripts/add-armaf-products.ts

import { getAllPerfumes, addPerfume } from '../lib/firebase/perfumes'
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
    compare_at_price: string | null
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
  console.log('🔍 Obteniendo productos Armaf desde la API de Shopify...\n')
  
  const allProducts: ShopifyProduct[] = []
  let page = 1
  let hasMore = true
  
  try {
    while (hasMore) {
      const url = `https://fragrancewholesalerusa.com/collections/all/products.json?page=${page}`
      
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
      
      // Filtrar solo productos de Armaf
      const armafProducts = data.products.filter(p => 
        p.vendor.toLowerCase().includes('armaf') ||
        p.title.toLowerCase().includes('armaf')
      )
      
      allProducts.push(...armafProducts)
      console.log(`  ✓ Página ${page}: ${armafProducts.length} productos Armaf (Total: ${allProducts.length})`)
      
      if (data.products.length < 30) {
        hasMore = false
      } else {
        page++
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }
    
    console.log(`\n✓ Total encontrados: ${allProducts.length} productos Armaf\n`)
    return allProducts
  } catch (error: any) {
    console.error('✗ Error obteniendo productos:', error.message)
    if (allProducts.length > 0) {
      console.log(`⚠ Retornando ${allProducts.length} productos obtenidos antes del error`)
    }
    return allProducts
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

function determineCategory(vendor: string, title: string, tags: string[]): 'For Her' | 'For Him' | 'For Both' {
  const lowerTitle = title.toLowerCase()
  const lowerVendor = vendor.toLowerCase()
  const lowerTags = tags.map(t => t.toLowerCase()).join(' ')
  
  const combined = `${lowerTitle} ${lowerVendor} ${lowerTags}`
  
  if (combined.includes('for women') || combined.includes('for her') || combined.includes('women')) {
    return 'For Her'
  }
  
  if (combined.includes('for men') || combined.includes('for him') || combined.includes('men')) {
    return 'For Him'
  }
  
  if (combined.includes('unisex') || combined.includes('for both')) {
    return 'For Both'
  }
  
  return 'For Both'
}

function extractSize(title: string): string {
  const sizeMatch = title.match(/(\d+\.?\d*)\s*FL\.?OZ/i) || 
                   title.match(/(\d+)\s*ML/i) ||
                   title.match(/(\d+\.?\d*)\s*OZ/i)
  if (sizeMatch) {
    if (title.includes('ML')) {
      return `${sizeMatch[1]}ML`
    }
    if (title.includes('OZ')) {
      return `${sizeMatch[1]}FL.OZ`
    }
  }
  return '3.4FL.OZ' // Default
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
    const ext = cleanUrl.includes('.webp') ? 'webp' : (cleanUrl.includes('.png') ? 'png' : 'jpg')
    const fileName = `${sanitizedName}-${timestamp}-${randomId}.${ext}`
    const b2Path = `perfumes/armaf/${fileName}`
    
    console.log(`  📤 Subiendo a B2...`)
    const command = new PutObjectCommand({
      Bucket: b2Config.bucketName,
      Key: b2Path,
      Body: buffer,
      ContentType: ext === 'webp' ? 'image/webp' : (ext === 'png' ? 'image/png' : 'image/jpeg'),
    })
    
    await s3Client.send(command)
    
    const imageUrl_proxy = `/api/b2/image?path=${encodeURIComponent(b2Path)}`
    console.log(`  ✓ Imagen subida`)
    return imageUrl_proxy
  } catch (error: any) {
    return ''
  }
}

async function addArmafProducts() {
  console.log('🚀 Iniciando agregado de productos Armaf...\n')
  
  // Obtener productos de Shopify
  const shopifyProducts = await getShopifyProducts()
  
  if (shopifyProducts.length === 0) {
    console.log('⚠ No se encontraron productos Armaf en Shopify')
    return
  }
  
  // Obtener productos existentes en Firestore
  const firestorePerfumes = await getAllPerfumes()
  console.log(`📦 Productos existentes en Firestore: ${firestorePerfumes.length}\n`)
  
  let addedCount = 0
  let skippedCount = 0
  let errorCount = 0
  
  for (const shopifyProduct of shopifyProducts) {
    try {
      // Verificar si el producto ya existe
      const exists = firestorePerfumes.some(fp => 
        productsMatch(shopifyProduct.title, fp.name)
      )
      
      if (exists) {
        console.log(`⏭ Ya existe: ${shopifyProduct.title}`)
        skippedCount++
        continue
      }
      
      console.log(`\n📝 Agregando: ${shopifyProduct.title}`)
      
      // Obtener precio (usar el primer variant)
      const variant = shopifyProduct.variants[0]
      // Los precios de Shopify vienen como strings, parsearlos directamente
      const price = parseFloat(variant.price)
      const originalPrice = variant.compare_at_price ? parseFloat(variant.compare_at_price) : undefined
      
      console.log(`  💰 Precio raw: ${variant.price} -> $${price.toFixed(2)}${originalPrice ? ` (Original: $${originalPrice.toFixed(2)})` : ''}`)
      
      // Determinar categoría
      const category = determineCategory(shopifyProduct.vendor, shopifyProduct.title, shopifyProduct.tags)
      
      // Extraer tamaño
      const size = extractSize(shopifyProduct.title)
      
      // Descargar y subir imagen
      let imageUrl = ''
      if (shopifyProduct.images.length > 0) {
        imageUrl = await downloadAndUploadImage(shopifyProduct.images[0].src, shopifyProduct.title)
      }
      
      // Crear producto
      const perfumeData: any = {
        name: shopifyProduct.title,
        price: price,
        category: category,
        brand: 'Armaf',
        size: size,
        inStock: true,
        description: `${shopifyProduct.title} - ${shopifyProduct.vendor}`,
      }
      
      if (originalPrice && originalPrice > price) {
        perfumeData.originalPrice = originalPrice
      }
      
      if (imageUrl) {
        perfumeData.imageUrl = imageUrl
      }
      
      const id = await addPerfume(perfumeData)
      console.log(`  ✓ Agregado a Firestore (ID: ${id})`)
      addedCount++
      
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
  console.log(`✓ Agregados: ${addedCount}`)
  console.log(`⏭ Ya existían: ${skippedCount}`)
  console.log(`✗ Errores: ${errorCount}`)
  console.log(`📦 Total procesado: ${shopifyProducts.length}`)
  console.log('='.repeat(50))
}

addArmafProducts().catch((error) => {
  console.error('Error fatal:', error)
  process.exit(1)
})

