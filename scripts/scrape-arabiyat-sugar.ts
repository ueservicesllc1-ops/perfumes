// Script para hacer scraping de productos Arabiyat Sugar y agregarlos a Firestore
// Ejecutar con: npx tsx scripts/scrape-arabiyat-sugar.ts

import { addPerfume } from '../lib/firebase/perfumes'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { b2Config } from '../lib/b2/config'
import puppeteer from 'puppeteer'
import fetch from 'node-fetch'

// Productos de Arabiyat Sugar basados en la página
const arabiyatSugarProducts = [
  { name: 'Arabiyat Sugar Berries Cream Macaron Eau De Parfum 3.4FL.OZ', price: 42.99 },
  { name: 'Arabiyat Sugar Toffee Ganache Eau De Parfum 100ML', price: 42.99 },
  { name: 'Arabiyat Sugar Chocolate Ganache Eau De Parfum 3.4FL.OZ', price: 42.99 },
  { name: 'Arabiyat Sugar Dulce De Leche Eau De Parfum 3.4FL.OZ', price: 39.99 },
  { name: 'Arabiyat Sugar Mango Affogato Eau De Parfum 3.4FL.OZ', price: 39.99 },
  { name: 'Arabiyat Sugar Matcha Latte Eau De Parfum 3.4FL.OZ', price: 39.99 },
  { name: 'Arabiyat Sugar French Vanilla Latte Eau De Parfum 3.4FL.OZ', price: 39.99 },
  { name: 'Arabiyat Sugar Cotton Blush Eau De Parfum 3.4FL.OZ', price: 39.99 },
  { name: 'Arabiyat Sugar Caramel Chocolate Macaron Eau De Parfum 3.4FL.OZ', price: 39.99 },
  { name: 'Arabiyat Sugar Lemon Sorbet Eau De Parfum 3.4FL.OZ', price: 39.99 },
  { name: 'Arabiyat Sugar Cookie Dough Eau De Parfum 3.4FL.OZ', price: 39.99 },
  { name: 'Arabiyat Sugar Pecan Butter Cookie Eau De Parfum 3.4FL.OZ', price: 39.99 },
  { name: 'Arabiyat Sugar Coconut Chiffon Eau De Parfum 3.4FL.OZ', price: 39.99 },
  { name: 'Arabiyat Sugar Strawberry Tres Leches Eau De Parfum 3.4 FL.OZ', price: 39.99 },
  { name: 'Arabiyat Sugar Vanilla Cream Macaron Eau De Parfum 3.4FL.OZ', price: 42.99 },
]

// Configurar cliente S3 para B2
const s3Client = new S3Client({
  endpoint: b2Config.endpoint,
  region: b2Config.region,
  credentials: {
    accessKeyId: b2Config.keyId,
    secretAccessKey: b2Config.applicationKey,
  },
  forcePathStyle: true,
})

