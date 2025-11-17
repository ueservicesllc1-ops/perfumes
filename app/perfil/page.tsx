import MobileNavbar from '@/components/MobileNavbar'
import BottomNavigation from '@/components/BottomNavigation'

export default function Perfil() {
  const stats = [
    { 
      label: 'Favoritos', 
      value: '24', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: 'bg-darkGold/20 border-darkGold/30 text-darkGold',
    },
    { 
      label: 'Proyectos', 
      value: '12', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
      color: 'bg-warmSand/20 border-warmSand/30 text-warmSand',
    },
    { 
      label: 'Logros', 
      value: '8', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      color: 'bg-gold-600/20 border-gold-600/30 text-gold-600',
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
      color: 'bg-darkGold/20 border-darkGold/30 text-darkGold' 
    },
    { 
      label: 'Configuración', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ), 
      color: 'bg-leather-900 border-leather-700 text-ivory/80' 
    },
    { 
      label: 'Notificaciones', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ), 
      color: 'bg-gold-600/20 border-gold-600/30 text-gold-600' 
    },
    { 
      label: 'Privacidad', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ), 
      color: 'bg-warmSand/20 border-warmSand/30 text-warmSand' 
    },
    { 
      label: 'Ayuda y Soporte', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ), 
      color: 'bg-darkGold/20 border-darkGold/30 text-darkGold' 
    },
    { 
      label: 'Cerrar Sesión', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ), 
      color: 'bg-warmSand/20 border-warmSand/30 text-warmSand' 
    },
  ]

  return (
    <div className="min-h-screen bg-coffeeBlack pb-20">
      <MobileNavbar />
      
      <main className="max-w-sm mx-auto pt-20 px-4">
        {/* Header del perfil */}
        <section className="mb-6">
          <div className="bg-gradient-to-br from-leather via-leather-900 to-leather border border-darkGold/20 rounded-2xl p-6 shadow-xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-darkGold/5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-warmSand/5 rounded-full -ml-12 -mb-12"></div>
            <div className="relative">
              <div className="w-24 h-24 bg-darkGold/20 backdrop-blur-sm border-4 border-darkGold/30 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <svg className="w-12 h-12 text-darkGold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-1 text-darkGold">
                Usuario Ejemplo
              </h1>
              <p className="text-ivory/80 text-sm mb-4">
                usuario@ejemplo.com
              </p>
              <button className="bg-darkGold/20 border border-darkGold/30 hover:bg-darkGold/30 active:scale-95 transition-all px-4 py-2 rounded-lg text-sm font-medium text-darkGold">
                Editar Perfil
              </button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-6">
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-leather border rounded-xl p-4 text-center border-darkGold/10"
              >
                <div className={`${stat.color} w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center border`}>
                  {stat.icon}
                </div>
                <p className="text-xl font-bold text-darkGold">{stat.value}</p>
                <p className="text-xs text-ivory/80 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Opciones del perfil */}
        <section>
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className="w-full bg-leather border border-darkGold/10 rounded-xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform hover:border-darkGold/20"
              >
                <div className="flex items-center space-x-3">
                  <div className={`${item.color} w-10 h-10 rounded-lg flex items-center justify-center border`}>
                    {item.icon}
                  </div>
                  <span className="font-semibold text-ivory">{item.label}</span>
                </div>
                <svg
                  className="w-5 h-5 text-ivory/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ))}
          </div>
        </section>
      </main>

      <BottomNavigation />
    </div>
  )
}
