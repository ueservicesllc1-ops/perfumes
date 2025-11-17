'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useCart } from '@/contexts/CartContext'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const pathname = usePathname()
  const { totalItems } = useCart()
  const { t } = useLanguage()

  const navItems = [
    {
      href: '/',
      label: t('footer.home'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      href: '/agenda',
      label: t('footer.agenda'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      href: 'https://www.tiktok.com/@jcsellers',
      label: 'TikTok',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      ),
      external: true,
    },
    {
      href: '/carrito',
      label: t('footer.cart'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      badge: totalItems > 0 ? totalItems : undefined,
    },
    {
      href: '/perfil',
      label: t('footer.profile'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ]

  return (
    <motion.footer 
      className="w-full fixed bottom-0 left-0 right-0 z-50"
      style={{ 
        backgroundColor: '#000000',
        borderTop: '1px solid #D4AF37',
        padding: '0.75rem 0.5rem',
        minHeight: '60px',
        boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.5)',
      }}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-sm mx-auto">
        <nav className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = !item.external && pathname === item.href
            const content = (
              <div className="flex flex-col items-center gap-1">
                <div className="relative inline-block">
                  <div
                    style={{
                      color: isActive ? '#D4AF37' : '#F8F5EF',
                      opacity: isActive ? 1 : 0.7,
                    }}
                  >
                    {item.icon}
                  </div>
                  {item.badge && item.badge > 0 && (
                    <span
                      className="absolute -top-1 -right-1 flex items-center justify-center rounded-full text-[10px] font-bold z-10"
                      style={{
                        backgroundColor: '#D4AF37',
                        color: '#000000',
                        minWidth: '18px',
                        height: '18px',
                        padding: '0 4px',
                        lineHeight: '18px',
                      }}
                    >
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span
                  className="text-[10px] font-medium"
                  style={{
                    color: isActive ? '#D4AF37' : '#F8F5EF',
                    opacity: isActive ? 1 : 0.7,
                  }}
                >
                  {item.label}
                </span>
              </div>
            )

            return (
              <motion.div
                key={item.label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center"
                  >
                    {content}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="flex-1 flex items-center justify-center"
                  >
                    {content}
                  </Link>
                )}
              </motion.div>
            )
          })}
        </nav>
      </div>
    </motion.footer>
  )
}

