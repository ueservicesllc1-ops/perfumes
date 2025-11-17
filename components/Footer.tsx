'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'

export default function Footer() {
  const pathname = usePathname()
  const { openCart, totalItems } = useCart()

  const navItems = [
    {
      href: '/',
      label: 'Inicio',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      href: '/agenda',
      label: 'Agenda',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      href: '#',
      label: 'Carrito',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      onClick: () => {
        openCart()
      },
      badge: totalItems > 0 ? totalItems : undefined,
    },
    {
      href: '/perfil',
      label: 'Usuario',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ]

  return (
    <footer 
      className="w-full fixed bottom-0 left-0 right-0 z-50"
      style={{ 
        backgroundColor: '#000000',
        borderTop: '1px solid #D4AF37',
        padding: '0.75rem 0.5rem',
        minHeight: '60px',
        boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div className="max-w-sm mx-auto">
        <nav className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const content = (
              <div className="flex flex-col items-center gap-1 relative">
                <div
                  style={{
                    color: isActive ? '#D4AF37' : '#FFFFFF',
                    opacity: isActive ? 1 : 0.7,
                  }}
                >
                  {item.icon}
                  {item.badge && item.badge > 0 && (
                    <span
                      className="absolute -top-1 -right-1 flex items-center justify-center rounded-full text-[10px] font-bold"
                      style={{
                        backgroundColor: '#D4AF37',
                        color: '#000000',
                        minWidth: '18px',
                        height: '18px',
                        padding: '0 4px',
                      }}
                    >
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span
                  className="text-[10px] font-medium"
                  style={{
                    color: isActive ? '#D4AF37' : '#FFFFFF',
                    opacity: isActive ? 1 : 0.7,
                  }}
                >
                  {item.label}
                </span>
              </div>
            )

            if (item.onClick) {
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="flex-1 flex items-center justify-center transition-all active:scale-95"
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                >
                  {content}
                </button>
              )
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex-1 flex items-center justify-center transition-all active:scale-95"
              >
                {content}
              </Link>
            )
          })}
        </nav>
      </div>
    </footer>
  )
}

