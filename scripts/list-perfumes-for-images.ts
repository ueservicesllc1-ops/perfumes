// Script para listar todos los perfumes y sus IDs para facilitar la actualización de imágenes
// Ejecutar con: npx tsx scripts/list-perfumes-for-images.ts

import { getAllPerfumes } from '../lib/firebase/perfumes'

async function listPerfumes() {
  console.log('Obteniendo lista de perfumes...\n')
  
  try {
    const perfumes = await getAllPerfumes()
    
    console.log(`Total de perfumes: ${perfumes.length}\n`)
    console.log('=== Lista de Perfumes ===\n')
    
    perfumes.forEach((perfume, index) => {
      console.log(`${index + 1}. ${perfume.name}`)
      console.log(`   ID: ${perfume.id}`)
      console.log(`   Categoría: ${perfume.category}`)
      console.log(`   URL actual: ${perfume.imageUrl || 'Sin imagen'}`)
      console.log('')
    })
    
    console.log('\n=== Para actualizar las imágenes ===')
    console.log('1. Visita https://arabiyatprestigeus.com')
    console.log('2. Para cada perfume, copia la URL de la imagen')
    console.log('3. Usa el script update-perfume-images.ts con las URLs completas')
    console.log('   o actualiza manualmente en Firebase Console')
    
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

listPerfumes()

