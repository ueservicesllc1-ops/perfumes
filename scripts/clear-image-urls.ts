// Script para eliminar todas las URLs de imágenes de los perfumes
// Ejecutar con: npx tsx scripts/clear-image-urls.ts

import { getAllPerfumes, updatePerfume } from '../lib/firebase/perfumes'

async function clearImageUrls() {
  console.log('Iniciando limpieza de URLs de imágenes...\n')
  
  try {
    const perfumes = await getAllPerfumes()
    console.log(`Total de perfumes: ${perfumes.length}\n`)
    
    let clearedCount = 0
    let skippedCount = 0
    let errorCount = 0
    
    for (const perfume of perfumes) {
      if (!perfume.id) {
        console.log(`⚠ Saltando perfume sin ID: ${perfume.name}`)
        skippedCount++
        continue
      }
      
      // Si no tiene imagen, saltar
      if (!perfume.imageUrl) {
        console.log(`⏭ Sin imagen: ${perfume.name}`)
        skippedCount++
        continue
      }
      
      console.log(`📝 Limpiando: ${perfume.name}`)
      console.log(`   URL actual: ${perfume.imageUrl}`)
      
      try {
        // Establecer imageUrl como string vacío
        await updatePerfume(perfume.id, { imageUrl: '' })
        console.log(`✓ Limpiado exitosamente\n`)
        clearedCount++
      } catch (error) {
        console.error(`✗ Error: ${error}\n`)
        errorCount++
      }
      
      // Pequeña pausa para no sobrecargar
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log('\n=== Resumen ===')
    console.log(`✓ Limpiados: ${clearedCount}`)
    console.log(`⏭ Saltados: ${skippedCount}`)
    console.log(`✗ Errores: ${errorCount}`)
    console.log(`Total: ${perfumes.length}`)
    
    console.log('\n💡 Nota: Todas las URLs de imágenes han sido eliminadas.')
    console.log('   Las imágenes se subirán manualmente a B2 y se actualizarán desde el panel de administración.')
    
    console.log('\n¡Limpieza completada!')
    process.exit(0)
  } catch (error) {
    console.error('Error fatal:', error)
    process.exit(1)
  }
}

clearImageUrls()

