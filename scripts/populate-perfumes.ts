// Script para poblar la base de datos de Firebase con los perfumes de Arabiyat Prestige USA
// Ejecutar con: npx tsx scripts/populate-perfumes.ts

import { addPerfume } from '../lib/firebase/perfumes'

const perfumes = [
  // For Her
  { name: 'Arabiyat Prestige Nyla Eau De Parfum 2.7FL.OZ For Women', price: 34.99, originalPrice: 49.99, category: 'For Her' as const, size: '2.7FL.OZ', inStock: true },
  { name: 'Arabiyat Prestige La Di Da Eau De Parfum 3.4FL.OZ For Her', price: 49.99, category: 'For Her' as const, size: '3.4FL.OZ', inStock: true },
  { name: 'Arabiyat Prestige Lady Bird Eau De Parfum 3.4FL.OZ', price: 34.99, originalPrice: 59.99, category: 'For Her' as const, size: '3.4FL.OZ', inStock: true },
  { name: 'Arabiyat Prestige Safa Eau De Parfum 3.4FL.OZ For Women', price: 48.99, originalPrice: 69.99, category: 'For Her' as const, size: '3.4FL.OZ', inStock: true },
  { name: 'Arabiyat Prestige Kohl Luminous Eau De Parfum 3.4FL.OZ', price: 69.99, category: 'For Her' as const, size: '3.4FL.OZ', inStock: false },
  { name: 'Arabiyat Prestige Omniya Eau De Parfum 3.4FL.OZ', price: 69.99, category: 'For Her' as const, size: '3.4FL.OZ', inStock: true },
  { name: 'Arabiyat Prestige Yumun Eau De Parfum 3.4FL.OZ', price: 69.99, category: 'For Her' as const, size: '3.4FL.OZ', inStock: true },
  { name: 'Arabiyat Prestige Bahiya Garnet Eau De Parfum 3.4FL.OZ For Women', price: 49.99, originalPrice: 69.99, category: 'For Her' as const, size: '3.4FL.OZ', inStock: true },
  { name: 'Arabiyat Lutfah Light In The Heart Eau De Parfum 2.7FL.OZ', price: 59.99, category: 'For Her' as const, size: '2.7FL.OZ', inStock: true },
  
  // For Him
  { name: 'Arabiyat Prestige Marwa Eau De Parfum 3.4FL.OZ For Men', price: 49.99, originalPrice: 59.99, category: 'For Him' as const, size: '3.4FL.OZ', inStock: false },
  { name: 'Arabiyat Prestige The Sheikh Rau De Parfum 2.5FL.OZ For Men', price: 49.99, category: 'For Him' as const, size: '2.5FL.OZ', inStock: true },
  { name: 'Arabiyat Prestige The Hero Eau De Parfum 2.5FL.OZ For Men', price: 49.99, category: 'For Him' as const, size: '2.5FL.OZ', inStock: true },
  { name: 'Arabiyat Prestige The Brave Eau De Parfum 2.5FL.OZ For Men', price: 49.99, originalPrice: 69.99, category: 'For Him' as const, size: '2.5FL.OZ', inStock: true },
  { name: 'Arabiyat Prestige La-Di-Da Eau De Parfum 3.4FL.OZ For Him', price: 49.99, category: 'For Him' as const, size: '3.4FL.OZ', inStock: true },
  
  // For Both / Unisex
  { name: 'Arabiyat Prestige Al Noor Eau De Parfum 3.4FL.OZ', price: 44.99, category: 'For Both' as const, size: '3.4FL.OZ', inStock: true },
  { name: 'Arabiyat Prestige Aariz Intense Eau De Parfum 3.4FL.OZ', price: 44.99, category: 'For Both' as const, size: '3.4FL.OZ', inStock: true },
  { name: 'Arabiyat Prestige Hypnotic Vanilla Eau De Parfum 3.4FL.OZ', price: 47.99, category: 'For Both' as const, size: '3.4FL.OZ', inStock: true },
  { name: 'Arabiyat Prestige Lutfah The Seventh Heaven Eau De Parfum 2.7FL.OZ', price: 44.99, category: 'For Both' as const, size: '2.7FL.OZ', inStock: true },
  { name: 'Arabiyat Prestige Nyla Suede Eau De Parfum 2.7FL.OZ', price: 47.99, originalPrice: 49.99, category: 'For Both' as const, size: '2.7FL.OZ', inStock: true },
  { name: 'Arabiyat Prestige Nayel Oud Eau De Parfum 2.4FL.OZ', price: 49.99, category: 'For Both' as const, size: '2.4FL.OZ', inStock: true },
  { name: 'Arabiyat Prestige Dubai Chocolate Eau De Parfum 3.4FL.OZ', price: 36.99, originalPrice: 49.99, category: 'For Both' as const, size: '3.4FL.OZ', inStock: true },
  { name: 'Arabiyat Prestige Al Dhahab Eau De Parfum 3.4FL.OZ For Unisex', price: 47.99, originalPrice: 69.99, category: 'For Both' as const, size: '3.4FL.OZ', inStock: true },
  
  // Concentrated Perfume Oils (For Both)
  { name: 'Arabiyat Jawharat Al Hayat Concentrated Perfume Oil 0.40FL.OZ For Unisex', price: 19.99, category: 'For Both' as const, size: '0.40FL.OZ', inStock: true },
  { name: 'Arabiyat Oud Al Layl Concentrated Perfume Oil 0.40FL.OZ for Unisex', price: 19.99, category: 'For Both' as const, size: '0.40FL.OZ', inStock: true },
  { name: 'Arabiyat Musk Tahira Concentrated Perfume Oil 0.40FL.OZ For Unisex', price: 19.99, category: 'For Both' as const, size: '0.40FL.OZ', inStock: true },
  { name: 'Arabiyat Lamsat Harir Concentrated Perfume Oil 0.40FL.OZ For Unisex', price: 19.99, category: 'For Both' as const, size: '0.40FL.OZ', inStock: true },
  { name: 'Arabiyat Elham Concentrated Perfume Oil 0.40FL.OZ for Unisex', price: 19.99, category: 'For Both' as const, size: '0.40FL.OZ', inStock: true },
  { name: 'Arabiyat White Musk Concentrated Perfume Oil 0.40FL.OZ for Unisex', price: 19.99, category: 'For Both' as const, size: '0.40FL.OZ', inStock: true },
  { name: 'Arabiyat Zuhur Lak Concentrated Perfume Oil 0.40FL.OZ For Unisex', price: 19.99, category: 'For Both' as const, size: '0.40FL.OZ', inStock: true },
  { name: 'Arabiyat Intense Musk Concentrated Perfume Oil 0.40 FL.OZ For Unisex', price: 19.99, category: 'For Both' as const, size: '0.40FL.OZ', inStock: true },
]

async function populateDatabase() {
  console.log('Iniciando población de base de datos con productos de Arabiyat Prestige USA...')
  console.log(`Total de productos a agregar: ${perfumes.length}`)
  
  let successCount = 0
  let errorCount = 0
  
  for (const perfume of perfumes) {
    try {
      const id = await addPerfume(perfume)
      console.log(`✓ Agregado: ${perfume.name} (ID: ${id})`)
      successCount++
    } catch (error) {
      console.error(`✗ Error agregando ${perfume.name}:`, error)
      errorCount++
    }
  }
  
  console.log('\n=== Resumen ===')
  console.log(`✓ Exitosos: ${successCount}`)
  console.log(`✗ Errores: ${errorCount}`)
  console.log(`Total: ${perfumes.length}`)
  console.log('\n¡Población completada!')
  process.exit(0)
}

populateDatabase().catch((error) => {
  console.error('Error fatal:', error)
  process.exit(1)
})