async function scrapeImages() {
  console.log('Iniciando scraping de imágenes...')
  
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  
  try {
    await page.goto('https://fragrancewholesalerusa.com/collections/bestselling?filter.p.tag=Arabiyat+Sugar', {
      waitUntil: 'networkidle2',
      timeout: 30000
    })
    
    // Esperar a que carguen los productos
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    // Extraer URLs de imágenes
    const imageMap = await page.evaluate(() => {
      const map: Record<string, string> = {}
      
      // Buscar todos los enlaces de productos
      const productLinks = document.querySelectorAll('a[href*="arabiyat-sugar"], a[href*="arabiyat_sugar"]')
      
      productLinks.forEach((link) => {
        // Buscar el contenedor del producto
        const productCard = link.closest('[class*="product"], [class*="card"], .product-item, .grid-item, li, div')
        
        if (productCard) {
          const nameEl = productCard.querySelector('h2, h3, h4, [class*="title"], [class*="name"], a') || link
          const imgEl = productCard.querySelector('img') || link.querySelector('img')
          
          if (nameEl && imgEl) {
            const name = nameEl.textContent?.trim() || ''
            let imgUrl = imgEl.getAttribute('src') || 
                        imgEl.getAttribute('data-src') || 
                        imgEl.getAttribute('data-lazy-src') ||
                        imgEl.getAttribute('data-original') ||
                        ''
            
            // Convertir URL relativa a absoluta
            if (imgUrl.startsWith('//')) {
              imgUrl = 'https:' + imgUrl
            } else if (imgUrl.startsWith('/')) {
              imgUrl = 'https://fragrancewholesalerusa.com' + imgUrl
            }
            
            // Limpiar parámetros de tamaño de imagen (para obtener la imagen completa)
            imgUrl = imgUrl.replace(/_[0-9]+x[0-9]+\./g, '.')
            imgUrl = imgUrl.replace(/width=\d+/g, '')
            imgUrl = imgUrl.replace(/height=\d+/g, '')
            imgUrl = imgUrl.split('?')[0] // Remover query params
            
            if (name.toLowerCase().includes('arabiyat sugar') && imgUrl && !imgUrl.includes('placeholder') && !imgUrl.includes('logo')) {
              // Normalizar nombre para matching
              const normalizedName = name.toLowerCase()
                .replace(/arabiyat sugar/gi, '')
                .replace(/eau de parfum/gi, '')
                .replace(/3\.4fl\.oz/gi, '')
                .replace(/100ml/gi, '')
                .replace(/3\.4 fl\.oz/gi, '')
                .replace(/\s+/g, ' ')
                .trim()
              
              if (normalizedName && imgUrl.startsWith('http')) {
                map[normalizedName] = imgUrl
              }
            }
          }
        }
      })
      
      // También buscar directamente imágenes con nombres de productos
      const allImages = document.querySelectorAll('img[src*="arabiyat"], img[src*="sugar"]')
      allImages.forEach((img) => {
        let imgUrl = img.getAttribute('src') || 
                    img.getAttribute('data-src') || 
                    img.getAttribute('data-lazy-src') ||
                    ''
        
        if (imgUrl.startsWith('//')) {
          imgUrl = 'https:' + imgUrl
        } else if (imgUrl.startsWith('/')) {
          imgUrl = 'https://fragrancewholesalerusa.com' + imgUrl
        }
        
        imgUrl = imgUrl.replace(/_[0-9]+x[0-9]+\./g, '.')
        imgUrl = imgUrl.split('?')[0]
        
        if (imgUrl && imgUrl.startsWith('http') && !imgUrl.includes('placeholder') && !imgUrl.includes('logo')) {
          // Intentar encontrar el nombre del producto cercano
          const parent = img.closest('[class*="product"], [class*="card"], li, div')
          if (parent) {
            const nameEl = parent.querySelector('h2, h3, h4, [class*="title"], [class*="name"], a')
            if (nameEl) {
              const name = nameEl.textContent?.trim() || ''
              if (name.toLowerCase().includes('arabiyat sugar')) {
                const normalizedName = name.toLowerCase()
                  .replace(/arabiyat sugar/gi, '')
                  .replace(/eau de parfum/gi, '')
                  .replace(/3\.4fl\.oz/gi, '')
                  .replace(/100ml/gi, '')
                  .replace(/3\.4 fl\.oz/gi, '')
                  .replace(/\s+/g, ' ')
                  .trim()
                
                if (normalizedName) {
                  map[normalizedName] = imgUrl
                }
              }
            }
          }
        }
      })
      
      return map
    })
    
    await browser.close()
    console.log(`Encontradas ${Object.keys(imageMap).length} imágenes\n`)
    return imageMap
  } catch (error) {
    console.error('Error en scraping:', error)
    await browser.close()
    return {}
  }
}

