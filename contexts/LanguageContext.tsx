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
    'cart.minimumOrder': 'Pedido mínimo',
    'cart.remainingAmount': 'Te faltan',
    'cart.toComplete': 'para completar tu pedido',
    'cart.subtotal': 'Subtotal',
    'cart.remove': 'Eliminar',
    'cart.removeItem': 'Eliminar producto',
    'cart.decreaseQuantity': 'Disminuir cantidad',
    'cart.increaseQuantity': 'Aumentar cantidad',
    
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
    
    // Material de Apoyo
    'material.loading': 'Cargando material...',
    'material.noAvailable': 'No hay material de apoyo disponible.',
    'material.errorLoading': 'Error al cargar el material de apoyo',
    'material.videos': 'Videos',
    'material.photos': 'Fotos',
    'material.pdfs': 'PDFs',
    'material.others': 'Otros',
    'material.enlargedImage': 'Imagen ampliada',
    
    // Agenda
    'agenda.title': 'Agendar Cita',
    'agenda.subtitle': 'Selecciona una fecha y hora disponible',
    'agenda.availableTimes': 'Horarios Disponibles',
    'agenda.noTimesAvailable': 'No hay horarios disponibles para esta fecha',
    'agenda.contactInfo': 'Información de Contacto',
    'agenda.fullName': 'Nombre Completo',
    'agenda.email': 'Email',
    'agenda.phone': 'Teléfono',
    'agenda.notes': 'Notas (Opcional)',
    'agenda.notesPlaceholder': 'Información adicional sobre tu cita...',
    'agenda.confirmAppointment': 'Confirmar Cita',
    'agenda.scheduling': 'Agendando...',
    'agenda.selectDateAndTime': 'Por favor selecciona una fecha y hora',
    'agenda.appointmentScheduled': '¡Cita Agendada!',
    'agenda.appointmentSuccess': 'Tu cita ha sido agendada exitosamente. Te contactaremos pronto para confirmar.',
    'agenda.scheduleAnother': 'Agendar Otra Cita',
    'agenda.errorScheduling': 'Error al agendar la cita. Por favor intenta de nuevo.',
    'agenda.errorLoadingSlots': 'Error al cargar horarios disponibles',
    'agenda.months.january': 'Enero',
    'agenda.months.february': 'Febrero',
    'agenda.months.march': 'Marzo',
    'agenda.months.april': 'Abril',
    'agenda.months.may': 'Mayo',
    'agenda.months.june': 'Junio',
    'agenda.months.july': 'Julio',
    'agenda.months.august': 'Agosto',
    'agenda.months.september': 'Septiembre',
    'agenda.months.october': 'Octubre',
    'agenda.months.november': 'Noviembre',
    'agenda.months.december': 'Diciembre',
    'agenda.days.sunday': 'Dom',
    'agenda.days.monday': 'Lun',
    'agenda.days.tuesday': 'Mar',
    'agenda.days.wednesday': 'Mié',
    'agenda.days.thursday': 'Jue',
    'agenda.days.friday': 'Vie',
    'agenda.days.saturday': 'Sáb',
    
    // Autenticación
    'auth.login': 'Iniciar Sesión',
    'auth.signup': 'Registrarse',
    'auth.email': 'Email',
    'auth.password': 'Contraseña',
    'auth.name': 'Nombre',
    'auth.emailPlaceholder': 'tu@email.com',
    'auth.passwordPlaceholder': '••••••••',
    'auth.namePlaceholder': 'Tu nombre',
    'auth.googleSignIn': 'Continuar con Google',
    'auth.or': 'O',
    'auth.noAccount': '¿No tienes cuenta? Regístrate',
    'auth.haveAccount': '¿Ya tienes cuenta? Inicia sesión',
    'auth.logout': 'Cerrar Sesión',
    'auth.user': 'Usuario',
    'auth.loading': 'Cargando...',
    'auth.processing': 'Procesando...',
    'auth.error': 'Error al autenticar',
    'auth.userNotFound': 'Usuario no encontrado',
    'auth.wrongPassword': 'Contraseña incorrecta',
    'auth.emailInUse': 'Este email ya está en uso',
    'auth.weakPassword': 'La contraseña debe tener al menos 6 caracteres',
    'auth.invalidEmail': 'Email inválido',
    'auth.googleError': 'Error al iniciar sesión con Google',
    
    // Perfil
    'profile.myInfo': 'Mi Información',
    'profile.myOrders': 'Mis Pedidos',
    'profile.myAppointments': 'Mis Citas',
    'profile.settings': 'Configuración',
    'profile.notifications': 'Notificaciones',
    'profile.help': 'Ayuda y Soporte',
    'profile.updateError': 'Error al actualizar la información',
    'profile.emailCannotChange': 'El email no se puede cambiar',
    'profile.errorLoadingOrders': 'Error al cargar las órdenes',
    'profile.errorLoadingAppointments': 'Error al cargar las citas',
    'profile.errorLoadingNotifications': 'Error al cargar las notificaciones',
    
    // Órdenes
    'orders.order': 'Orden',
    'orders.quantity': 'Cantidad',
    'orders.loading': 'Cargando órdenes...',
    'orders.noOrders': 'No tienes órdenes aún',
    'orders.status.pending': 'Pendiente',
    'orders.status.processing': 'En Proceso',
    'orders.status.shipped': 'Enviado',
    'orders.status.delivered': 'Entregado',
    'orders.status.cancelled': 'Cancelado',
    
    // Citas
    'appointments.loading': 'Cargando citas...',
    'appointments.noAppointments': 'No tienes citas programadas',
    'appointments.status.pending': 'Pendiente',
    'appointments.status.confirmed': 'Confirmada',
    'appointments.status.cancelled': 'Cancelada',
    
    // Notificaciones
    'notifications.loading': 'Cargando notificaciones...',
    'notifications.noNotifications': 'No tienes notificaciones',
    'notifications.justNow': 'Ahora mismo',
    'notifications.minutesAgo': 'Hace {count} minuto(s)',
    'notifications.hoursAgo': 'Hace {count} hora(s)',
    'notifications.daysAgo': 'Hace {count} día(s)',
    'notifications.markAllRead': 'Marcar todas como leídas',
    
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
    'cart.minimumOrder': 'Minimum order',
    'cart.remainingAmount': 'You need',
    'cart.toComplete': 'more to complete your order',
    'cart.subtotal': 'Subtotal',
    'cart.remove': 'Remove',
    'cart.removeItem': 'Remove item',
    'cart.decreaseQuantity': 'Decrease quantity',
    'cart.increaseQuantity': 'Increase quantity',
    
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
    
    // Material de Apoyo
    'material.loading': 'Loading material...',
    'material.noAvailable': 'No support material available.',
    'material.errorLoading': 'Error loading support material',
    'material.videos': 'Videos',
    'material.photos': 'Photos',
    'material.pdfs': 'PDFs',
    'material.others': 'Others',
    'material.enlargedImage': 'Enlarged image',
    
    // Agenda
    'agenda.title': 'Schedule Appointment',
    'agenda.subtitle': 'Select an available date and time',
    'agenda.availableTimes': 'Available Times',
    'agenda.noTimesAvailable': 'No available times for this date',
    'agenda.contactInfo': 'Contact Information',
    'agenda.fullName': 'Full Name',
    'agenda.email': 'Email',
    'agenda.phone': 'Phone',
    'agenda.notes': 'Notes (Optional)',
    'agenda.notesPlaceholder': 'Additional information about your appointment...',
    'agenda.confirmAppointment': 'Confirm Appointment',
    'agenda.scheduling': 'Scheduling...',
    'agenda.selectDateAndTime': 'Please select a date and time',
    'agenda.appointmentScheduled': 'Appointment Scheduled!',
    'agenda.appointmentSuccess': 'Your appointment has been scheduled successfully. We will contact you soon to confirm.',
    'agenda.scheduleAnother': 'Schedule Another Appointment',
    'agenda.errorScheduling': 'Error scheduling appointment. Please try again.',
    'agenda.errorLoadingSlots': 'Error loading available times',
    'agenda.months.january': 'January',
    'agenda.months.february': 'February',
    'agenda.months.march': 'March',
    'agenda.months.april': 'April',
    'agenda.months.may': 'May',
    'agenda.months.june': 'June',
    'agenda.months.july': 'July',
    'agenda.months.august': 'August',
    'agenda.months.september': 'September',
    'agenda.months.october': 'October',
    'agenda.months.november': 'November',
    'agenda.months.december': 'December',
    'agenda.days.sunday': 'Sun',
    'agenda.days.monday': 'Mon',
    'agenda.days.tuesday': 'Tue',
    'agenda.days.wednesday': 'Wed',
    'agenda.days.thursday': 'Thu',
    'agenda.days.friday': 'Fri',
    'agenda.days.saturday': 'Sat',
    
    // Authentication
    'auth.login': 'Sign In',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Name',
    'auth.emailPlaceholder': 'your@email.com',
    'auth.passwordPlaceholder': '••••••••',
    'auth.namePlaceholder': 'Your name',
    'auth.googleSignIn': 'Continue with Google',
    'auth.or': 'Or',
    'auth.noAccount': 'Don\'t have an account? Sign up',
    'auth.haveAccount': 'Already have an account? Sign in',
    'auth.logout': 'Sign Out',
    'auth.user': 'User',
    'auth.loading': 'Loading...',
    'auth.processing': 'Processing...',
    'auth.error': 'Authentication error',
    'auth.userNotFound': 'User not found',
    'auth.wrongPassword': 'Wrong password',
    'auth.emailInUse': 'This email is already in use',
    'auth.weakPassword': 'Password must be at least 6 characters',
    'auth.invalidEmail': 'Invalid email',
    'auth.googleError': 'Error signing in with Google',
    
    // Profile
    'profile.myInfo': 'My Information',
    'profile.myOrders': 'My Orders',
    'profile.myAppointments': 'My Appointments',
    'profile.settings': 'Settings',
    'profile.notifications': 'Notifications',
    'profile.help': 'Help & Support',
    'profile.updateError': 'Error updating information',
    'profile.emailCannotChange': 'Email cannot be changed',
    'profile.errorLoadingOrders': 'Error loading orders',
    'profile.errorLoadingAppointments': 'Error loading appointments',
    'profile.errorLoadingNotifications': 'Error loading notifications',
    
    // Orders
    'orders.order': 'Order',
    'orders.quantity': 'Quantity',
    'orders.loading': 'Loading orders...',
    'orders.noOrders': 'You have no orders yet',
    'orders.status.pending': 'Pending',
    'orders.status.processing': 'Processing',
    'orders.status.shipped': 'Shipped',
    'orders.status.delivered': 'Delivered',
    'orders.status.cancelled': 'Cancelled',
    
    // Appointments
    'appointments.loading': 'Loading appointments...',
    'appointments.noAppointments': 'You have no scheduled appointments',
    'appointments.status.pending': 'Pending',
    'appointments.status.confirmed': 'Confirmed',
    'appointments.status.cancelled': 'Cancelled',
    
    // Notifications
    'notifications.loading': 'Loading notifications...',
    'notifications.noNotifications': 'You have no notifications',
    'notifications.justNow': 'Just now',
    'notifications.minutesAgo': '{count} minute(s) ago',
    'notifications.hoursAgo': '{count} hour(s) ago',
    'notifications.daysAgo': '{count} day(s) ago',
    'notifications.markAllRead': 'Mark all as read',
    
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

