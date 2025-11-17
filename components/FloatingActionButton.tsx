'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { toggleCart, totalItems } = useCart()

  const actions = [
    {
      label: 'Carrito',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: 'bg-darkGold',
      onClick: () => {
        setIsOpen(false)
        toggleCart()
      },
    },
  ]

  return (
    <>
      {/* Overlay cuando está abierto */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="fixed bottom-20 right-4 z-40 max-w-sm mx-auto left-4 md:left-auto">
        {/* Menú de acciones (se muestra cuando está abierto) */}
        {isOpen && (
          <div className="absolute bottom-20 right-0 flex flex-col space-y-3 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {actions.map((action, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-xs text-white bg-coffeeBlack/90 border border-darkGold/30 px-2 py-1 rounded-lg whitespace-nowrap">
                  {action.label}
                </span>
                <button
                  className={`${action.color} text-coffeeBlack shadow-xl rounded-full p-4 hover:scale-110 active:scale-95 transition-all duration-200 transform border border-darkGold/20`}
                  onClick={action.onClick}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {action.icon}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Botón principal FAB - Carrito */}
        <button
          onClick={toggleCart}
          className="elegant-button text-coffeeBlack rounded-full p-5 elegant-glow active:scale-95 transition-all duration-300 transform hover:scale-110 relative"
          aria-label="Carrito de compras"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 elegant-glow" style={{
              backgroundColor: 'var(--theme-surface)',
              color: 'var(--theme-accent)',
              borderColor: 'var(--theme-accent)'
            }}>
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          )}
        </button>
      </div>
    </>
  )
}

