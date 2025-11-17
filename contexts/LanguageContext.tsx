'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'es' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Traducciones
const translations: Record<Language, Record<string, string>> = {
  es: {
    // Navegación
    'nav.home': 'Inicio',
    'nav.catalog': 'Catálogo',
    'nav.agenda': 'Agenda',
    'nav.cart': 'Carrito',
    'nav.material': 'Material de Apoyo',
    'nav.profile': 'Perfil',
    'nav.privacy': 'Política de Privacidad',
    'nav.terms': 'Términos y Condiciones',
    'nav.shipping': 'Información de Envío',
    'nav.returns': 'Póliza de Devolución',
    'nav.about': 'Nosotros',
    
    // Footer
    'footer.home': 'Inicio',
    'footer.agenda': 'Agenda',
    'footer.cart': 'Carrito',
    'footer.profile': 'Usuario',
    
    // Productos
    'products.new': 'Productos Nuevos',
    'products.addToCart': 'Agregar al Carrito',
    'products.inStock': 'En Stock',
    'products.outOfStock': 'Agotado',
    
    // Carrito
    'cart.title': 'Carrito de Compras',
    'cart.empty': 'Tu carrito está vacío',
    'cart.continue': 'Seguir Comprando',
    'cart.total': 'Total',
    'cart.checkout': 'Finalizar Compra',
    'cart.minimum': 'El pedido mínimo es de $500',
    
    // Checkout
    'checkout.title': 'Finalizar Compra',
    'checkout.shipping': 'Información de Envío',
    'checkout.name': 'Nombre completo',
    'checkout.email': 'Email',
    'checkout.phone': 'Teléfono',
    'checkout.address': 'Dirección',
    'checkout.city': 'Ciudad',
    'checkout.state': 'Estado',
    'checkout.zip': 'Código Postal',
    'checkout.country': 'País',
    'checkout.confirm': 'Confirmar Orden',
    
    // Home
    'home.newProducts': 'Productos Nuevos',
    'home.internationalShipping': 'Envíos Internacionales',
    'home.collection': 'Colección',
    'home.new': 'Nuevo',
    'home.offers': 'Ofertas',
    
    // Catálogo
    'catalog.title': 'Catálogo de Perfumes',
    'catalog.allCategories': 'Todos',
    'catalog.allBrands': 'Todas',
    'catalog.allCollections': 'Todas',
    'catalog.categories': 'Categorías',
    'catalog.brands': 'Marcas',
    'catalog.collections': 'Colecciones',
    
    // Otros
    'button.download': 'Descargar',
    'button.close': 'Cerrar',
    'button.save': 'Guardar',
    'button.cancel': 'Cancelar',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.catalog': 'Catalog',
    'nav.agenda': 'Appointments',
    'nav.cart': 'Cart',
    'nav.material': 'Support Material',
    'nav.profile': 'Profile',
    'nav.privacy': 'Privacy Policy',
    'nav.terms': 'Terms and Conditions',
    'nav.shipping': 'Shipping Information',
    'nav.returns': 'Return Policy',
    'nav.about': 'About Us',
    
    // Footer
    'footer.home': 'Home',
    'footer.agenda': 'Appointments',
    'footer.cart': 'Cart',
    'footer.profile': 'User',
    
    // Products
    'products.new': 'New Products',
    'products.addToCart': 'Add to Cart',
    'products.inStock': 'In Stock',
    'products.outOfStock': 'Out of Stock',
    
    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.continue': 'Continue Shopping',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.minimum': 'Minimum order is $500',
    
    // Checkout
    'checkout.title': 'Checkout',
    'checkout.shipping': 'Shipping Information',
    'checkout.name': 'Full Name',
    'checkout.email': 'Email',
    'checkout.phone': 'Phone',
    'checkout.address': 'Address',
    'checkout.city': 'City',
    'checkout.state': 'State',
    'checkout.zip': 'Zip Code',
    'checkout.country': 'Country',
    'checkout.confirm': 'Confirm Order',
    
    // Home
    'home.newProducts': 'New Products',
    'home.internationalShipping': 'International Shipping',
    'home.collection': 'Collection',
    'home.new': 'New',
    'home.offers': 'Offers',
    
    // Catalog
    'catalog.title': 'Perfume Catalog',
    'catalog.allCategories': 'All',
    'catalog.allBrands': 'All',
    'catalog.allCollections': 'All',
    'catalog.categories': 'Categories',
    'catalog.brands': 'Brands',
    'catalog.collections': 'Collections',
    
    // Others
    'button.download': 'Download',
    'button.close': 'Close',
    'button.save': 'Save',
    'button.cancel': 'Cancel',
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es')

  useEffect(() => {
    // Cargar idioma guardado
    const saved = localStorage.getItem('language') as Language
    if (saved && (saved === 'es' || saved === 'en')) {
      setLanguageState(saved)
    }
  }, [])

  function setLanguage(lang: Language) {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  function t(key: string): string {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

