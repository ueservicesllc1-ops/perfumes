'use client'

import MobileNavbar from '@/components/MobileNavbar'
import BottomNavigation from '@/components/BottomNavigation'
import ThemeSwitcher from '@/components/ThemeSwitcher'

export default function Configuracion() {
  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: 'var(--theme-bg)' }}>
      <MobileNavbar />
      
      <main className="max-w-sm mx-auto pt-20 px-4">
        {/* Header */}
        <section className="mb-6">
          <h1 className="text-2xl font-bold text-darkGold mb-2">
            Configuración
          </h1>
          <p className="text-warmSand text-sm">
            Personaliza tu experiencia
          </p>
        </section>

        {/* Sección de Tema */}
        <section className="mb-6">
          <div className="bg-leather border border-darkGold/20 rounded-2xl p-6">
            <ThemeSwitcher />
          </div>
        </section>

        {/* Otras configuraciones */}
        <section className="mb-6">
          <div className="bg-leather border border-darkGold/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-ivory mb-4">
              Preferencias
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-ivory">Notificaciones</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-leather-900 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-darkGold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-darkGold"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-ivory">Modo oscuro</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-leather-900 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-darkGold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-darkGold"></div>
                </label>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BottomNavigation />
    </div>
  )
}

