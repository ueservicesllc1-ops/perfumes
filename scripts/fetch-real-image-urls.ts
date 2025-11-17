// Script para obtener las URLs reales de las imágenes desde arabiyatprestigeus.com
// Ejecutar con: npx tsx scripts/fetch-real-image-urls.ts

import { getAllPerfumes, updatePerfume } from '../lib/firebase/perfumes'

/**
 * Normaliza el nombre del perfume para buscar en el sitio web
 */
function normalizePerfumeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/arabiyat (?:prestige )?/gi, '')
    .replace(/ eau de parfum.*$/i, '')
    .replace(/ concentrated perfume oil.*$/i, '')
    .replace(/ for (her|him|women|men|unisex).*$/i, '')
    .replace(/ \d+\.\d+fl\.oz.*$/i, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Busca la URL de la imagen en el sitio web
 */
async function findImageUrl(perfumeName: string): Promise<string | null> {
  const normalizedName = normalizePerfumeName(perfumeName)
  const baseUrl = 'https://arabiyatprestigeus.com'
  
  // Intentar diferentes patrones de URL
  const possiblePaths = [
    `/wp-content/uploads/${normalizedName}.jpg`,
    `/wp-content/uploads/${normalizedName}.png`,
    `/wp-content/uploads/${normalizedName}.webp`,
    `/wp-content/uploads/${normalizedName}-1.jpg`,
    `/wp-content/uploads/${normalizedName}-1.png`,
    `/productos/${normalizedName}.jpg`,
    `/products/${normalizedName}.jpg`,
    `/images/${normalizedName}.jpg`,
  ]
  
  // También intentar con el nombre completo del producto
  const fullName = perfumeName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
  
  possiblePaths.push(
    `/wp-content/uploads/${fullName}.jpg`,
    `/wp-content/uploads/${fullName}.png`,
    `/productos/${fullName}.jpg`,
    `/products/${fullName}.jpg`
  )
  
  // Verificar cada URL
  for (const path of possiblePaths) {
    const url = `${baseUrl}${path}`
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(5000)
      })
      if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
        return url
      }
    } catch (error) {
      // Continuar con la siguiente URL
      continue
    }
  }
  
  return null
}

/**
 * Busca la imagen en la página del producto
 */
async function findImageFromProductPage(perfumeName: string): Promise<string | null> {
  try {
    const searchName = normalizePerfumeName(perfumeName)
    const searchUrl = `https://arabiyatprestigeus.com/?s=${encodeURIComponent(searchName)}`
    
    const response = await fetch(searchUrl, {
      signal: AbortSignal.timeout(10000)
    })
    
    if (!response.ok) return null
    
    const html = await response.text()
    
    // Buscar URLs de imágenes en el HTML
    const imageRegex = /https?:\/\/arabiyatprestigeus\.com\/wp-content\/uploads\/[^"'\s]+\.(jpg|jpeg|png|webp)/gi
    const matches = html.match(imageRegex)
    
    if (matches && matches.length > 0) {
      // Retornar la primera imagen encontrada
      return matches[0]
    }
  } catch (error) {
    console.error(`Error buscando en página de producto: ${error}`)
  }
  
  return null
}

async function updateRealImageUrls() {
  console.log('Iniciando búsqueda de URLs reales de imágenes...\n')
  
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
      
      // Si ya tiene una URL válida que funciona, saltar
      if (perfume.imageUrl && perfume.imageUrl.includes('arabiyatprestigeus.com')) {
        try {
          const testResponse = await fetch(perfume.imageUrl, { 
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
      
      // Intentar encontrar la imagen
      let imageUrl = await findImageUrl(perfume.name)
      
      if (!imageUrl) {
        imageUrl = await findImageFromProductPage(perfume.name)
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
      await new Promise(resolve => setTimeout(resolve, 1000))
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
      console.log('   3. Copia la URL de la imagen')
      console.log('   4. Usa el script update-perfume-images.ts para actualizar')
    }
    
    console.log('\n¡Búsqueda completada!')
    process.exit(0)
  } catch (error) {
    console.error('Error fatal:', error)
    process.exit(1)
  }
}

updateRealImageUrls()

