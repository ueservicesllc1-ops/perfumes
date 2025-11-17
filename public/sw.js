// Service Worker para PWA
const CACHE_NAME = 'arabiyat-v1'
const urlsToCache = [
  '/',
  '/explorar',
  '/favoritos',
  '/perfil',
  '/manifest.json',
]

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    })
  )
})

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Estrategia: Network First, luego Cache
self.addEventListener('fetch', (event) => {
  // Ignorar requests que no sean HTTP/HTTPS (como chrome-extension, etc.)
  const url = new URL(event.request.url)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return
  }

  // Solo procesar requests GET para cache
  if (event.request.method !== 'GET') {
    // Para requests POST, PUT, DELETE, etc., solo hacer fetch sin cachear
    return fetch(event.request)
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Solo cachear respuestas válidas y clonables
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache).catch(() => {
              // Ignorar errores de cache
            })
          })
        }
        return response
      })
      .catch(() => {
        return caches.match(event.request)
      })
  )
})

