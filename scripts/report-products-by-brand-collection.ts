// Script para generar reporte de productos por marca y colección
// Ejecutar con: npx tsx scripts/report-products-by-brand-collection.ts

import { getAllPerfumes } from '../lib/firebase/perfumes'
import type { Perfume } from '../lib/firebase/perfumes'

interface CollectionData {
  name: string
  products: Perfume[]
  count: number
}

interface BrandData {
  name: string
  collections: Map<string, CollectionData>
  products: Perfume[]
  count: number
}

// Función para extraer la marca del nombre del perfume
function getBrandFromName(name: string, brand?: string): string {
  if (brand) {
    const lowerBrand = brand.toLowerCase()
    if (lowerBrand.includes('arabiyat')) {
      return 'Arabiyat'
    }
    if (lowerBrand.includes('armaf')) {
      return 'Armaf'
    }
    return brand
  }
  
  const lowerName = name.toLowerCase()
  if (lowerName.includes('arabiyat')) {
    return 'Arabiyat'
  }
  if (lowerName.includes('armaf')) {
    return 'Armaf'
  }
  return 'Otras'
}

// Función para extraer la colección del nombre del perfume
function getCollectionFromName(name: string): string {
  const lowerName = name.toLowerCase()
  
  // Solo Arabiyat tiene colecciones definidas
  if (lowerName.includes('arabiyat sugar')) {
    return 'Sugar'
  }
  if (lowerName.includes('arabiyat prestige')) {
    return 'Prestige'
  }
  if (lowerName.includes('arabiyat ash')) {
    return 'Ash\'aa'
  }
  
  if (lowerName.includes('arabiyat')) {
    return 'General'
  }
  
  // Para otras marcas, usar "General" como colección por defecto
  return 'General'
}


async function generateReport() {
  console.log('📊 Generando reporte de productos por marca y colección...\n')
  
  try {
    // Obtener todos los productos
    const perfumes = await getAllPerfumes()
    console.log(`✓ Total de productos en la base de datos: ${perfumes.length}\n`)
    
    // Agrupar por marca
    const brandsMap = new Map<string, BrandData>()
    
    for (const perfume of perfumes) {
      const brand = getBrandFromName(perfume.name, perfume.brand)
      
      if (!brandsMap.has(brand)) {
        brandsMap.set(brand, {
          name: brand,
          collections: new Map(),
          products: [],
          count: 0
        })
      }
      
      const brandData = brandsMap.get(brand)!
      brandData.products.push(perfume)
      brandData.count++
      
      // Agrupar por colección dentro de la marca
      const collection = getCollectionFromName(perfume.name)
      
      if (!brandData.collections.has(collection)) {
        brandData.collections.set(collection, {
          name: collection,
          products: [],
          count: 0
        })
      }
      
      const collectionData = brandData.collections.get(collection)!
      collectionData.products.push(perfume)
      collectionData.count++
    }
    
    // Ordenar marcas por cantidad de productos
    const sortedBrands = Array.from(brandsMap.values()).sort((a, b) => b.count - a.count)
    
    // Generar reporte
    console.log('='.repeat(80))
    console.log('📦 REPORTE DE PRODUCTOS POR MARCA Y COLECCIÓN')
    console.log('='.repeat(80))
    console.log()
    
    let grandTotal = 0
    
    for (const brandData of sortedBrands) {
      console.log(`\n🏷️  MARCA: ${brandData.name.toUpperCase()}`)
      console.log('-'.repeat(80))
      console.log(`   Total de productos: ${brandData.count}`)
      
      // Ordenar colecciones por cantidad de productos
      const sortedCollections = Array.from(brandData.collections.values())
        .sort((a, b) => b.count - a.count)
      
      if (sortedCollections.length > 1 || (sortedCollections.length === 1 && sortedCollections[0].name !== 'General')) {
        console.log(`\n   📚 COLECCIONES:`)
        for (const collectionData of sortedCollections) {
          console.log(`      • ${collectionData.name}: ${collectionData.count} productos`)
        }
      }
      
      grandTotal += brandData.count
    }
    
    console.log('\n' + '='.repeat(80))
    console.log('📊 RESUMEN GENERAL')
    console.log('='.repeat(80))
    console.log(`Total de productos diferentes: ${grandTotal}`)
    console.log(`Total de marcas: ${sortedBrands.length}`)
    
    // Contar total de colecciones
    let totalCollections = 0
    for (const brandData of sortedBrands) {
      totalCollections += brandData.collections.size
    }
    console.log(`Total de colecciones: ${totalCollections}`)
    console.log('='.repeat(80))
    
    // Tabla resumida
    console.log('\n📋 TABLA RESUMIDA POR MARCA:')
    console.log('-'.repeat(50))
    console.log('Marca'.padEnd(25) + 'Productos')
    console.log('-'.repeat(50))
    for (const brandData of sortedBrands) {
      console.log(brandData.name.padEnd(25) + brandData.count.toString())
    }
    console.log('-'.repeat(50))
    console.log('TOTAL'.padEnd(25) + grandTotal.toString())
    console.log('='.repeat(50))
    
  } catch (error: any) {
    console.error('✗ Error generando reporte:', error.message)
    process.exit(1)
  }
}

generateReport()