async function downloadAndUploadImage(imageUrl: string, productName: string): Promise<string> {
  try {
    if (!imageUrl || imageUrl.startsWith('data:')) {
      console.warn(`  ⚠ URL de imagen inválida: ${imageUrl}`)
      return ''
    }
    
    console.log(`  📥 Descargando imagen: ${imageUrl}`)
    const response = await fetch(imageUrl)
    
    if (!response.ok) {
      console.warn(`  ⚠ No se pudo descargar imagen (${response.status}): ${imageUrl}`)
      return ''
    }
    
    const buffer = Buffer.from(await response.arrayBuffer())
    
    // Generar nombre único para el archivo
    const sanitizedName = productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50)
    
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(7)
    const fileName = `${sanitizedName}-${timestamp}-${randomId}.jpg`
    const b2Path = `perfumes/arabiyat-sugar/${fileName}`
    
    // Subir a B2
    console.log(`  📤 Subiendo a B2: ${b2Path}`)
    const command = new PutObjectCommand({
      Bucket: b2Config.bucketName,
      Key: b2Path,
      Body: buffer,
      ContentType: 'image/jpeg',
    })
    
    await s3Client.send(command)
    
    // Retornar URL del proxy (como lo hace la API route)
    const imageUrl_proxy = `/api/b2/image?path=${encodeURIComponent(b2Path)}`
    console.log(`  ✓ Imagen subida: ${imageUrl_proxy}`)
    return imageUrl_proxy
  } catch (error: any) {
    console.warn(`  ✗ Error descargando/subiendo imagen: ${error.message}`)
    return ''
  }
}

function findMatchingImage(productName: string, imageMap: Record<string, string>): string {
  // Normalizar nombre del producto para matching
  const normalized = productName
    .toLowerCase()
    .replace(/arabiyat sugar/gi, '')
    .replace(/eau de parfum/gi, '')
    .replace(/3\.4fl\.oz/gi, '')
    .replace(/100ml/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
  
  // Buscar coincidencia exacta
  if (imageMap[normalized]) {
    return imageMap[normalized]
  }
  
  // Buscar coincidencia parcial
  const productWords = normalized.split(' ').filter(w => w.length > 2)
  
  for (const [key, url] of Object.entries(imageMap)) {
    const keyWords = key.split(' ').filter(w => w.length > 2)
    const matchCount = productWords.filter(w => keyWords.some(k => k.includes(w) || w.includes(k))).length
    
    if (matchCount >= 2) {
      return url
    }
  }
  
  // Si no hay coincidencia, usar la primera imagen disponible
  const firstImage = Object.values(imageMap)[0]
  return firstImage || ''
}

async function addProducts() {
  console.log('🚀 Iniciando scraping y agregado de productos Arabiyat Sugar...')
  console.log(`📦 Total de productos: ${arabiyatSugarProducts.length}\n`)
  
  // Scrapear imágenes primero
  console.log('🔍 Scrapeando imágenes de la página...')
  const imageMap = await scrapeImages()
  
  if (Object.keys(imageMap).length === 0) {
    console.warn('⚠ No se encontraron imágenes. Continuando sin imágenes...\n')
  }
  
  let successCount = 0
  let errorCount = 0
  let imageCount = 0
  
  for (const product of arabiyatSugarProducts) {
    try {
      console.log(`\n📝 Procesando: ${product.name}`)
      
      // Buscar imagen correspondiente
      let imageUrl = ''
      if (Object.keys(imageMap).length > 0) {
        const matchingImageUrl = findMatchingImage(product.name, imageMap)
        if (matchingImageUrl) {
          imageUrl = await downloadAndUploadImage(matchingImageUrl, product.name)
          if (imageUrl) {
            imageCount++
          }
        }
      }
      
      const perfumeData: any = {
        name: product.name,
        price: product.price,
        category: 'For Her' as const,
        brand: 'Arabiyat Sugar',
        size: '3.4FL.OZ',
        inStock: true,
        description: `Eau De Parfum 3.4FL.OZ - ${product.name}`,
      }
      
      if (imageUrl) {
        perfumeData.imageUrl = imageUrl
      }
      
      const id = await addPerfume(perfumeData)
      console.log(`  ✓ Agregado a Firestore (ID: ${id})`)
      successCount++
      
      // Delay para no sobrecargar
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error: any) {
      console.error(`  ✗ Error: ${error.message}`)
      errorCount++
    }
  }
  
  console.log('\n' + '='.repeat(50))
  console.log('📊 RESUMEN')
  console.log('='.repeat(50))
  console.log(`✓ Productos agregados: ${successCount}`)
  console.log(`📷 Imágenes subidas: ${imageCount}`)
  console.log(`✗ Errores: ${errorCount}`)
  console.log(`📦 Total procesado: ${arabiyatSugarProducts.length}`)
  console.log('='.repeat(50))
}

// Ejecutar
addProducts().catch((error) => {
  console.error('Error fatal:', error)
  process.exit(1)
})

