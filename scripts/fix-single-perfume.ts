// Script para corregir un perfume específico
import { getAllPerfumes, updatePerfume } from '../lib/firebase/perfumes'

async function fixJawharat() {
  try {
    const perfumes = await getAllPerfumes()
    const jawharat = perfumes.find(p => p.name.includes('Jawharat Al Hayat'))
    
    if (!jawharat || !jawharat.id) {
      console.log('Perfume no encontrado')
      return
    }
    
    console.log(`Actualizando: ${jawharat.name}`)
    console.log(`ID: ${jawharat.id}`)
    
    // Intentar con diferentes variaciones de URL
    const urls = [
      'https://arabiyatprestigeus.com/wp-content/uploads/jawharat-al-hayat.jpg',
      'https://arabiyatprestigeus.com/wp-content/uploads/jawharat.jpg',
      'https://arabiyatprestigeus.com/wp-content/uploads/jawharat-al-hayyat.jpg',
    ]
    
    for (const url of urls) {
      try {
        await updatePerfume(jawharat.id, { imageUrl: url })
        console.log(`✓ Actualizado con URL: ${url}`)
        break
      } catch (error) {
        console.log(`✗ Error con ${url}:`, error)
      }
    }
    
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

fixJawharat()

