'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { PaletteId, palettes, defaultPalette } from '@/lib/themes/palettes'

interface ThemeContextType {
  currentPalette: PaletteId
  setPalette: (palette: PaletteId) => void
  palette: typeof palettes[PaletteId]
  availablePalettes: typeof palettes
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = 'arabiyat-theme-palette'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentPalette, setCurrentPalette] = useState<PaletteId>(defaultPalette)
  const [mounted, setMounted] = useState(false)

  // Cargar tema guardado al montar
  useEffect(() => {
    // Forzar la nueva paleta por defecto - limpiar localStorage si existe una paleta antigua
    const saved = localStorage.getItem(STORAGE_KEY) as PaletteId | null
    if (saved && saved in palettes && saved !== 'modernElegance') {
      // Si hay una paleta guardada que no es la nueva, la mantenemos
      setCurrentPalette(saved)
    } else {
      // Si no hay paleta guardada o es la nueva, usar la nueva por defecto
      setCurrentPalette('modernElegance')
      localStorage.setItem(STORAGE_KEY, 'modernElegance')
    }
    setMounted(true)
  }, [])

  // Guardar tema cuando cambia
  const setPalette = (palette: PaletteId) => {
    setCurrentPalette(palette)
    localStorage.setItem(STORAGE_KEY, palette)
    
    // Aplicar atributo data-theme al HTML para que CSS cambie
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', palette)
    }
  }

  // Aplicar tema al HTML cuando cambia o al montar
  useEffect(() => {
    if (mounted && typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', currentPalette)
    }
  }, [currentPalette, mounted])

  // Aplicar tema inicial al HTML - forzar modernElegance
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Forzar la aplicación de la nueva paleta
      document.documentElement.setAttribute('data-theme', 'modernElegance')
      // También aplicar directamente los estilos
      document.documentElement.style.setProperty('--theme-bg', '#0A0E1A')
      document.documentElement.style.setProperty('--theme-surface', '#1A1F2E')
      document.documentElement.style.setProperty('--theme-surface-secondary', '#141920')
      document.documentElement.style.setProperty('--theme-text', '#FFFFFF')
      document.documentElement.style.setProperty('--theme-text-secondary', '#B0B8C8')
      document.documentElement.style.setProperty('--theme-accent', '#FF6B9D')
      document.documentElement.style.setProperty('--theme-accent-2', '#00D4FF')
      document.documentElement.style.setProperty('--theme-border', 'rgba(255, 107, 157, 0.3)')
      document.documentElement.style.setProperty('--theme-gradient-start', '#1A1F2E')
      document.documentElement.style.setProperty('--theme-gradient-end', '#0A0E1A')
      document.documentElement.style.setProperty('--theme-glow', 'rgba(255, 107, 157, 0.2)')
    }
  }, [])

  const value: ThemeContextType = {
    currentPalette,
    setPalette,
    palette: palettes[currentPalette],
    availablePalettes: palettes,
  }

  // Siempre devolver el Provider, incluso antes de montar
  // Esto evita errores cuando los componentes usan useTheme
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

