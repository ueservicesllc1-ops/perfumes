'use client'

import { useState, useEffect } from 'react'
import type { Order, OrderItem } from '@/lib/firebase/orders'
import { updateOrder } from '@/lib/firebase/orders'
import { createWhatsAppMessage, openWhatsApp } from '@/lib/utils/pdfGenerator'
import PerfumeImage from '@/components/PerfumeImage'

interface AdminOrderDetailsProps {
  order: Order
  onClose: () => void
  onSuccess: () => void
}

export default function AdminOrderDetails({ order, onClose, onSuccess }: AdminOrderDetailsProps) {
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<OrderItem[]>(order.items)
  const [total, setTotal] = useState(order.total)

  useEffect(() => {
    // Recalcular total cuando cambien los items
    const newTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    setTotal(newTotal)
  }, [items])

  function handlePriceChange(index: number, newPrice: string) {
    const price = parseFloat(newPrice)
    if (isNaN(price) || price < 0) return

    const updatedItems = [...items]
    updatedItems[index] = {
      ...updatedItems[index],
      price
    }
    setItems(updatedItems)
  }

  function handleQuantityChange(index: number, newQuantity: string) {
    const quantity = parseInt(newQuantity)
    if (isNaN(quantity) || quantity < 1) return

    const updatedItems = [...items]
    updatedItems[index] = {
      ...updatedItems[index],
      quantity
    }
    setItems(updatedItems)
  }

  async function handleSave() {
    if (!order.id) return

    setLoading(true)
    try {
      // Actualizar el pedido en Firestore
      await updateOrder(order.id, {
        items,
        total
      })

      // Crear mensaje de WhatsApp con los datos actualizados
      const cartItems = items.map(item => ({
        id: item.perfumeId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.imageUrl,
        // Campos requeridos de CartItem que no están en OrderItem
        category: 'For Both' as const,
        inStock: true,
        originalPrice: undefined,
        brand: undefined,
        size: undefined,
        description: undefined,
        createdAt: undefined,
        updatedAt: undefined
      }))

      // Crear mensaje de WhatsApp con los datos actualizados
      const whatsappMessage = createWhatsAppMessage({
        orderId: order.id || '',
        items: cartItems,
        total,
        shippingInfo: order.shippingInfo,
        pdfUrl: null // No generamos PDF nuevo, solo el mensaje
      })

      // Abrir WhatsApp con el mensaje actualizado
      // createWhatsAppMessage devuelve el mensaje codificado, pero openWhatsApp lo codifica de nuevo
      // Necesitamos decodificarlo primero para que openWhatsApp lo codifique correctamente
      const phoneNumber = order.shippingInfo.phone.replace(/\D/g, '') // Solo números
      const decodedMessage = decodeURIComponent(whatsappMessage)
      openWhatsApp(phoneNumber, decodedMessage)

      alert('Pedido actualizado y mensaje de WhatsApp enviado')
      onSuccess()
    } catch (error) {
      console.error('Error actualizando pedido:', error)
      alert('Error al actualizar el pedido: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-1" style={{ color: '#D4AF37' }}>
          Editar Pedido #{order.id?.substring(0, 8)}
        </h2>
        <p className="text-xs" style={{ color: '#999' }}>
          Cliente: {order.shippingInfo.fullName}
        </p>
      </div>

      {/* Order Items */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#D4AF37' }}>
          Productos
        </h3>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="p-3 rounded-lg"
              style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}
            >
              <div className="flex gap-3">
                {item.imageUrl && (
                  <div className="w-16 h-16 flex-shrink-0">
                    <PerfumeImage
                      imageUrl={item.imageUrl}
                      perfumeName={item.name}
                      className="w-full h-full"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold mb-2" style={{ color: '#FFFFFF' }}>
                    {item.name}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: '#999' }}>
                        Cantidad
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        className="w-full px-2 py-1.5 rounded text-sm"
                        style={{ backgroundColor: '#1a1a1a', color: '#FFFFFF', border: '1px solid #444' }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: '#999' }}>
                        Precio Unitario
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => handlePriceChange(index, e.target.value)}
                        className="w-full px-2 py-1.5 rounded text-sm"
                        style={{ backgroundColor: '#1a1a1a', color: '#FFFFFF', border: '1px solid #444' }}
                      />
                    </div>
                  </div>
                  <div className="mt-2 text-xs font-bold" style={{ color: '#D4AF37' }}>
                    Subtotal: ${(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold" style={{ color: '#D4AF37' }}>
            Total:
          </span>
          <span className="text-lg font-bold" style={{ color: '#D4AF37' }}>
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95"
          style={{ backgroundColor: '#2a2a2a', color: '#D4AF37', border: '1px solid #444' }}
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95"
          style={{
            backgroundColor: '#D4AF37',
            color: '#000000',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Guardando...' : 'Guardar y Enviar WhatsApp'}
        </button>
      </div>
    </div>
  )
}

