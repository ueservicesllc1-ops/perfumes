// Script para actualizar las imágenes de productos Arabiyat Sugar existentes
// Ejecutar con: npx tsx scripts/update-arabiyat-sugar-images.ts

import { getAllPerfumes, updatePerfume } from '../lib/firebase/perfumes'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { b2Config } from '../lib/b2/config'
import puppeteer from 'puppeteer'
import fetch from 'node-fetch'

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
  console.log('🔍 Scrapeando imágenes de la página...')
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()
  page.setDefaultTimeout(120000) // 2 minutos
  
  try {
    // Configurar user agent para evitar bloqueos
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    
    await page.goto('https://fragrancewholesalerusa.com/collections/bestselling?filter.p.tag=Arabiyat+Sugar', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    })
    
    // Esperar a que carguen los productos y hacer scroll
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Hacer scroll para cargar contenido lazy
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    await page.evaluate(() => {
      window.scrollTo(0, 0)
    })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Extraer URLs de imágenes (versión simplificada)
    const imageMap = await page.evaluate(() => {
      const map: Record<string, string> = {}
      
      // Buscar todas las imágenes y sus textos cercanos
      const allImages = Array.from(document.querySelectorAll('img'))
      
      // Buscar imágenes cerca de texto que contenga nombres de productos
      allImages.forEach((img) => {
        let imgUrl = img.getAttribute('src') || 
                    img.getAttribute('data-src') || 
                    img.getAttribute('data-lazy-src') ||
                    img.getAttribute('data-original') ||
                    ''
        
        if (!imgUrl) return
        
        if (imgUrl.startsWith('//')) {
          imgUrl = 'https:' + imgUrl
        } else if (imgUrl.startsWith('/')) {
          imgUrl = 'https://fragrancewholesalerusa.com' + imgUrl
        }
        
        imgUrl = imgUrl.replace(/_[0-9]+x[0-9]+\./g, '.')
        imgUrl = imgUrl.split('?')[0]
        
        // Buscar en un radio más amplio alrededor de la imagen
        let parent = img.closest('[class*="product"], [class*="card"], li, div, article, section')
        if (!parent) {
          // Buscar en elementos hermanos
          let sibling = img.previousElementSibling || img.nextElementSibling
          while (sibling && !parent) {
            if (sibling.textContent && sibling.textContent.toLowerCase().includes('arabiyat')) {
              parent = sibling
            }
            sibling = sibling.previousElementSibling || sibling.nextElementSibling
          }
        }
        
        if (imgUrl && imgUrl.startsWith('http') && !imgUrl.includes('placeholder') && !imgUrl.includes('logo') && !imgUrl.includes('icon')) {
          if (parent) {
            const nameEl = parent.querySelector('h2, h3, h4, [class*="title"], [class*="name"], a, span')
            if (nameEl) {
              const name = nameEl.textContent?.trim() || ''
              if (name.toLowerCase().includes('arabiyat sugar') || name.toLowerCase().includes('berries') || name.toLowerCase().includes('toffee') || name.toLowerCase().includes('chocolate') || name.toLowerCase().includes('dulce') || name.toLowerCase().includes('mango') || name.toLowerCase().includes('matcha') || name.toLowerCase().includes('vanilla') || name.toLowerCase().includes('cotton') || name.toLowerCase().includes('caramel') || name.toLowerCase().includes('lemon') || name.toLowerCase().includes('cookie') || name.toLowerCase().includes('pecan') || name.toLowerCase().includes('coconut') || name.toLowerCase().includes('strawberry')) {
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
    console.log(`✓ Encontradas ${Object.keys(imageMap).length} imágenes\n`)
    return imageMap
  } catch (error) {
    console.error('✗ Error en scraping:', error)
    await browser.close()
    return {}
  }
}

async function downloadAndUploadImage(imageUrl: string, productName: string): Promise<string> {
  try {
    if (!imageUrl || imageUrl.startsWith('data:')) {
      return ''
    }
    
    console.log(`  📥 Descargando: ${imageUrl.substring(0, 60)}...`)
    const response = await fetch(imageUrl)
    
    if (!response.ok) {
      console.warn(`  ⚠ No se pudo descargar (${response.status})`)
      return ''
    }
    
    const buffer = Buffer.from(await response.arrayBuffer())
    
    const sanitizedName = productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50)
    
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(7)
    const fileName = `${sanitizedName}-${timestamp}-${randomId}.jpg`
    const b2Path = `perfumes/arabiyat-sugar/${fileName}`
    
    console.log(`  📤 Subiendo a B2...`)
    const command = new PutObjectCommand({
      Bucket: b2Config.bucketName,
      Key: b2Path,
      Body: buffer,
      ContentType: 'image/jpeg',
    })
    
    await s3Client.send(command)
    
    const imageUrl_proxy = `/api/b2/image?path=${encodeURIComponent(b2Path)}`
    console.log(`  ✓ Imagen subida`)
    return imageUrl_proxy
  } catch (error: any) {
    console.warn(`  ✗ Error: ${error.message}`)
    return ''
  }
}

function findMatchingImage(productName: string, imageMap: Record<string, string>): string {
  const normalized = productName
    .toLowerCase()
    .replace(/arabiyat sugar/gi, '')
    .replace(/eau de parfum/gi, '')
    .replace(/3\.4fl\.oz/gi, '')
    .replace(/100ml/gi, '')
    .replace(/3\.4 fl\.oz/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
  
  if (imageMap[normalized]) {
    return imageMap[normalized]
  }
  
  const productWords = normalized.split(' ').filter(w => w.length > 2)
  
  for (const [key, url] of Object.entries(imageMap)) {
    const keyWords = key.split(' ').filter(w => w.length > 2)
    const matchCount = productWords.filter(w => keyWords.some(k => k.includes(w) || w.includes(k))).length
    
    if (matchCount >= 2) {
      return url
    }
  }
  
  return Object.values(imageMap)[0] || ''
}

async function updateImages() {
  console.log('🚀 Iniciando actualización de imágenes para productos Arabiyat Sugar...\n')
  
  // Obtener productos existentes
  const perfumes = await getAllPerfumes()
  const arabiyatSugarPerfumes = perfumes.filter(p => 
    p.name.toLowerCase().includes('arabiyat sugar') && 
    p.brand === 'Arabiyat Sugar'
  )
  
  console.log(`📦 Encontrados ${arabiyatSugarPerfumes.length} productos Arabiyat Sugar\n`)
  
  if (arabiyatSugarPerfumes.length === 0) {
    console.log('⚠ No se encontraron productos para actualizar')
    return
  }
  
  // Scrapear imágenes
  const imageMap = await scrapeImages()
  
  if (Object.keys(imageMap).length === 0) {
    console.warn('⚠ No se encontraron imágenes. Abortando...\n')
    return
  }
  
  let updatedCount = 0
  let skippedCount = 0
  let errorCount = 0
  
  for (const perfume of arabiyatSugarPerfumes) {
    try {
      if (!perfume.id) {
        console.log(`⚠ Saltando producto sin ID: ${perfume.name}`)
        skippedCount++
        continue
      }
      
      // Si ya tiene imagen, preguntar si actualizar
      if (perfume.imageUrl && !perfume.imageUrl.includes('...')) {
        console.log(`⏭ Ya tiene imagen: ${perfume.name}`)
        skippedCount++
        continue
      }
      
      console.log(`\n📝 Procesando: ${perfume.name}`)
      
      // Buscar imagen correspondiente
      const matchingImageUrl = findMatchingImage(perfume.name, imageMap)
      if (!matchingImageUrl) {
        console.log(`  ⚠ No se encontró imagen correspondiente`)
        skippedCount++
        continue
      }
      
      const imageUrl = await downloadAndUploadImage(matchingImageUrl, perfume.name)
      if (!imageUrl) {
        console.log(`  ⚠ No se pudo subir la imagen`)
        skippedCount++
        continue
      }
      
      // Actualizar producto
      await updatePerfume(perfume.id, { imageUrl })
      console.log(`  ✓ Actualizado en Firestore`)
      updatedCount++
      
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error: any) {
      console.error(`  ✗ Error: ${error.message}`)
      errorCount++
    }
  }
  
  console.log('\n' + '='.repeat(50))
  console.log('📊 RESUMEN')
  console.log('='.repeat(50))
  console.log(`✓ Actualizados: ${updatedCount}`)
  console.log(`⏭ Saltados: ${skippedCount}`)
  console.log(`✗ Errores: ${errorCount}`)
  console.log(`📦 Total procesado: ${arabiyatSugarPerfumes.length}`)
  console.log('='.repeat(50))
}

updateImages().catch((error) => {
  console.error('Error fatal:', error)
  process.exit(1)
})

