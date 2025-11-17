'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCart } from '@/contexts/CartContext'
import PerfumeImage from '@/components/PerfumeImage'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme, isDarkColor } from '@/contexts/ThemeContext'

export default function CarritoPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { currentTheme } = useTheme()
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, minimumOrderAmount, meetsMinimumOrder } = useCart()

  return (
    <div className="min-h-screen" style={{ backgroundColor: currentTheme.colors.background, color: currentTheme.colors.text }}>
      <Header />
      
      <main className="max-w-sm mx-auto pt-16 px-4 pb-32">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold" style={{ color: currentTheme.colors.accent }}>
            {t('cart.title')}
          </h1>
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg transition-all active:scale-95"
            style={{
              backgroundColor: currentTheme.colors.surface,
              color: currentTheme.colors.accent,
            }}
            aria-label="Volver"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Lista de items */}
        <div className="mb-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-sm mb-6" style={{ color: currentTheme.colors.textSecondary }}>
                {t('cart.empty')}
              </p>
              <Link
                href="/catalogo"
                className="inline-block px-6 py-3 rounded-lg font-semibold text-center transition-all active:scale-95"
                style={{
                  backgroundColor: currentTheme.colors.accent,
                  color: isDarkColor(currentTheme.colors.accent) ? '#F8F5EF' : '#1F1F1F',
                }}
              >
                {t('catalog.title')}
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-lg"
                  style={{
                    backgroundColor: currentTheme.colors.surface,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    y: -4,
                    boxShadow: '0 8px 20px rgba(212, 175, 55, 0.4)',
                    transition: { duration: 0.3 }
                  }}
                >
                  {/* Imagen */}
                  <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden" style={{ backgroundColor: '#344A3D' }}>
                    <PerfumeImage
                      imageUrl={item.imageUrl}
                      perfumeName={item.name}
                      className="h-20"
                    />
                  </div>

                  {/* Información */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2" style={{ color: '#F8F5EF' }}>
                      {item.name}
                    </h3>
                    {item.size && (
                      <p className="text-xs mb-2" style={{ color: currentTheme.colors.textSecondary }}>
                        {item.size}
                      </p>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base font-bold" style={{ color: currentTheme.colors.accent }}>
                        ${item.price.toFixed(2)}
                      </span>
                      
                      {/* Controles de cantidad */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id!, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-95"
                          style={{
                            backgroundColor: currentTheme.colors.surface,
                            color: currentTheme.colors.accent,
                            border: '1px solid #D4AF37',
                          }}
                          aria-label={t('cart.decreaseQuantity')}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="text-sm font-semibold w-8 text-center" style={{ color: '#F8F5EF' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id!, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-95"
                          style={{
                            backgroundColor: currentTheme.colors.surface,
                            color: currentTheme.colors.accent,
                            border: '1px solid #D4AF37',
                          }}
                          aria-label={t('cart.increaseQuantity')}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* Subtotal */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: '#6B5D4F' }}>
                        {t('cart.subtotal')}: ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id!)}
                        className="text-xs px-2 py-1 rounded transition-all active:scale-95"
                        style={{
                          color: '#6B5D4F',
                        }}
                        aria-label={t('cart.removeItem')}
                      >
                        {t('cart.remove')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer con total y botón de checkout */}
        {items.length > 0 && (
          <div className="p-4 rounded-lg space-y-3" style={{ 
                    backgroundColor: currentTheme.colors.surface,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}>
            {/* Mensaje de mínimo de compra */}
            {!meetsMinimumOrder && (
              <div className="p-3 rounded-lg border" style={{
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                borderColor: 'rgba(212, 175, 55, 0.3)',
              }}>
                <p className="text-sm text-center" style={{ color: '#D4AF37' }}>
                  {t('cart.minimumOrder')}: ${minimumOrderAmount.toFixed(2)}
                </p>
                <p className="text-xs text-center mt-1" style={{ color: '#D4AF37', opacity: 0.8 }}>
                  {t('cart.remainingAmount')} ${(minimumOrderAmount - totalPrice).toFixed(2)} {t('cart.toComplete')}
                </p>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold" style={{ color: '#F8F5EF' }}>
                {t('cart.total')}:
              </span>
              <span className="text-2xl font-bold" style={{ color: '#D4AF37' }}>
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex gap-2">
              <Link
                href="/catalogo"
                className="flex-1 px-4 py-3 rounded-lg font-semibold text-center transition-all active:scale-95 border"
                style={{
                  backgroundColor: 'transparent',
                  color: '#D4AF37',
                  borderColor: '#D4AF37',
                }}
              >
                {t('cart.continue')}
              </Link>
              <Link
                href="/checkout"
                className={`flex-1 px-4 py-3 rounded-lg font-semibold text-center transition-all ${meetsMinimumOrder ? 'active:scale-95' : 'opacity-50 cursor-not-allowed pointer-events-none'}`}
                style={{
                  backgroundColor: meetsMinimumOrder ? '#D4AF37' : '#666',
                  color: meetsMinimumOrder ? '#000000' : '#FFFFFF',
                }}
              >
                {t('cart.checkout')}
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

