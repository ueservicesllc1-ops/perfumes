'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { PaletteId, palettes } from '@/lib/themes/palettes'

export default function ThemeSwitcher() {
  const { currentPalette, setPalette, availablePalettes } = useTheme()

  const handlePaletteChange = (paletteId: PaletteId) => {
    setPalette(paletteId)
  }

  const getButtonClasses = (paletteId: PaletteId, isActive: boolean) => {
    const base = 'w-full p-4 rounded-xl border-2 transition-all duration-200 text-left'
    
    if (isActive) {
      switch (paletteId) {
        case 'carbon':
          return `${base} bg-gold-500/10 border-gold-500 shadow-lg`
        case 'nightChampagne':
          return `${base} bg-champagne/10 border-champagne shadow-lg`
        case 'leatherOud':
          return `${base} bg-darkGold/10 border-darkGold shadow-lg`
        case 'roseGoldElite':
          return `${base} bg-roseGold/10 border-roseGold shadow-lg`
        case 'platinumEssence':
          return `${base} bg-platinum/10 border-platinum shadow-lg`
        case 'goldRoyale':
          return `${base} bg-metallicGold/10 border-metallicGold shadow-lg`
        case 'ivoryLuxury':
          return `${base} bg-lightGold/10 border-lightGold shadow-lg`
        case 'champagneRose':
          return `${base} bg-lightRoseGold/10 border-lightRoseGold shadow-lg`
        case 'pearlMist':
          return `${base} bg-paleGold/10 border-paleGold shadow-lg`
        case 'softGoldEssence':
          return `${base} bg-paleGoldSoft/10 border-paleGoldSoft shadow-lg`
        case 'vanillaSilk':
          return `${base} bg-satinLightGold/10 border-satinLightGold shadow-lg`
        default:
          return `${base} bg-darkGold/10 border-darkGold shadow-lg`
      }
    } else {
      switch (paletteId) {
        case 'carbon':
          return `${base} bg-carbon-600 border-gold-500/20 hover:border-gold-500/40`
        case 'nightChampagne':
          return `${base} bg-night-700 border-champagne/20 hover:border-champagne/40`
        case 'leatherOud':
          return `${base} bg-leather border-darkGold/20 hover:border-darkGold/40`
        case 'roseGoldElite':
          return `${base} bg-carbon-700 border-roseGold/20 hover:border-roseGold/40`
        case 'platinumEssence':
          return `${base} bg-matteBlack border-platinum/20 hover:border-platinum/40`
        case 'goldRoyale':
          return `${base} bg-deepBlack border-metallicGold/20 hover:border-metallicGold/40`
        case 'ivoryLuxury':
          return `${base} bg-silkBeige border-lightGold/20 hover:border-lightGold/40`
        case 'champagneRose':
          return `${base} bg-pinkChampagne border-lightRoseGold/20 hover:border-lightRoseGold/40`
        case 'pearlMist':
          return `${base} bg-mistGray border-paleGold/20 hover:border-paleGold/40`
        case 'softGoldEssence':
          return `${base} bg-naturalCream border-paleGoldSoft/20 hover:border-paleGoldSoft/40`
        case 'vanillaSilk':
          return `${base} bg-goldenCream border-satinLightGold/20 hover:border-satinLightGold/40`
        default:
          return `${base} bg-leather border-darkGold/20 hover:border-darkGold/40`
      }
    }
  }

  const getTextClasses = (paletteId: PaletteId) => {
    switch (paletteId) {
      case 'carbon':
        return 'text-carbon-50'
      case 'nightChampagne':
        return 'text-beige'
      case 'leatherOud':
        return 'text-ivory'
      case 'roseGoldElite':
        return 'text-vanillaCream'
      case 'platinumEssence':
        return 'text-pearlGray'
      case 'goldRoyale':
        return 'text-pearlWhite'
      case 'ivoryLuxury':
        return 'text-smokeGray'
      case 'champagneRose':
        return 'text-smokeGray'
      case 'pearlMist':
        return 'text-smokeGray'
      case 'softGoldEssence':
        return 'text-smokeGray'
      case 'vanillaSilk':
        return 'text-smokeGray'
      default:
        return 'text-ivory'
    }
  }

  const getTextSecondaryClasses = (paletteId: PaletteId) => {
    switch (paletteId) {
      case 'carbon':
        return 'text-carbon-300'
      case 'nightChampagne':
        return 'text-warmSand'
      case 'leatherOud':
        return 'text-warmSand'
      case 'roseGoldElite':
        return 'text-pinkChampagne'
      case 'platinumEssence':
        return 'text-titanium'
      case 'goldRoyale':
        return 'text-softGold'
      case 'ivoryLuxury':
        return 'text-carbon-400'
      case 'champagneRose':
        return 'text-carbon-400'
      case 'pearlMist':
        return 'text-carbon-400'
      case 'softGoldEssence':
        return 'text-carbon-400'
      case 'vanillaSilk':
        return 'text-carbon-400'
      default:
        return 'text-warmSand'
    }
  }

  const getBadgeClasses = (paletteId: PaletteId) => {
    switch (paletteId) {
      case 'carbon':
        return 'bg-gold-500 text-carbon-900'
      case 'nightChampagne':
        return 'bg-champagne text-night'
      case 'leatherOud':
        return 'bg-darkGold text-coffeeBlack'
      case 'roseGoldElite':
        return 'bg-roseGold text-carbon-800'
      case 'platinumEssence':
        return 'bg-platinum text-matteBlack'
      case 'goldRoyale':
        return 'bg-metallicGold text-deepBlack'
      case 'ivoryLuxury':
        return 'bg-lightGold text-ivory'
      case 'champagneRose':
        return 'bg-lightRoseGold text-pureWhite'
      case 'pearlMist':
        return 'bg-paleGold text-pearlWhiteMist'
      case 'softGoldEssence':
        return 'bg-paleGoldSoft text-creamWhite'
      case 'vanillaSilk':
        return 'bg-satinLightGold text-vanillaSilk'
      default:
        return 'bg-darkGold text-coffeeBlack'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-ivory">Tema de Color</h3>
        <span className="text-sm text-warmSand opacity-70">
          {availablePalettes[currentPalette].name}
        </span>
      </div>
      
      <div className="space-y-3">
        {(Object.keys(palettes) as PaletteId[]).map((paletteId) => {
          const palette = palettes[paletteId]
          const isActive = currentPalette === paletteId
          
          return (
            <button
              key={paletteId}
              onClick={() => handlePaletteChange(paletteId)}
              className={getButtonClasses(paletteId, isActive)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className={`font-semibold ${getTextClasses(paletteId)}`}>
                      {palette.name}
                    </h4>
                    {isActive && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getBadgeClasses(paletteId)}`}>
                        Activo
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${getTextSecondaryClasses(paletteId)}`}>
                    {palette.description}
                  </p>
                </div>
                
                {/* Preview de colores */}
                <div className="flex items-center space-x-1 ml-4">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white/20"
                    style={{ backgroundColor: palette.colors.background }}
                    title="Fondo"
                  />
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white/20"
                    style={{ backgroundColor: palette.colors.accent }}
                    title="Acento"
                  />
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white/20"
                    style={{ backgroundColor: palette.colors.accent2 }}
                    title="Acento 2"
                  />
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

