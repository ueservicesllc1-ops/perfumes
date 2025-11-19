'use client'

import { useState, useEffect } from 'react'
import { getAllOrders } from '@/lib/firebase/orders'
import { getAllPerfumes } from '@/lib/firebase/perfumes'
import type { Order } from '@/lib/firebase/orders'
import type { Perfume } from '@/lib/firebase/perfumes'
import PerfumeImage from '@/components/PerfumeImage'

interface ProductSales {
  perfumeId: string
  name: string
  imageUrl?: string
  totalQuantity: number
  totalRevenue: number
  orderCount: number
}

interface ProductMargin {
  perfumeId: string
  name: string
  imageUrl?: string
  costPrice: number
  salePrice: number
  marginAmount: number
  marginPercentage: number
}

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'sales' | 'margin'>('sales')
  const [orders, setOrders] = useState<Order[]>([])
  const [perfumes, setPerfumes] = useState<Perfume[]>([])
  const [topSelling, setTopSelling] = useState<ProductSales[]>([])
  const [topMargin, setTopMargin] = useState<ProductMargin[]>([])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [ordersData, perfumesData] = await Promise.all([
        getAllOrders(),
        getAllPerfumes()
      ])
      
      setOrders(ordersData)
      setPerfumes(perfumesData)
      
      // Calcular productos más vendidos
      calculateTopSelling(ordersData, perfumesData)
      
      // Calcular productos con mayor margen
      calculateTopMargin(perfumesData)
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  function calculateTopSelling(ordersData: Order[], perfumesData: Perfume[]) {
    const salesMap = new Map<string, ProductSales>()

    // Procesar todas las órdenes
    ordersData.forEach(order => {
      order.items.forEach(item => {
        const existing = salesMap.get(item.perfumeId)
        if (existing) {
          existing.totalQuantity += item.quantity
          existing.totalRevenue += item.price * item.quantity
          existing.orderCount += 1
        } else {
          const perfume = perfumesData.find(p => p.id === item.perfumeId)
          salesMap.set(item.perfumeId, {
            perfumeId: item.perfumeId,
            name: item.name,
            imageUrl: item.imageUrl || perfume?.imageUrl,
            totalQuantity: item.quantity,
            totalRevenue: item.price * item.quantity,
            orderCount: 1
          })
        }
      })
    })

    // Convertir a array y ordenar por cantidad vendida
    const topSellingArray = Array.from(salesMap.values())
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 10) // Top 10

    setTopSelling(topSellingArray)
  }

  function calculateTopMargin(perfumesData: Perfume[]) {
    const margins: ProductMargin[] = []

    perfumesData.forEach(perfume => {
      if (perfume.costPrice && perfume.costPrice > 0 && perfume.id) {
        const marginAmount = perfume.price - perfume.costPrice
        const marginPercentage = (marginAmount / perfume.costPrice) * 100

        margins.push({
          perfumeId: perfume.id,
          name: perfume.name,
          imageUrl: perfume.imageUrl,
          costPrice: perfume.costPrice,
          salePrice: perfume.price,
          marginAmount,
          marginPercentage
        })
      }
    })

    // Ordenar por margen de ganancia (monto) y tomar top 10
    const topMarginArray = margins
      .sort((a, b) => b.marginAmount - a.marginAmount)
      .slice(0, 10)

    setTopMargin(topMarginArray)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#D4AF37' }}></div>
          <p className="mt-4 text-sm" style={{ color: '#999' }}>Cargando estadísticas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}>
          <p className="text-xs mb-1" style={{ color: '#999' }}>Total Pedidos</p>
          <p className="text-xl font-bold" style={{ color: '#D4AF37' }}>{orders.length}</p>
        </div>
        <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}>
          <p className="text-xs mb-1" style={{ color: '#999' }}>Total Productos</p>
          <p className="text-xl font-bold" style={{ color: '#D4AF37' }}>{perfumes.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b" style={{ borderColor: '#444' }}>
        <button
          onClick={() => setActiveTab('sales')}
          className="flex-1 px-4 py-2 text-sm font-medium transition-all"
          style={{
            color: activeTab === 'sales' ? '#D4AF37' : '#999',
            borderBottom: activeTab === 'sales' ? '2px solid #D4AF37' : '2px solid transparent',
            backgroundColor: activeTab === 'sales' ? 'rgba(212, 175, 55, 0.1)' : 'transparent'
          }}
        >
          Productos Más Vendidos
        </button>
        <button
          onClick={() => setActiveTab('margin')}
          className="flex-1 px-4 py-2 text-sm font-medium transition-all"
          style={{
            color: activeTab === 'margin' ? '#D4AF37' : '#999',
            borderBottom: activeTab === 'margin' ? '2px solid #D4AF37' : '2px solid transparent',
            backgroundColor: activeTab === 'margin' ? 'rgba(212, 175, 55, 0.1)' : 'transparent'
          }}
        >
          Margen de Ganancia
        </button>
      </div>

      {/* Top Selling Products */}
      {activeTab === 'sales' && (
      <div>
        <h3 className="text-lg font-bold mb-4" style={{ color: '#D4AF37' }}>
          Productos Más Vendidos
        </h3>
        {topSelling.length === 0 ? (
          <div className="p-6 rounded-lg text-center" style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}>
            <p className="text-sm" style={{ color: '#999' }}>No hay datos de ventas aún</p>
          </div>
        ) : (
          <div className="space-y-3">
            {topSelling.map((product, index) => (
              <div
                key={product.perfumeId}
                className="p-3 rounded-lg"
                style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12">
                    {product.imageUrl ? (
                      <PerfumeImage
                        imageUrl={product.imageUrl}
                        perfumeName={product.name}
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full rounded" style={{ backgroundColor: '#1a1a1a' }}></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold" style={{ color: '#D4AF37' }}>
                        #{index + 1}
                      </span>
                      <h4 className="text-sm font-semibold truncate" style={{ color: '#FFFFFF' }}>
                        {product.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span style={{ color: '#999' }}>
                        Cantidad: <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>{product.totalQuantity}</span>
                      </span>
                      <span style={{ color: '#999' }}>
                        Ventas: <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>${product.totalRevenue.toFixed(2)}</span>
                      </span>
                      <span style={{ color: '#999' }}>
                        Pedidos: <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>{product.orderCount}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      )}

      {/* Top Margin Products */}
      {activeTab === 'margin' && (
      <div>
        <h3 className="text-lg font-bold mb-4" style={{ color: '#D4AF37' }}>
          Productos con Mayor Margen de Ganancia
        </h3>
        {topMargin.length === 0 ? (
          <div className="p-6 rounded-lg text-center" style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}>
            <p className="text-sm" style={{ color: '#999' }}>
              No hay productos con precio de costo configurado
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {topMargin.map((product, index) => (
              <div
                key={product.perfumeId}
                className="p-3 rounded-lg"
                style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12">
                    {product.imageUrl ? (
                      <PerfumeImage
                        imageUrl={product.imageUrl}
                        perfumeName={product.name}
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full rounded" style={{ backgroundColor: '#1a1a1a' }}></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold" style={{ color: '#D4AF37' }}>
                        #{index + 1}
                      </span>
                      <h4 className="text-sm font-semibold truncate" style={{ color: '#FFFFFF' }}>
                        {product.name}
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span style={{ color: '#999' }}>Costo: </span>
                        <span style={{ color: '#999' }}>${product.costPrice.toFixed(2)}</span>
                      </div>
                      <div>
                        <span style={{ color: '#999' }}>Venta: </span>
                        <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>${product.salePrice.toFixed(2)}</span>
                      </div>
                      <div>
                        <span style={{ color: '#999' }}>Ganancia: </span>
                        <span style={{ color: '#22c55e', fontWeight: 'bold' }}>${product.marginAmount.toFixed(2)}</span>
                      </div>
                      <div>
                        <span style={{ color: '#999' }}>Margen: </span>
                        <span style={{ color: '#22c55e', fontWeight: 'bold' }}>{product.marginPercentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      )}
    </div>
  )
}

