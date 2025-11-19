// Script para corregir los precios de productos Armaf existentes
// Ejecutar con: npx tsx scripts/fix-armaf-prices.ts

import { getAllPerfumes, updatePerfume } from '../lib/firebase/perfumes'
import fetch from 'node-fetch'

interface ShopifyProduct {
  id: number
  title: string
  vendor: string
  variants: Array<{
    id: number
    title: string
    price: string
    compare_at_price: string | null
  }>
}

interface ShopifyCollection {
  products: ShopifyProduct[]
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

async function getAllShopifyArmafProducts(): Promise<ShopifyProduct[]> {
  console.log('🔍 Obteniendo productos Armaf desde Shopify...\n')
  
  const allProducts: ShopifyProduct[] = []
  let page = 1
  let hasMore = true
  
  try {
    while (hasMore) {
      const url = `https://fragrancewholesalerusa.com/collections/all/products.json?page=${page}`
      
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
      
      const armafProducts = data.products.filter(p => 
        p.vendor.toLowerCase().includes('armaf') ||
        p.title.toLowerCase().includes('armaf')
      )
      
      allProducts.push(...armafProducts)
      
      if (data.products.length < 30) {
        hasMore = false
      } else {
        page++
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }
    
    console.log(`✓ Total encontrados en Shopify: ${allProducts.length} productos\n`)
    return allProducts
  } catch (error: any) {
    console.error('✗ Error obteniendo productos:', error.message)
    return allProducts
  }
}

async function fixArmafPrices() {
  console.log('🚀 Iniciando corrección de precios Armaf...\n')
  
  // Obtener productos de Firestore
  const firestorePerfumes = await getAllPerfumes()
  const armafPerfumes = firestorePerfumes.filter(p => 
    p.brand?.toLowerCase().includes('armaf') ||
    p.name.toLowerCase().includes('armaf')
  )
  
  console.log(`📦 Productos Armaf en Firestore: ${armafPerfumes.length}\n`)
  
  // Obtener productos de Shopify
  const shopifyProducts = await getAllShopifyArmafProducts()
  
  if (shopifyProducts.length === 0) {
    console.log('⚠ No se encontraron productos Armaf en Shopify')
    return
  }
  
  let updatedCount = 0
  let notFoundCount = 0
  let errorCount = 0
  
  for (const firestorePerfume of armafPerfumes) {
    try {
      // Buscar producto correspondiente en Shopify
      const shopifyProduct = shopifyProducts.find(sp => 
        productsMatch(sp.title, firestorePerfume.name)
      )
      
      if (!shopifyProduct) {
        console.log(`⚠ No encontrado en Shopify: ${firestorePerfume.name}`)
        notFoundCount++
        continue
      }
      
      // Obtener precio correcto
      const variant = shopifyProduct.variants[0]
      const correctPrice = parseFloat(variant.price)
      const correctOriginalPrice = variant.compare_at_price ? parseFloat(variant.compare_at_price) : undefined
      
      // Verificar si el precio necesita actualización
      const priceDiff = Math.abs(firestorePerfume.price - correctPrice)
      const needsUpdate = priceDiff > 0.01 // Si la diferencia es mayor a 1 centavo
      
      if (!needsUpdate) {
        console.log(`✓ Precio correcto: ${firestorePerfume.name} ($${firestorePerfume.price.toFixed(2)})`)
        continue
      }
      
      console.log(`\n📝 Actualizando: ${firestorePerfume.name}`)
      console.log(`  Precio actual: $${firestorePerfume.price.toFixed(2)}`)
      console.log(`  Precio correcto: $${correctPrice.toFixed(2)}`)
      
      // Actualizar precio
      const updateData: any = {
        price: correctPrice
      }
      
      if (correctOriginalPrice && correctOriginalPrice > correctPrice) {
        updateData.originalPrice = correctOriginalPrice
      } else if (firestorePerfume.originalPrice && !correctOriginalPrice) {
        // Si no hay precio original en Shopify pero había uno en Firestore, mantenerlo o eliminarlo
        // Por ahora lo mantenemos
      }
      
      if (firestorePerfume.id) {
        await updatePerfume(firestorePerfume.id, updateData)
        console.log(`  ✓ Actualizado en Firestore`)
        updatedCount++
      } else {
        console.log(`  ✗ No se pudo actualizar: falta ID`)
        errorCount++
      }
      
      // Delay para no sobrecargar
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error: any) {
      console.error(`  ✗ Error: ${error.message}`)
      errorCount++
    }
  }
  
  console.log('\n' + '='.repeat(50))
  console.log('📊 RESUMEN')
  console.log('='.repeat(50))
  console.log(`✓ Actualizados: ${updatedCount}`)
  console.log(`⚠ No encontrados en Shopify: ${notFoundCount}`)
  console.log(`✗ Errores: ${errorCount}`)
  console.log(`📦 Total procesado: ${armafPerfumes.length}`)
  console.log('='.repeat(50))
}

fixArmafPrices().catch((error) => {
  console.error('Error fatal:', error)
  process.exit(1)
})

