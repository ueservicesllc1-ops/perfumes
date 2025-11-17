import MobileNavbar from '@/components/MobileNavbar'
import BottomNavigation from '@/components/BottomNavigation'

export default function Explorar() {
  const categories = ['Todos', 'Popular', 'Nuevo', 'Tendencias']
  const contents = [
    { 
      title: 'Descubre el Arte', 
      subtitle: 'Explora colecciones únicas', 
      category: 'Arte', 
      gradient: 'from-gold-600/20 to-copper-500/20',
      borderColor: 'border-darkGold/30',
    },
    { 
      title: 'Tecnología Avanzada', 
      subtitle: 'Lo último en innovación', 
      category: 'Tech', 
      gradient: 'from-copper-500/20 to-gold-500/20',
      borderColor: 'border-warmSand/30',
    },
    { 
      title: 'Naturaleza Viva', 
      subtitle: 'Paisajes increíbles', 
      category: 'Naturaleza', 
      gradient: 'from-gold-500/20 to-copper-600/20',
      borderColor: 'border-darkGold/30',
    },
    { 
      title: 'Cultura Urbana', 
      subtitle: 'Vida en la ciudad', 
      category: 'Urbano', 
      gradient: 'from-copper-600/20 to-gold-600/20',
      borderColor: 'border-warmSand/30',
    },
    { 
      title: 'Música y Sonido', 
      subtitle: 'Ritmos y melodías', 
      category: 'Música', 
      gradient: 'from-gold-500/20 to-copper-500/20',
      borderColor: 'border-darkGold/30',
    },
    { 
      title: 'Gastronomía', 
      subtitle: 'Sabores del mundo', 
      category: 'Comida', 
      gradient: 'from-copper-500/20 to-gold-500/20',
      borderColor: 'border-warmSand/30',
    },
  ]

  return (
    <div className="min-h-screen bg-coffeeBlack pb-20">
      <MobileNavbar />
      
      <main className="max-w-sm mx-auto pt-20 px-4">
        {/* Header */}
        <section className="mb-6">
          <h1 className="text-2xl font-bold text-darkGold mb-2">
            Explorar
          </h1>
          <p className="text-ivory/80 text-sm">
            Descubre contenido increíble
          </p>
        </section>

        {/* Categorías */}
        <section className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                  index === 0
                    ? 'bg-darkGold text-coffeeBlack border-darkGold shadow-md'
                    : 'bg-leather text-ivory border-darkGold/20 hover:border-darkGold/40 active:scale-95'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>
        
        {/* Grid de Contenido */}
        <section className="space-y-4">
          {contents.map((content, index) => (
            <div
              key={index}
              className={`bg-leather border rounded-2xl overflow-hidden shadow-lg active:scale-[0.98] transition-transform ${content.borderColor} hover:border-opacity-50`}
            >
              <div className={`h-48 bg-gradient-to-br ${content.gradient} relative border-b ${content.borderColor}`}>
                <div className="absolute top-4 right-4">
                  <span className="bg-coffeeBlack/90 backdrop-blur-sm border border-darkGold/30 text-xs font-semibold px-3 py-1 rounded-full text-darkGold">
                    {content.category}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg mb-1 drop-shadow-lg">
                    {content.title}
                  </h3>
                  <p className="text-ivory text-sm drop-shadow">
                    {content.subtitle}
                  </p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-leather-900 border border-darkGold/20 rounded-full"></div>
                    <span className="text-sm text-ivory/80">Autor</span>
                  </div>
                  <button className="text-darkGold hover:text-darkGold active:scale-95 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      <BottomNavigation />
    </div>
  )
}
