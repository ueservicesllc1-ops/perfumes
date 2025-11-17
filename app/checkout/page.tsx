'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCart } from '@/contexts/CartContext'
import { createOrder } from '@/lib/firebase/orders'
import PerfumeImage from '@/components/PerfumeImage'
import { generateOrderPDF, createWhatsAppMessage, openWhatsApp } from '@/lib/utils/pdfGenerator'
import { whatsappConfig } from '@/lib/config/whatsapp'

export default function Checkout() {
  const router = useRouter()
  const { items, totalPrice, clearCart, minimumOrderAmount, meetsMinimumOrder } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Estados Unidos',
  })


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setShippingInfo(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = (): boolean => {
    if (!shippingInfo.fullName.trim()) {
      setError('El nombre completo es requerido')
      return false
    }
    if (!shippingInfo.email.trim() || !shippingInfo.email.includes('@')) {
      setError('Un email válido es requerido')
      return false
    }
    if (!shippingInfo.phone.trim()) {
      setError('El teléfono es requerido')
      return false
    }
    if (!shippingInfo.address.trim()) {
      setError('La dirección es requerida')
      return false
    }
    if (!shippingInfo.city.trim()) {
      setError('La ciudad es requerida')
      return false
    }
    if (!shippingInfo.state.trim()) {
      setError('El estado es requerido')
      return false
    }
    if (!shippingInfo.zipCode.trim()) {
      setError('El código postal es requerido')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    if (items.length === 0) {
      setError('El carrito está vacío')
      return
    }

    if (!meetsMinimumOrder) {
      const remaining = minimumOrderAmount - totalPrice
      setError(`El pedido mínimo es de $${minimumOrderAmount.toFixed(2)}. Te faltan $${remaining.toFixed(2)} para completar tu pedido.`)
      return
    }

    setIsProcessing(true)

    try {
      // Preparar items de la orden
      const orderItems = items.map(item => ({
        perfumeId: item.id || '',
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.imageUrl,
      }))

      // Crear la orden
      const orderId = await createOrder({
        userId: 'guest', // En producción, usar el ID del usuario autenticado
        items: orderItems,
        total: totalPrice,
        status: 'pending',
        shippingInfo,
        paymentMethod: 'pending', // Método de pago pendiente
      })

      // Generar PDF y subirlo a B2
      let pdfUrl: string | null = null
      try {
        const pdfBlob = await generateOrderPDF({
          orderId,
          items,
          total: totalPrice,
          shippingInfo,
        })

        // Convertir Blob a File para subirlo a B2
        const pdfFile = new File([pdfBlob], `orden-${orderId}.pdf`, { type: 'application/pdf' })
        
        // Subir PDF a B2
        const { uploadPDF } = await import('@/lib/b2/storage')
        // uploadPDF ya retorna la URL pública real de B2
        const fullPdfUrl = await uploadPDF(pdfFile, orderId)
        
        // Crear mensaje de WhatsApp con el link del PDF
        const whatsappMessage = createWhatsAppMessage({
          orderId,
          items,
          total: totalPrice,
          shippingInfo,
          pdfUrl: fullPdfUrl,
        })

        // Abrir WhatsApp con el mensaje que incluye el link del PDF
        setTimeout(() => {
          openWhatsApp(whatsappConfig.phoneNumber, whatsappMessage)
        }, 500)
      } catch (pdfError) {
        console.error('Error generating/uploading PDF:', pdfError)
        // Continuar aunque falle el PDF, pero sin el link
        const whatsappMessage = createWhatsAppMessage({
          orderId,
          items,
          total: totalPrice,
          shippingInfo,
          pdfUrl: null,
        })
        setTimeout(() => {
          openWhatsApp(whatsappConfig.phoneNumber, whatsappMessage)
        }, 500)
      }

      // Limpiar el carrito
      clearCart()

      // Redirigir a página de confirmación
      router.push(`/checkout/confirmacion?orderId=${orderId}`)
    } catch (err) {
      console.error('Error processing order:', err)
      setError('Error al procesar la orden. Por favor, intenta de nuevo.')
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#172621', color: '#FFFFFF' }}>
        <Header />
        <main className="max-w-sm mx-auto pt-16 px-4 pb-24">
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: '#999' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#FFFFFF' }}>
              Carrito Vacío
            </h2>
            <p className="text-sm mb-6" style={{ color: '#999' }}>
              No hay productos en tu carrito
            </p>
            <button
              onClick={() => router.push('/catalogo')}
              className="px-6 py-3 rounded-lg font-semibold transition-all active:scale-95"
              style={{
                backgroundColor: '#D4AF37',
                color: '#000000',
              }}
            >
              Ir al Catálogo
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#172621', color: '#FFFFFF' }}>
      <Header />
      
      <main className="max-w-sm mx-auto pt-16 px-4 pb-24">
        {/* Header */}
        <section className="mb-6">
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#D4AF37' }}>
            Finalizar Compra
          </h1>
          <p className="text-sm" style={{ color: '#999' }}>
            Completa tu información para procesar la orden
          </p>
        </section>

        {/* Resumen de la Orden */}
        <section className="mb-6 p-4 rounded-lg" style={{
          backgroundColor: '#2a2a2a',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: '#D4AF37' }}>
            Resumen de la Orden
          </h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
                  <PerfumeImage
                    imageUrl={item.imageUrl}
                    perfumeName={item.name}
                    className="h-16"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-1" style={{ color: '#FFFFFF' }}>
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: '#999' }}>
                      Cantidad: {item.quantity}
                    </span>
                    <span className="text-sm font-bold" style={{ color: '#D4AF37' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t" style={{ borderColor: '#D4AF37' }}>
            {/* Mensaje de mínimo de compra */}
            {!meetsMinimumOrder && (
              <div className="mb-3 p-3 rounded-lg border" style={{
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                borderColor: 'rgba(212, 175, 55, 0.3)',
              }}>
                <p className="text-sm text-center" style={{ color: '#D4AF37' }}>
                  Pedido mínimo: ${minimumOrderAmount.toFixed(2)}
                </p>
                <p className="text-xs text-center mt-1" style={{ color: '#D4AF37', opacity: 0.8 }}>
                  Te faltan ${(minimumOrderAmount - totalPrice).toFixed(2)} para completar tu pedido
                </p>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold" style={{ color: '#FFFFFF' }}>
                Total:
              </span>
              <span className="text-2xl font-bold" style={{ color: '#D4AF37' }}>
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </section>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6 mb-6">
          {/* Información de Envío */}
          <section>
            <h2 className="text-lg font-bold mb-4" style={{ color: '#D4AF37' }}>
              Información de Envío
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#D4AF37' }}>
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border transition-all"
                  style={{
                    backgroundColor: '#2a2a2a',
                    borderColor: '#D4AF37',
                    color: '#FFFFFF',
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#D4AF37' }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={shippingInfo.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border transition-all"
                  style={{
                    backgroundColor: '#2a2a2a',
                    borderColor: '#D4AF37',
                    color: '#FFFFFF',
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#D4AF37' }}>
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border transition-all"
                  style={{
                    backgroundColor: '#2a2a2a',
                    borderColor: '#D4AF37',
                    color: '#FFFFFF',
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#D4AF37' }}>
                  Dirección *
                </label>
                <input
                  type="text"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border transition-all"
                  style={{
                    backgroundColor: '#2a2a2a',
                    borderColor: '#D4AF37',
                    color: '#FFFFFF',
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#D4AF37' }}>
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border transition-all"
                    style={{
                      backgroundColor: '#2a2a2a',
                      borderColor: '#D4AF37',
                      color: '#FFFFFF',
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#D4AF37' }}>
                    Estado *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border transition-all"
                    style={{
                      backgroundColor: '#2a2a2a',
                      borderColor: '#D4AF37',
                      color: '#FFFFFF',
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#D4AF37' }}>
                    Código Postal *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border transition-all"
                    style={{
                      backgroundColor: '#2a2a2a',
                      borderColor: '#D4AF37',
                      color: '#FFFFFF',
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#D4AF37' }}>
                    País *
                  </label>
                  <select
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border transition-all"
                    style={{
                      backgroundColor: '#2a2a2a',
                      borderColor: '#D4AF37',
                      color: '#FFFFFF',
                    }}
                  >
                    <option value="Estados Unidos">Estados Unidos</option>
                    <option value="México">México</option>
                    <option value="España">España</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Chile">Chile</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Error */}
          {error && (
            <div className="p-4 rounded-lg border" style={{
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              borderColor: 'rgba(220, 38, 38, 0.3)',
              color: '#dc2626',
            }}>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Botón de Envío */}
          <button
            type="submit"
            disabled={isProcessing || !meetsMinimumOrder}
            className="w-full py-4 rounded-lg font-semibold text-center transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: (isProcessing || !meetsMinimumOrder) ? '#666' : '#D4AF37',
              color: (isProcessing || !meetsMinimumOrder) ? '#FFFFFF' : '#000000',
            }}
          >
            {isProcessing ? 'Procesando...' : `Confirmar Orden - $${totalPrice.toFixed(2)}`}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  )
}

