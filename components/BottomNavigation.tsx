'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNavigation() {
  const pathname = usePathname()

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
      href: '/catalogo',
      label: 'Catálogo',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      href: '/favoritos',
      label: 'Favoritos',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      href: '/perfil',
      label: 'Perfil',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t safe-area-bottom elegant-fade-in" style={{ 
      background: 'linear-gradient(135deg, rgba(10, 14, 26, 0.95) 0%, rgba(26, 31, 46, 0.95) 100%)',
      borderColor: 'var(--theme-border)',
      borderWidth: '1px',
      boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 107, 157, 0.2)'
    }}>
      <div className="max-w-sm mx-auto">
        <div className="flex items-center justify-around px-1 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 py-2 px-2 rounded-xl transition-all duration-300 relative ${
                  isActive
                    ? 'scale-105' 
                    : 'active:scale-95'
                }`}
                style={{
                  color: isActive ? 'var(--theme-accent)' : 'var(--theme-text-secondary)'
                }}
              >
                <div className={`relative ${isActive ? 'transform scale-110' : ''} transition-transform duration-200`}>
                  {item.icon}
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full elegant-glow" style={{
                      backgroundColor: 'var(--theme-accent)',
                      border: '1px solid var(--theme-accent-2)'
                    }}></div>
                  )}
                </div>
                <span className={`text-xs mt-1 font-medium transition-all duration-300 ${
                  isActive ? 'font-semibold' : ''
                }`}
                style={{
                  color: isActive ? 'var(--theme-accent)' : 'var(--theme-text-secondary)'
                }}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 rounded-full elegant-glow" style={{
                    background: 'linear-gradient(90deg, var(--theme-accent), var(--theme-accent-2))'
                  }}></div>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

