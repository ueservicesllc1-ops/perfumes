'use client'

import { useTheme, colorPalettes, getButtonTextColor, type ColorPalette } from '@/contexts/ThemeContext'

export default function ThemeSwitcher() {
  const { currentTheme, setTheme } = useTheme()

  const handlePaletteChange = (paletteId: string) => {
    setTheme(paletteId)
  }


  return (
    <div className="space-y-4" style={{ color: currentTheme.colors.text }}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold" style={{ color: currentTheme.colors.text }}>
          Tema de Color
        </h3>
        <span className="text-sm opacity-70" style={{ color: currentTheme.colors.textSecondary }}>
          {currentTheme.name}
        </span>
      </div>
      
      <div className="space-y-3">
        {colorPalettes.map((palette) => {
          const isActive = currentTheme.id === palette.id
          
          return (
            <button
              key={palette.id}
              onClick={() => handlePaletteChange(palette.id)}
              className="w-full p-4 rounded-xl border-2 transition-all duration-200 text-left"
              style={{
                backgroundColor: isActive 
                  ? `${palette.colors.accent}1A` 
                  : palette.colors.surface,
                borderColor: isActive 
                  ? palette.colors.accent 
                  : `${palette.colors.border}33`,
                boxShadow: isActive ? `0 4px 12px ${palette.colors.accent}40` : 'none'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold" style={{ color: palette.colors.text }}>
                      {palette.name}
                    </h4>
                    {isActive && (
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: palette.colors.accent,
                          color: getButtonTextColor(palette.colors.accent)
                        }}
                      >
                        Activo
                      </span>
                    )}
                  </div>
                  <p className="text-sm" style={{ color: palette.colors.textSecondary }}>
                    {palette.description}
                  </p>
                </div>
                
                {/* Preview de colores */}
                <div className="flex items-center space-x-1 ml-4">
                  <div
                    className="w-8 h-8 rounded-full border-2"
                    style={{ 
                      backgroundColor: palette.colors.background,
                      borderColor: `${palette.colors.border}33`
                    }}
                    title="Fondo"
                  />
                  <div
                    className="w-8 h-8 rounded-full border-2"
                    style={{ 
                      backgroundColor: palette.colors.accent,
                      borderColor: `${palette.colors.border}33`
                    }}
                    title="Acento"
                  />
                  <div
                    className="w-8 h-8 rounded-full border-2"
                    style={{ 
                      backgroundColor: palette.colors.surface,
                      borderColor: `${palette.colors.border}33`
                    }}
                    title="Superficie"
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

