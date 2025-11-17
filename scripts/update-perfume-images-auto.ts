// Script para actualizar automáticamente las URLs de imágenes basándose en patrones comunes
// Ejecutar con: npx tsx scripts/update-perfume-images-auto.ts

import { getAllPerfumes, updatePerfume } from '../lib/firebase/perfumes'

/**
 * Genera una URL de imagen basada en el nombre del perfume
 * Intenta diferentes patrones comunes de WordPress
 */
function generateImageUrls(perfumeName: string): string[] {
  const urls: string[] = []
  
  // Extraer el nombre principal del perfume
  let mainName = perfumeName
    .replace(/Arabiyat (?:Prestige )?/gi, '')
    .replace(/ Eau De Parfum.*$/i, '')
    .replace(/ Concentrated Perfume Oil.*$/i, '')
    .replace(/ For (Her|Him|Women|Men|Unisex).*$/i, '')
    .replace(/ \d+\.\d+FL\.OZ.*$/i, '')
    .trim()
  
  // Limpiar y normalizar el nombre
  const cleanName = mainName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  
  // Generar variaciones comunes de URLs
  const baseUrl = 'https://arabiyatprestigeus.com'
  
  // Patrón 1: wp-content/uploads/nombre.jpg
  urls.push(`${baseUrl}/wp-content/uploads/${cleanName}.jpg`)
  urls.push(`${baseUrl}/wp-content/uploads/${cleanName}.png`)
  urls.push(`${baseUrl}/wp-content/uploads/${cleanName}-1.jpg`)
  
  // Patrón 2: wp-content/uploads/YYYY/MM/nombre.jpg
  const year = new Date().getFullYear()
  const month = String(new Date().getMonth() + 1).padStart(2, '0')
  urls.push(`${baseUrl}/wp-content/uploads/${year}/${month}/${cleanName}.jpg`)
  
  // Patrón 3: productos/nombre.jpg
  urls.push(`${baseUrl}/productos/${cleanName}.jpg`)
  urls.push(`${baseUrl}/products/${cleanName}.jpg`)
  
  // Patrón 4: images/nombre.jpg
  urls.push(`${baseUrl}/images/${cleanName}.jpg`)
  
  return urls
}

/**
 * Verifica si una URL de imagen es válida
 */
async function checkImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' })
    // Con no-cors no podemos verificar el status, pero intentamos
    return true
  } catch {
    return false
  }
}

async function updatePerfumeImagesAuto() {
  console.log('Iniciando actualización automática de URLs de imágenes...\n')
  
  try {
    const perfumes = await getAllPerfumes()
    console.log(`Total de perfumes: ${perfumes.length}\n`)
    
    let updatedCount = 0
    let skippedCount = 0
    let errorCount = 0
    
    for (const perfume of perfumes) {
      if (!perfume.id) {
        console.log(`⚠ Saltando perfume sin ID: ${perfume.name}`)
        skippedCount++
        continue
      }
      
      // Si ya tiene imagen, saltar
      if (perfume.imageUrl && !perfume.imageUrl.includes('...')) {
        console.log(`⏭ Ya tiene imagen: ${perfume.name}`)
        skippedCount++
        continue
      }
      
      // Generar URLs posibles
      const possibleUrls = generateImageUrls(perfume.name)
      const imageUrl = possibleUrls[0] // Usar la primera URL generada
      
      console.log(`📝 Actualizando: ${perfume.name}`)
      console.log(`   URL generada: ${imageUrl}`)
      
      try {
        await updatePerfume(perfume.id, { imageUrl })
        console.log(`✓ Actualizado exitosamente\n`)
        updatedCount++
      } catch (error) {
        console.error(`✗ Error: ${error}\n`)
        errorCount++
      }
      
      // Pequeña pausa para no sobrecargar
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log('\n=== Resumen ===')
    console.log(`✓ Actualizados: ${updatedCount}`)
    console.log(`⏭ Saltados: ${skippedCount}`)
    console.log(`✗ Errores: ${errorCount}`)
    console.log(`Total: ${perfumes.length}`)
    
    console.log('\n💡 Nota: Las URLs se generaron automáticamente.')
    console.log('   Si alguna imagen no se muestra, verifica la URL en el sitio web')
    console.log('   y actualízala manualmente en Firebase Console o usando el script update-perfume-images.ts')
    
    console.log('\n¡Actualización completada!')
    process.exit(0)
  } catch (error) {
    console.error('Error fatal:', error)
    process.exit(1)
  }
}

updatePerfumeImagesAuto()

