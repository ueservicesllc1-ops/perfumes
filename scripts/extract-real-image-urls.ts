// Script para extraer las URLs reales de las imágenes desde las páginas de productos
// Ejecutar con: npx tsx scripts/extract-real-image-urls.ts

import { getAllPerfumes, updatePerfume } from '../lib/firebase/perfumes'

/**
 * Normaliza el nombre del perfume para buscar en el sitio web
 */
function normalizePerfumeNameForSearch(name: string): string {
  return name
    .replace(/Arabiyat (?:Prestige )?/gi, '')
    .replace(/ Eau De Parfum.*$/i, '')
    .replace(/ Concentrated Perfume Oil.*$/i, '')
    .replace(/ For (Her|Him|Women|Men|Unisex).*$/i, '')
    .replace(/ \d+\.\d+FL\.OZ.*$/i, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Busca la URL del producto en el sitio web
 */
async function findProductUrl(perfumeName: string): Promise<string | null> {
  const searchName = normalizePerfumeNameForSearch(perfumeName)
  
  // Intentar diferentes variaciones de URL de producto
  const possibleUrls = [
    `https://arabiyatprestigeus.com/products/${searchName}`,
    `https://arabiyatprestigeus.com/products/arabiyat-prestige-${searchName}`,
    `https://arabiyatprestigeus.com/products/arabiyat-${searchName}`,
  ]
  
  // También intentar con el nombre completo normalizado
  const fullName = perfumeName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
  
  possibleUrls.push(
    `https://arabiyatprestigeus.com/products/${fullName}`,
    `https://arabiyatprestigeus.com/products/arabiyat-prestige-${fullName}`
  )
  
  // Verificar cada URL
  for (const url of possibleUrls) {
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(5000)
      })
      if (response.ok) {
        return url
      }
    } catch (error) {
      continue
    }
  }
  
  return null
}

/**
 * Extrae la URL de la imagen desde la página del producto
 */
