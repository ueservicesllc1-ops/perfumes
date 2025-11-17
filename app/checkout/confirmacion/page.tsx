'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

function ConfirmacionContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (!orderId) {
      router.push('/')
      return
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [orderId, router])

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#182B21', color: '#F8F5EF' }}>
      <Header />
      
      <main className="max-w-sm mx-auto pt-16 px-4 pb-24">
        <div className="text-center py-12">
          {/* Icono de éxito */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{
            backgroundColor: 'rgba(212, 175, 55, 0.2)',
          }}>
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: '#D4AF37' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold mb-3" style={{ color: '#D4AF37' }}>
            ¡Orden Confirmada!
          </h1>
          
          <p className="text-sm mb-2" style={{ color: '#999' }}>
            Tu orden ha sido procesada exitosamente
          </p>
          
          {orderId && (
            <p className="text-xs mb-6" style={{ color: '#999' }}>
              Número de orden: <span className="font-mono font-semibold" style={{ color: '#D4AF37' }}>{orderId}</span>
            </p>
          )}

          <div className="p-4 rounded-lg mb-6" style={{
            backgroundColor: '#344A3D',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}>
            <p className="text-sm mb-2" style={{ color: '#F8F5EF' }}>
              Recibirás un email de confirmación con los detalles de tu orden.
            </p>
            <p className="text-xs" style={{ color: '#999' }}>
              Te contactaremos pronto para coordinar el envío.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/catalogo"
              className="px-6 py-3 rounded-lg font-semibold text-center transition-all active:scale-95"
              style={{
                backgroundColor: '#D4AF37',
                color: '#000000',
              }}
            >
              Seguir Comprando
            </Link>
            
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 rounded-lg font-semibold text-center transition-all active:scale-95 border"
              style={{
                backgroundColor: 'transparent',
                color: '#D4AF37',
                borderColor: '#D4AF37',
              }}
            >
              Volver al Inicio
            </button>
          </div>

          <p className="text-xs mt-6" style={{ color: '#999' }}>
            Redirigiendo en {countdown} segundos...
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function Confirmacion() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#182B21' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#D4AF37' }}></div>
          <p className="mt-4" style={{ color: '#D4AF37' }}>Cargando...</p>
        </div>
      </div>
    }>
      <ConfirmacionContent />
    </Suspense>
  )
}

