'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'

export default function MobileNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { currentTheme } = useTheme()

  // Header siempre negro
  const headerBg = '#0D0D0D'
  
  // Colores para los elementos del header según el tema
  // Usar los colores del tema actual
  const accentColor = currentTheme.colors.accent

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b elegant-fade-in" style={{ 
        background: 'linear-gradient(135deg, rgba(10, 14, 26, 0.95) 0%, rgba(26, 31, 46, 0.95) 100%)',
        borderColor: 'var(--theme-border)',
        borderWidth: '1px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 107, 157, 0.2)'
      }}>
        <div className="max-w-sm mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo o Título */}
          <div className="flex items-center space-x-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center border"
              style={{
                backgroundColor: `${accentColor}33`, // 20% opacity
                borderColor: `${accentColor}66` // 40% opacity
              }}
            >
              <svg 
                className="w-5 h-5" 
                fill="currentColor" 
                viewBox="0 0 24 24"
                style={{
                  color: accentColor
                }}
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h1 
              className="text-xl font-bold elegant-text-gradient"
              style={{
                letterSpacing: '0.05em',
                textShadow: '0 2px 15px rgba(255, 107, 157, 0.5), 0 0 20px rgba(0, 212, 255, 0.3)'
              }}
            >
              Arabiyat
            </h1>
          </div>

          {/* Menú Hamburguesa */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg border transition-all duration-200"
            style={{
              backgroundColor: `${accentColor}1A`, // 10% opacity
              borderColor: `${accentColor}4D` // 30% opacity
            }}
            aria-label="Menú"
          >
            <svg
              className={`w-6 h-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{
                color: accentColor
              }}
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Overlay oscuro cuando el menú está abierto */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Menú Desplegable lateral */}
      <div
        className={`fixed top-0 right-0 h-full w-64 border-l shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          backgroundColor: currentTheme.colors.surface,
          borderColor: `${accentColor}4D`, // 30% opacity
          borderWidth: '1px'
        }}
      >
        <div className="p-6 pt-20">
          <div className="flex flex-col space-y-1">
            <Link
              href="/"
              className="px-4 py-3 rounded-xl hover:bg-leather active:bg-leather-900 transition-all duration-200 text-ivory font-medium flex items-center space-x-3 border-l-2 border-transparent hover:border-darkGold"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg className="w-5 h-5 text-darkGold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Inicio</span>
            </Link>
            <Link
              href="/catalogo"
              className="px-4 py-3 rounded-xl hover:bg-leather active:bg-leather-900 transition-all duration-200 text-ivory font-medium flex items-center space-x-3 border-l-2 border-transparent hover:border-darkGold"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg className="w-5 h-5 text-darkGold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>Catálogo</span>
            </Link>
            <Link
              href="/favoritos"
              className="px-4 py-3 rounded-xl hover:bg-leather active:bg-leather-900 transition-all duration-200 text-ivory font-medium flex items-center space-x-3 border-l-2 border-transparent hover:border-darkGold"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg className="w-5 h-5 text-darkGold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>Favoritos</span>
            </Link>
            <Link
              href="/perfil"
              className="px-4 py-3 rounded-xl hover:bg-leather active:bg-leather-900 transition-all duration-200 text-ivory font-medium flex items-center space-x-3 border-l-2 border-transparent hover:border-darkGold"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg className="w-5 h-5 text-darkGold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Perfil</span>
            </Link>
            <div className="border-t border-leather my-2"></div>
            <Link
              href="/configuracion"
              className="px-4 py-3 rounded-xl hover:bg-leather active:bg-leather-900 transition-all duration-200 text-warmSand font-medium flex items-center space-x-3 border-l-2 border-transparent hover:border-warmSand"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg className="w-5 h-5 text-warmSand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Configuración</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

