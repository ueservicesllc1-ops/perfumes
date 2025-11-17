'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Perfil() {
  const stats = [
    { 
      label: 'Favoritos', 
      value: '0', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    { 
      label: 'Pedidos', 
      value: '0', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    { 
      label: 'Citas', 
      value: '0', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ]

  const menuItems = [
    { 
      label: 'Mi Información', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    { 
      label: 'Mis Pedidos', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    { 
      label: 'Mis Citas', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    { 
      label: 'Configuración', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    { 
      label: 'Notificaciones', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
    { 
      label: 'Ayuda y Soporte', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#182B21', color: '#F8F5EF' }}>
      <Header />
      
      <main className="max-w-sm mx-auto pt-16 px-4 pb-24">
        {/* Header del perfil */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <motion.div
            className="rounded-lg p-6 text-center relative overflow-hidden"
            style={{ 
              backgroundColor: '#344A3D',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ 
                backgroundColor: '#182B21',
                border: '3px solid #D4AF37'
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#D4AF37' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </motion.div>
            <motion.h1
              className="text-2xl font-bold mb-1"
              style={{ color: '#D4AF37' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Usuario
            </motion.h1>
            <motion.p
              className="text-sm mb-4"
              style={{ color: '#999' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              usuario@ejemplo.com
            </motion.p>
            <motion.button
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ 
                backgroundColor: '#D4AF37',
                color: '#000000'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Editar Perfil
            </motion.button>
          </motion.div>
        </motion.section>

        {/* Stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="rounded-lg p-4 text-center"
                style={{ 
                  backgroundColor: '#344A3D',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center"
                  style={{ 
                    backgroundColor: '#182B21',
                    color: '#D4AF37'
                  }}
                >
                  {stat.icon}
                </div>
                <p className="text-xl font-bold" style={{ color: '#D4AF37' }}>
                  {stat.value}
                </p>
                <p className="text-xs mt-1" style={{ color: '#999' }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Opciones del perfil */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="space-y-3">
            {menuItems.map((item, index) => (
              <motion.button
                key={index}
                className="w-full rounded-lg p-4 flex items-center justify-between"
                style={{ 
                  backgroundColor: '#344A3D',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ 
                  scale: 1.02,
                  x: 4,
                  boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ 
                      backgroundColor: '#182B21',
                      color: '#D4AF37'
                    }}
                  >
                    {item.icon}
                  </div>
                  <span className="font-semibold" style={{ color: '#F8F5EF' }}>
                    {item.label}
                  </span>
                </div>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: '#999' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.button>
            ))}
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  )
}
