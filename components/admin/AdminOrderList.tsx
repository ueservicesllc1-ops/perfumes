'use client'

import { useState } from 'react'
import type { Order } from '@/lib/firebase/orders'
import { updateOrderStatus } from '@/lib/firebase/orders'
import PerfumeImage from '@/components/PerfumeImage'
import AdminOrderDetails from './AdminOrderDetails'

interface AdminOrderListProps {
  orders: Order[]
  onRefresh: () => void
}

const statusLabels: Record<Order['status'], string> = {
  pending: 'Pendiente',
  processing: 'En Proceso',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado'
}

const statusColors: Record<Order['status'], { bg: string; text: string }> = {
  pending: { bg: 'rgba(251, 191, 36, 0.2)', text: '#fbbf24' },
  processing: { bg: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6' },
  shipped: { bg: 'rgba(139, 92, 246, 0.2)', text: '#8b5cf6' },
  delivered: { bg: 'rgba(34, 197, 94, 0.2)', text: '#22c55e' },
  cancelled: { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' }
}

export default function AdminOrderList({ orders, onRefresh }: AdminOrderListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase()
    return (
      order.id?.toLowerCase().includes(searchLower) ||
      order.shippingInfo.fullName.toLowerCase().includes(searchLower) ||
      order.shippingInfo.phone.toLowerCase().includes(searchLower)
    )
  })

  async function handleStatusChange(orderId: string, newStatus: Order['status']) {
    if (!orderId) return
    
    setUpdatingStatus(orderId)
    try {
      await updateOrderStatus(orderId, newStatus)
      onRefresh()
    } catch (error) {
      console.error('Error actualizando estado:', error)
      alert('Error al actualizar el estado del pedido')
    } finally {
      setUpdatingStatus(null)
    }
  }

  function formatDate(date: Date | any) {
    if (!date) return 'N/A'
    const d = date instanceof Date ? date : date.toDate ? date.toDate() : new Date(date)
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d)
  }

  return (
    <div>
      {/* Stats - Mobile Optimized */}
      <div className="mb-4">
        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}>
          <p className="text-xs mb-1" style={{ color: '#999' }}>Total de Pedidos</p>
          <p className="text-lg font-bold" style={{ color: '#D4AF37' }}>{orders.length}</p>
        </div>
      </div>

      {/* Search - Mobile Optimized */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre o número de pedido..."
          className="w-full px-3 py-2 rounded-lg text-sm"
          style={{ backgroundColor: '#2a2a2a', color: '#FFFFFF', border: '1px solid #444' }}
        />
      </div>

      {/* Orders List - Mobile Optimized */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm" style={{ color: '#999' }}>No se encontraron pedidos</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusColor = statusColors[order.status]
            const isExpanded = expandedOrder === order.id
            
            return (
              <div
                key={order.id}
                className="rounded-lg"
                style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}
              >
                {/* Order Header */}
                <div
                  className="p-3 cursor-pointer"
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id || null)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono" style={{ color: '#999' }}>
                          #{order.id?.substring(0, 8)}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-medium"
                          style={{
                            backgroundColor: statusColor.bg,
                            color: statusColor.text
                          }}
                        >
                          {statusLabels[order.status]}
                        </span>
                      </div>
                      <p className="text-sm font-semibold mb-1" style={{ color: '#FFFFFF' }}>
                        {order.shippingInfo.fullName}
                      </p>
                      <p className="text-xs mb-1" style={{ color: '#999' }}>
                        {order.shippingInfo.email}
                      </p>
                      <p className="text-xs mb-1" style={{ color: '#999' }}>
                        {order.shippingInfo.phone}
                      </p>
                      <p className="text-xs font-bold" style={{ color: '#D4AF37' }}>
                        ${order.total.toFixed(2)}
                      </p>
                      <p className="text-xs mt-1" style={{ color: '#999' }}>
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <svg
                        className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        style={{ color: '#D4AF37' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-3 pb-3 border-t" style={{ borderColor: '#444' }}>
                    {/* Items */}
                    <div className="mt-3 mb-3">
                      <p className="text-xs font-semibold mb-2" style={{ color: '#D4AF37' }}>
                        Productos ({order.items.length})
                      </p>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex gap-2 p-2 rounded" style={{ backgroundColor: '#1a1a1a' }}>
                            {item.imageUrl && (
                              <div className="w-12 h-12 flex-shrink-0">
                                <PerfumeImage
                                  imageUrl={item.imageUrl}
                                  perfumeName={item.name}
                                  className="w-full h-full"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium" style={{ color: '#FFFFFF' }}>
                                {item.name}
                              </p>
                              <p className="text-xs" style={{ color: '#999' }}>
                                Cantidad: {item.quantity} × ${item.price.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-xs font-bold" style={{ color: '#D4AF37' }}>
                              ${(item.quantity * item.price).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="mb-3">
                      <p className="text-xs font-semibold mb-2" style={{ color: '#D4AF37' }}>
                        Dirección de Envío
                      </p>
                      <div className="text-xs space-y-1" style={{ color: '#999' }}>
                        <p>{order.shippingInfo.address}</p>
                        <p>
                          {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}
                        </p>
                        <p>{order.shippingInfo.country}</p>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="mb-3">
                      <p className="text-xs font-semibold mb-1" style={{ color: '#D4AF37' }}>
                        Método de Pago
                      </p>
                      <p className="text-xs" style={{ color: '#999' }}>
                        {order.paymentMethod}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-3 space-y-2">
                      <button
                        onClick={() => setEditingOrder(order)}
                        className="w-full px-3 py-2 rounded-lg text-xs font-medium transition-all active:scale-95"
                        style={{ backgroundColor: '#D4AF37', color: '#000000' }}
                      >
                        Ver Detalles / Editar Precios
                      </button>
                      
                      <div>
                        <p className="text-xs font-semibold mb-2" style={{ color: '#D4AF37' }}>
                          Cambiar Estado
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as Order['status'][]).map((status) => (
                            <button
                              key={status}
                              onClick={() => order.id && handleStatusChange(order.id, status)}
                              disabled={updatingStatus === order.id || order.status === status}
                              className="px-2 py-1 rounded text-[10px] font-medium transition-all active:scale-95"
                              style={{
                                backgroundColor: order.status === status ? statusColors[status].bg : '#1a1a1a',
                                color: order.status === status ? statusColors[status].text : '#999',
                                border: `1px solid ${order.status === status ? statusColors[status].text : '#444'}`,
                                opacity: updatingStatus === order.id ? 0.6 : 1
                              }}
                            >
                              {statusLabels[status]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Order Details Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg p-4" style={{ backgroundColor: '#172621' }}>
            <AdminOrderDetails
              order={editingOrder}
              onClose={() => setEditingOrder(null)}
              onSuccess={() => {
                setEditingOrder(null)
                onRefresh()
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

