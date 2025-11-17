import MobileNavbar from '@/components/MobileNavbar'
import BottomNavigation from '@/components/BottomNavigation'

export default function Favoritos() {
  const favorites = [
    {
      title: 'Proyecto Destacado',
      subtitle: 'Guardado hace 2 días',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      color: 'bg-gold-500/20 border-darkGold/30 text-darkGold',
      category: 'Proyecto',
    },
    {
      title: 'Artículo Interesante',
      subtitle: 'Guardado hace 1 semana',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-warmSand/20 border-warmSand/30 text-warmSand',
      category: 'Artículo',
    },
    {
      title: 'Video Tutorial',
      subtitle: 'Guardado hace 3 días',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-gold-600/20 border-gold-600/30 text-gold-600',
      category: 'Video',
    },
    {
      title: 'Receta Especial',
      subtitle: 'Guardado hace 5 días',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'bg-warmSand/20 border-warmSand/30 text-warmSand',
      category: 'Receta',
    },
    {
      title: 'Lugar Favorito',
      subtitle: 'Guardado hace 1 mes',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'bg-gold-500/20 border-darkGold/30 text-darkGold',
      category: 'Lugar',
    },
  ]

  return (
    <div className="min-h-screen bg-coffeeBlack pb-20">
      <MobileNavbar />
      
      <main className="max-w-sm mx-auto pt-20 px-4">
        {/* Header */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-darkGold">
              Favoritos
            </h1>
            <span className="text-sm text-ivory/80 bg-leather border border-darkGold/20 px-3 py-1 rounded-full">
              {favorites.length}
            </span>
          </div>
          <p className="text-ivory/80 text-sm">
            Tus elementos guardados
          </p>
        </section>
        
        {/* Lista de Favoritos */}
        <section className="space-y-3">
          {favorites.map((fav, index) => (
            <div
              key={index}
              className="bg-leather border border-darkGold/10 rounded-2xl p-4 flex items-center space-x-4 active:scale-[0.98] transition-transform hover:border-darkGold/20"
            >
              <div className={`${fav.color} w-16 h-16 rounded-xl flex items-center justify-center border flex-shrink-0`}>
                {fav.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-bold text-ivory truncate">
                    {fav.title}
                  </h3>
                  <span className="text-xs bg-leather-900 border border-darkGold/20 text-darkGold px-2 py-0.5 rounded-full whitespace-nowrap">
                    {fav.category}
                  </span>
                </div>
                <p className="text-sm text-ivory/80">
                  {fav.subtitle}
                </p>
              </div>
              <button className="text-darkGold hover:text-darkGold active:scale-95 transition-transform flex-shrink-0">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          ))}
        </section>

        {/* Empty State */}
        {favorites.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-4 flex justify-center">
              <svg className="w-16 h-16 text-ivory/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-ivory mb-2">
              No hay favoritos aún
            </h3>
            <p className="text-sm text-ivory/60">
              Guarda tus elementos favoritos aquí
            </p>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  )
}
