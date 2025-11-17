// Script para actualizar las URLs de las imágenes de los perfumes desde arabiyatprestigeus.com
// Ejecutar con: npx tsx scripts/update-perfume-images.ts

import { getAllPerfumes, updatePerfume } from '../lib/firebase/perfumes'

// Mapeo de nombres de perfumes a URLs de imágenes de arabiyatprestigeus.com
// Completa las URLs según las imágenes reales del sitio web
const imageUrlMap: Record<string, string> = {
  // For Her
  'Arabiyat Prestige Nyla Eau De Parfum 2.7FL.OZ For Women': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
  'Arabiyat Prestige La Di Da Eau De Parfum 3.4FL.OZ For Her': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
  'Arabiyat Prestige Lady Bird Eau De Parfum 3.4FL.OZ': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
  'Arabiyat Prestige Safa Eau De Parfum 3.4FL.OZ For Women': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
  'Arabiyat Prestige Kohl Luminous Eau De Parfum 3.4FL.OZ': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
  'Arabiyat Prestige Omniya Eau De Parfum 3.4FL.OZ': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
  'Arabiyat Prestige Yumun Eau De Parfum 3.4FL.OZ': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
  'Arabiyat Prestige Bahiya Garnet Eau De Parfum 3.4FL.OZ For Women': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
  'Arabiyat Lutfah Light In The Heart Eau De Parfum 2.7FL.OZ': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
  
  // For Him
  'Arabiyat Prestige Marwa Eau De Parfum 3.4FL.OZ For Men': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
  'Arabiyat Prestige The Sheikh Rau De Parfum 2.5FL.OZ For Men': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
  'Arabiyat Prestige The Hero Eau De Parfum 2.5FL.OZ For Men': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
  'Arabiyat Prestige The Brave Eau De Parfum 2.5FL.OZ For Men': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
  'Arabiyat Prestige La-Di-Da Eau De Parfum 3.4FL.OZ For Him': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
  
  // For Both / Unisex
  'Arabiyat Prestige Al Noor Eau De Parfum 3.4FL.OZ': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
  'Arabiyat Prestige Aariz Intense Eau De Parfum 3.4FL.OZ': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
  'Arabiyat Prestige Hypnotic Vanilla Eau De Parfum 3.4FL.OZ': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
  'Arabiyat Prestige Lutfah The Seventh Heaven Eau De Parfum 2.7FL.OZ': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
  'Arabiyat Prestige Nyla Suede Eau De Parfum 2.7FL.OZ': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
  'Arabiyat Prestige Nayel Oud Eau De Parfum 2.4FL.OZ': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
  'Arabiyat Prestige Dubai Chocolate Eau De Parfum 3.4FL.OZ': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
  'Arabiyat Prestige Al Dhahab Eau De Parfum 3.4FL.OZ For Unisex': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
  
  // Concentrated Perfume Oils
  'Arabiyat Jawharat Al Hayat Concentrated Perfume Oil 0.40FL.OZ For Unisex': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
  'Arabiyat Oud Al Layl Concentrated Perfume Oil 0.40FL.OZ for Unisex': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
  'Arabiyat Musk Tahira Concentrated Perfume Oil 0.40FL.OZ For Unisex': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
  'Arabiyat Lamsat Harir Concentrated Perfume Oil 0.40FL.OZ For Unisex': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
  'Arabiyat Elham Concentrated Perfume Oil 0.40FL.OZ for Unisex': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
  'Arabiyat White Musk Concentrated Perfume Oil 0.40FL.OZ for Unisex': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
  'Arabiyat Zuhur Lak Concentrated Perfume Oil 0.40FL.OZ For Unisex': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
  'Arabiyat Intense Musk Concentrated Perfume Oil 0.40 FL.OZ For Unisex': 'https://arabiyatprestigeus.com/wp-content/uploads/...',
}

/**
 * Función auxiliar para generar URL basada en el nombre del perfume
 * Puedes modificar esta función según la estructura de URLs del sitio
 */
function generateImageUrl(perfumeName: string): string | null {
  // Extraer el nombre principal del perfume (antes de "Eau De Parfum")
  const nameMatch = perfumeName.match(/Arabiyat (?:Prestige )?([^E]+?)(?: Eau De Parfum| Concentrated)/i)
  if (!nameMatch) return null
  
  const mainName = nameMatch[1].trim()
    .replace(/\s+/g, '-')
    .toLowerCase()
  
  // Generar URL basada en el patrón común de WordPress
  // Ajusta esto según la estructura real del sitio
  return `https://arabiyatprestigeus.com/wp-content/uploads/${mainName}.jpg`
}

async function updatePerfumeImages() {
  console.log('Iniciando actualización de URLs de imágenes desde arabiyatprestigeus.com...\n')
  
  try {
    // Obtener todos los perfumes
    const perfumes = await getAllPerfumes()
    console.log(`Total de perfumes encontrados: ${perfumes.length}\n`)
    
    let updatedCount = 0
    let skippedCount = 0
    let errorCount = 0
    
    for (const perfume of perfumes) {
      if (!perfume.id) {
        console.log(`⚠ Saltando perfume sin ID: ${perfume.name}`)
        skippedCount++
        continue
      }
      
      // Buscar URL en el mapeo
      let imageUrl = imageUrlMap[perfume.name]
      
      // Si no está en el mapeo, intentar generar una URL
      if (!imageUrl || imageUrl.includes('...')) {
        const generatedUrl = generateImageUrl(perfume.name)
        if (generatedUrl) {
          imageUrl = generatedUrl
          console.log(`📝 URL generada para: ${perfume.name}`)
          console.log(`   URL: ${imageUrl}`)
        }
      }
      
      // Si aún no hay URL, saltar este perfume
      if (!imageUrl || imageUrl.includes('...')) {
        console.log(`⏭ Saltando ${perfume.name} - URL no configurada`)
        skippedCount++
        continue
      }
      
      try {
        // Actualizar el perfume con la nueva URL
        await updatePerfume(perfume.id, { imageUrl })
        console.log(`✓ Actualizado: ${perfume.name}`)
        console.log(`   URL: ${imageUrl}\n`)
        updatedCount++
      } catch (error) {
        console.error(`✗ Error actualizando ${perfume.name}:`, error)
        errorCount++
      }
    }
    
    console.log('\n=== Resumen ===')
    console.log(`✓ Actualizados: ${updatedCount}`)
    console.log(`⏭ Saltados (sin URL): ${skippedCount}`)
    console.log(`✗ Errores: ${errorCount}`)
    console.log(`Total procesados: ${perfumes.length}`)
    
    if (skippedCount > 0) {
      console.log('\n💡 Para completar las URLs faltantes:')
      console.log('1. Visita https://arabiyatprestigeus.com')
      console.log('2. Encuentra cada producto y copia la URL de su imagen')
      console.log('3. Actualiza el objeto imageUrlMap en este script')
      console.log('4. Ejecuta el script nuevamente')
    }
    
    console.log('\n¡Actualización completada!')
    process.exit(0)
  } catch (error) {
    console.error('Error fatal:', error)
    process.exit(1)
  }
}

updatePerfumeImages()

