import type { Metadata } from 'next'
import './globals.css'
import RegisterSW from './register-sw'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { CartProvider } from '@/contexts/CartContext'
import Cart from '@/components/Cart'

export const metadata: Metadata = {
  title: 'Arabiyat - App Móvil',
  description: 'Aplicación web móvil con diseño mobile-first',
  manifest: '/manifest.json',
  themeColor: '#A87C2A',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Arabiyat',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" data-theme="modernElegance">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ backgroundColor: '#FFFFFF', margin: 0, padding: 0 }}>
        <ThemeProvider>
          <CartProvider>
            {children}
            <Cart />
            <RegisterSW />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