async function extractImageUrlFromProductPage(productUrl: string): Promise<string | null> {
  try {
    const response = await fetch(productUrl, {
      signal: AbortSignal.timeout(10000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    if (!response.ok) return null
    
    const html = await response.text()
    
    // Buscar URLs de imágenes en formato Shopify CDN
    const cdnPattern = /https?:\/\/arabiyatprestigeus\.com\/cdn\/shop\/[^"'\s<>]+\.(jpg|jpeg|png|webp)(?:\?[^"'\s<>]*)?/gi
    const matches = html.match(cdnPattern)
    
    if (matches && matches.length > 0) {
      // Filtrar para obtener la imagen principal del producto (no logos, iconos, etc.)
      const productImages = matches.filter(url => 
        !url.includes('logo') && 
        !url.includes('icon') && 
        !url.includes('banner') &&
        !url.includes('Untitleddesign_17') // Excluir imágenes genéricas
      )
      
      if (productImages.length > 0) {
        return productImages[0]
      }
      
      // Si no hay imágenes filtradas, usar la primera
      return matches[0]
    }
    
    // También buscar en formato wp-content (por si acaso)
    const wpPattern = /https?:\/\/arabiyatprestigeus\.com\/wp-content\/uploads\/[^"'\s<>]+\.(jpg|jpeg|png|webp)/gi
    const wpMatches = html.match(wpPattern)
    
    if (wpMatches && wpMatches.length > 0) {
      return wpMatches[0]
    }
  } catch (error) {
    console.error(`Error extrayendo imagen de ${productUrl}:`, error)
  }
  
  return null
}

/**
 * Busca la imagen usando búsqueda en el sitio
 */
async function findImageViaSearch(perfumeName: string): Promise<string | null> {
  try {
    const searchName = normalizePerfumeNameForSearch(perfumeName)
    const searchUrl = `https://arabiyatprestigeus.com/search?q=${encodeURIComponent(searchName)}`
    
    const response = await fetch(searchUrl, {
      signal: AbortSignal.timeout(10000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    if (!response.ok) return null
    
    const html = await response.text()
    
    // Buscar URLs de imágenes en formato Shopify CDN
    const cdnPattern = /https?:\/\/arabiyatprestigeus\.com\/cdn\/shop\/[^"'\s<>]+\.(jpg|jpeg|png|webp)(?:\?[^"'\s<>]*)?/gi
    const matches = html.match(cdnPattern)
    
    if (matches && matches.length > 0) {
      const productImages = matches.filter(url => 
        !url.includes('logo') && 
        !url.includes('icon') && 
        !url.includes('banner')
      )
      
      return productImages.length > 0 ? productImages[0] : matches[0]
    }
  } catch (error) {
    console.error(`Error en búsqueda: ${error}`)
  }
  
  return null
}

async function extractAndUpdateImageUrls() {
  console.log('Iniciando extracción de URLs reales de imágenes...\n')
  
  try {
    const perfumes = await getAllPerfumes()
    console.log(`Total de perfumes: ${perfumes.length}\n`)
    
    let updatedCount = 0
    let notFoundCount = 0
    let skippedCount = 0
    
    for (const perfume of perfumes) {
      if (!perfume.id) {
        console.log(`⚠ Saltando perfume sin ID: ${perfume.name}`)
        skippedCount++
        continue
      }
      
      // Verificar si ya tiene una URL válida de Shopify CDN
      if (perfume.imageUrl && perfume.imageUrl.includes('/cdn/shop/')) {
        try {
          const testResponse = await fetch(perfume.imageUrl.split('?')[0], { 
            method: 'HEAD',
            signal: AbortSignal.timeout(3000)
          })
          if (testResponse.ok) {
            console.log(`✓ Ya tiene imagen válida: ${perfume.name}`)
            skippedCount++
            continue
          }
        } catch {
          // Continuar para buscar nueva URL
        }
      }
      
      console.log(`🔍 Buscando imagen para: ${perfume.name}`)
      
      // Paso 1: Buscar URL del producto
      const productUrl = await findProductUrl(perfume.name)
      
      let imageUrl: string | null = null
      
      if (productUrl) {
        console.log(`   Producto encontrado: ${productUrl}`)
        // Paso 2: Extraer imagen de la página del producto
        imageUrl = await extractImageUrlFromProductPage(productUrl)
      }
      
      // Si no se encontró, intentar búsqueda
      if (!imageUrl) {
        console.log(`   Intentando búsqueda...`)
        imageUrl = await findImageViaSearch(perfume.name)
      }
      
      if (imageUrl) {
        try {
          await updatePerfume(perfume.id, { imageUrl })
          console.log(`✓ Actualizado: ${perfume.name}`)
          console.log(`   URL: ${imageUrl}\n`)
          updatedCount++
        } catch (error) {
          console.error(`✗ Error actualizando: ${error}\n`)
        }
      } else {
        console.log(`✗ No se encontró imagen para: ${perfume.name}\n`)
        notFoundCount++
      }
      
      // Pausa para no sobrecargar el servidor
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    
    console.log('\n=== Resumen ===')
    console.log(`✓ Actualizados: ${updatedCount}`)
    console.log(`✗ No encontrados: ${notFoundCount}`)
    console.log(`⏭ Saltados: ${skippedCount}`)
    console.log(`Total: ${perfumes.length}`)
    
    if (notFoundCount > 0) {
      console.log('\n💡 Para los perfumes sin imagen encontrada:')
      console.log('   1. Visita https://arabiyatprestigeus.com')
      console.log('   2. Busca cada perfume manualmente')
      console.log('   3. Copia la URL de la imagen (formato: /cdn/shop/files/...)')
      console.log('   4. Usa el script update-perfume-images.ts para actualizar')
    }
    
    console.log('\n¡Extracción completada!')
    process.exit(0)
  } catch (error) {
    console.error('Error fatal:', error)
    process.exit(1)
  }
}

extractAndUpdateImageUrls()

