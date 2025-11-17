'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface ColorPalette {
  id: string
  name: string
  description: string
  colors: {
    primary: string      // Color principal (antes #D4AF37)
    secondary: string    // Color secundario (antes #344A3D)
    background: string   // Fondo principal (antes #182B21)
    surface: string      // Superficie/cards (antes #344A3D)
    text: string         // Texto principal (antes #F8F5EF)
    textSecondary: string // Texto secundario (antes #999)
    accent: string       // Acento (antes #D4AF37)
    border: string       // Bordes
    header: string       // Header (antes #000000)
    footer: string       // Footer (antes #000000)
    headerText: string   // Texto del header (calculado automáticamente)
    footerText: string   // Texto del footer (calculado automáticamente)
  }
}

// Función para determinar si un color es oscuro
export function isDarkColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness < 128
}

// Función para obtener el color de texto apropiado para un fondo
function getContrastText(bgColor: string): string {
  // Si el color es muy claro (casi blanco), usar texto oscuro
  const r = parseInt(bgColor.slice(1, 3), 16)
  const g = parseInt(bgColor.slice(3, 5), 16)
  const b = parseInt(bgColor.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  
  // Si el brillo es mayor a 200 (muy claro), usar texto oscuro
  // Si es menor a 128 (oscuro), usar texto claro
  if (brightness > 200) {
    return '#1F1F1F' // Texto oscuro para fondos muy claros
  } else if (brightness < 128) {
    return '#F8F5EF' // Texto claro para fondos oscuros
  } else {
    // Para colores intermedios, usar el que tenga mejor contraste
    return brightness > 150 ? '#1F1F1F' : '#F8F5EF'
  }
}

// Función para obtener un color de icono con buen contraste sobre un fondo
export function getIconColor(surfaceColor: string, accentColor: string): string {
  const r = parseInt(surfaceColor.slice(1, 3), 16)
  const g = parseInt(surfaceColor.slice(3, 5), 16)
  const b = parseInt(surfaceColor.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  
  // Calcular brillo del accent
  const accentR = parseInt(accentColor.slice(1, 3), 16)
  const accentG = parseInt(accentColor.slice(3, 5), 16)
  const accentB = parseInt(accentColor.slice(5, 7), 16)
  const accentBrightness = (accentR * 299 + accentG * 587 + accentB * 114) / 1000
  const contrast = Math.abs(brightness - accentBrightness)
  
  // Si el fondo es muy claro (brillo > 170), siempre usar texto oscuro para garantizar contraste
  if (brightness > 170) {
    return '#1F1F1F'
  }
  // Si el fondo es muy oscuro (brillo < 100), usar texto claro
  else if (brightness < 100) {
    // Si el accent es claro y tiene buen contraste, usarlo
    if (accentBrightness > 150 && contrast > 60) {
      return accentColor
    }
    return '#F8F5EF'
  }
  // Fondo intermedio (100-170)
  else {
    // Si el contraste es muy bajo (menos de 50), surface y accent son muy similares
    // En este caso, usar un color con buen contraste basado en el brillo del surface
    if (contrast < 50) {
      return brightness > 140 ? '#1F1F1F' : '#F8F5EF'
    }
    // Si el accent tiene muy buen contraste (más de 100 puntos de diferencia), usarlo
    else if (contrast > 100) {
      return accentColor
    }
    // Si el contraste es moderado (50-100), verificar si el accent es más oscuro o más claro
    else {
      // Si el accent es más oscuro que el surface, usarlo (mejor contraste)
      if (accentBrightness < brightness - 20) {
        return accentColor
      }
      // Si el accent es más claro o similar, usar un color con mejor contraste
      return brightness > 140 ? '#1F1F1F' : '#F8F5EF'
    }
  }
}

// Función para obtener el color de texto apropiado para un botón basándose en su color de fondo
export function getButtonTextColor(buttonBgColor: string): string {
  const r = parseInt(buttonBgColor.slice(1, 3), 16)
  const g = parseInt(buttonBgColor.slice(3, 5), 16)
  const b = parseInt(buttonBgColor.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  
  // Si el fondo del botón es claro, usar texto oscuro
  if (brightness > 180) {
    return '#1F1F1F'
  } else if (brightness < 100) {
    return '#F8F5EF'
  } else {
    return brightness > 150 ? '#1F1F1F' : '#F8F5EF'
  }
}

// Convertir las paletas base agregando headerText y footerText calculados
export const colorPalettes: ColorPalette[] = [
  {
    id: 'arabiyat-original',
    name: 'Arabiyat Original',
    description: 'Configuración original (Praana)',
    colors: {
      primary: '#182B21',
      secondary: '#344A3D',
      background: '#182B21',
      surface: '#344A3D',
      text: '#F8F5EF',
      textSecondary: '#D4AF37',
      accent: '#D4AF37',
      border: '#344A3D',
      header: '#000000',
      footer: '#000000',
      headerText: getContrastText('#000000'),
      footerText: getContrastText('#000000'),
    }
  },
  {
    id: 'chocolate-deluxe',
    name: 'Chocolate Deluxe',
    description: 'Lujo cálido',
    colors: {
      primary: '#3B1F1B',
      secondary: '#A26A4E',
      background: '#F2E5D5',
      surface: '#C9A86A',
      text: '#3B1F1B',
      textSecondary: '#A26A4E',
      accent: '#C9A86A',
      border: '#A26A4E',
      header: '#3B1F1B',
      footer: '#3B1F1B',
      headerText: getContrastText('#3B1F1B'),
      footerText: getContrastText('#3B1F1B'),
    }
  },
  {
    id: 'champagne-royale',
    name: 'Champagne Royale',
    description: 'Lujo minimalista',
    colors: {
      primary: '#1F1F1F',
      secondary: '#CFC9C2',
      background: '#F7E7CE',
      surface: '#E5D1A4',
      text: '#1F1F1F',
      textSecondary: '#CFC9C2',
      accent: '#E5D1A4',
      border: '#CFC9C2',
      header: '#1F1F1F',
      footer: '#1F1F1F',
      headerText: getContrastText('#1F1F1F'),
      footerText: getContrastText('#1F1F1F'),
    }
  },
  {
    id: 'rosa-pasion',
    name: 'Rosa Pasión',
    description: 'Romántico y femenino',
    colors: {
      primary: '#661A31',
      secondary: '#D6456F',
      background: '#FCE9E9',
      surface: '#F2BBC9',
      text: '#661A31',
      textSecondary: '#D6456F',
      accent: '#D6456F',
      border: '#F2BBC9',
      header: '#661A31',
      footer: '#661A31',
      headerText: getContrastText('#661A31'),
      footerText: getContrastText('#661A31'),
    }
  },
  {
    id: 'noir-elegance',
    name: 'Noir Elegance',
    description: 'Ultra premium',
    colors: {
      primary: '#0A0A0A',
      secondary: '#2F2F2F',
      background: '#0A0A0A',
      surface: '#2F2F2F',
      text: '#F8F8F8',
      textSecondary: '#C5A567',
      accent: '#C5A567',
      border: '#2F2F2F',
      header: '#0A0A0A',
      footer: '#0A0A0A',
      headerText: getContrastText('#0A0A0A'),
      footerText: getContrastText('#0A0A0A'),
    }
  },
  {
    id: 'lavanda-imperial',
    name: 'Lavanda Imperial',
    description: 'Relajante y sofisticada',
    colors: {
      primary: '#4A2E6F',
      secondary: '#A79CC1',
      background: '#F3EFE9',
      surface: '#D8CAEF',
      text: '#4A2E6F',
      textSecondary: '#A79CC1',
      accent: '#A79CC1',
      border: '#D8CAEF',
      header: '#4A2E6F',
      footer: '#4A2E6F',
      headerText: getContrastText('#4A2E6F'),
      footerText: getContrastText('#4A2E6F'),
    }
  },
  {
    id: 'coco-vainilla',
    name: 'Coco & Vainilla',
    description: 'Dulce y cálida',
    colors: {
      primary: '#8A6653',
      secondary: '#CBA27A',
      background: '#FFF3E4',
      surface: '#D9C092',
      text: '#8A6653',
      textSecondary: '#CBA27A',
      accent: '#D9C092',
      border: '#CBA27A',
      header: '#8A6653',
      footer: '#8A6653',
      headerText: getContrastText('#8A6653'),
      footerText: getContrastText('#8A6653'),
    }
  },
  {
    id: 'ruby-seduction',
    name: 'Ruby Seduction',
    description: 'Pasional y atrevida',
    colors: {
      primary: '#54111B',
      secondary: '#A3082F',
      background: '#F6D3D9',
      surface: '#D5A6A6',
      text: '#54111B',
      textSecondary: '#A3082F',
      accent: '#A3082F',
      border: '#D5A6A6',
      header: '#54111B',
      footer: '#54111B',
      headerText: getContrastText('#54111B'),
      footerText: getContrastText('#54111B'),
    }
  },
  {
    id: 'crystal-fresh',
    name: 'Crystal Fresh',
    description: 'Limpio y moderno',
    colors: {
      primary: '#92C7E8',
      secondary: '#DCEFF7',
      background: '#FFFFFF',
      surface: '#C7D1D9',
      text: '#1F1F1F',
      textSecondary: '#92C7E8',
      accent: '#92C7E8',
      border: '#C7D1D9',
      header: '#92C7E8',
      footer: '#92C7E8',
      headerText: getContrastText('#92C7E8'),
      footerText: getContrastText('#92C7E8'),
    }
  },
  {
    id: 'champagne-rose',
    name: 'Champagne Rosé',
    description: 'Lujo rosado',
    colors: {
      primary: '#6A6A6A',
      secondary: '#E7BFAF',
      background: '#F4E7DA',
      surface: '#EECBCF',
      text: '#6A6A6A',
      textSecondary: '#E7BFAF',
      accent: '#E7BFAF',
      border: '#EECBCF',
      header: '#6A6A6A',
      footer: '#6A6A6A',
      headerText: getContrastText('#6A6A6A'),
      footerText: getContrastText('#6A6A6A'),
    }
  },
  {
    id: 'black-oud',
    name: 'Black Oud',
    description: 'Misterioso y masculino',
    colors: {
      primary: '#161616',
      secondary: '#555555',
      background: '#161616',
      surface: '#7A5633',
      text: '#ECE3D3',
      textSecondary: '#7A5633',
      accent: '#7A5633',
      border: '#555555',
      header: '#161616',
      footer: '#161616',
      headerText: getContrastText('#161616'),
      footerText: getContrastText('#161616'),
    }
  },
  {
    id: 'pastel-cream',
    name: '🧁 Pastel Cream',
    description: 'Suave, limpio, minimal pastel',
    colors: {
      primary: '#FFE0CC',
      secondary: '#FFD7E2',
      background: '#FFF7E8',
      surface: '#D7ECFF',
      text: '#1F1F1F',
      textSecondary: '#FFE0CC',
      accent: '#DFF8EE',
      border: '#FFD7E2',
      header: '#FFE0CC',
      footer: '#FFE0CC',
      headerText: getContrastText('#FFE0CC'),
      footerText: getContrastText('#FFE0CC'),
    }
  },
  {
    id: 'gelato-mix',
    name: '🍨 Gelato Mix',
    description: 'Pasteles fríos tipo heladería',
    colors: {
      primary: '#CDEFDA',
      secondary: '#D9D4F7',
      background: '#FFFDF8',
      surface: '#CDE8F4',
      text: '#1F1F1F',
      textSecondary: '#D9D4F7',
      accent: '#F7CADA',
      border: '#CDE8F4',
      header: '#CDE8F4',
      footer: '#CDE8F4',
      headerText: getContrastText('#CDE8F4'),
      footerText: getContrastText('#CDE8F4'),
    }
  },
  {
    id: 'strawberry-milk',
    name: '🍓 Strawberry Milk',
    description: 'Dulce y femenino',
    colors: {
      primary: '#FCDCEB',
      secondary: '#F7AFC9',
      background: '#FFF0F6',
      surface: '#E8D8F3',
      text: '#1F1F1F',
      textSecondary: '#F7AFC9',
      accent: '#FFD8C2',
      border: '#E8D8F3',
      header: '#FCDCEB',
      footer: '#FCDCEB',
      headerText: getContrastText('#FCDCEB'),
      footerText: getContrastText('#FCDCEB'),
    }
  },
  {
    id: 'candy-shop',
    name: '🍬 Candy Shop',
    description: 'Pastel vibrante suave',
    colors: {
      primary: '#CFF8E3',
      secondary: '#C4E3FF',
      background: '#FFFFFF',
      surface: '#E7DAFF',
      text: '#1F1F1F',
      textSecondary: '#C4E3FF',
      accent: '#FFC9D6',
      border: '#FFF4B8',
      header: '#E7DAFF',
      footer: '#E7DAFF',
      headerText: getContrastText('#E7DAFF'),
      footerText: getContrastText('#E7DAFF'),
    }
  },
  {
    id: 'peach-dream',
    name: '🍑 Peach Dream',
    description: 'Pastel cálido elegante',
    colors: {
      primary: '#FFD8B5',
      secondary: '#FFC4C4',
      background: '#FFF2E4',
      surface: '#F7DFDF',
      text: '#1F1F1F',
      textSecondary: '#FFC4C4',
      accent: '#D3B7A3',
      border: '#F7DFDF',
      header: '#FFD8B5',
      footer: '#FFD8B5',
      headerText: getContrastText('#FFD8B5'),
      footerText: getContrastText('#FFD8B5'),
    }
  },
  {
    id: 'cotton-candy-sky',
    name: '✨ Cotton Candy Sky',
    description: 'Pasteles muy suaves estilo nubes',
    colors: {
      primary: '#D7EBFF',
      secondary: '#FFE4F2',
      background: '#FFFFFF',
      surface: '#E6DDF8',
      text: '#1F1F1F',
      textSecondary: '#FFE4F2',
      accent: '#FFF2C7',
      border: '#E6DDF8',
      header: '#E6DDF8',
      footer: '#E6DDF8',
      headerText: getContrastText('#E6DDF8'),
      footerText: getContrastText('#E6DDF8'),
    }
  },
  {
    id: 'sakura-bakery',
    name: '🌸 Sakura Bakery',
    description: 'Pasteles japoneses',
    colors: {
      primary: '#FADDE1',
      secondary: '#F6F4D2',
      background: '#FFF8F4',
      surface: '#D7CBEF',
      text: '#1F1F1F',
      textSecondary: '#D7CBEF',
      accent: '#D9F2D9',
      border: '#F6F4D2',
      header: '#FADDE1',
      footer: '#FADDE1',
      headerText: getContrastText('#FADDE1'),
      footerText: getContrastText('#FADDE1'),
    }
  },
  {
    id: 'milk-tea-pastel',
    name: '🧋 Milk Tea Pastel',
    description: 'Dulce, moderno, tipo boba tea',
    colors: {
      primary: '#F3E3D3',
      secondary: '#E8C9A9',
      background: '#FFFDF8',
      surface: '#F5D7D1',
      text: '#1F1F1F',
      textSecondary: '#DED9D4',
      accent: '#C5B9A6',
      border: '#F5D7D1',
      header: '#F3E3D3',
      footer: '#F3E3D3',
      headerText: getContrastText('#F3E3D3'),
      footerText: getContrastText('#F3E3D3'),
    }
  },
  {
    id: 'macaron-box',
    name: '🍧 Macaron Box',
    description: 'Inspirado en macarons franceses',
    colors: {
      primary: '#CDE1C6',
      secondary: '#D8C6E1',
      background: '#FFFFFF',
      surface: '#F6C4CE',
      text: '#1F1F1F',
      textSecondary: '#D8C6E1',
      accent: '#FFF5C2',
      border: '#C8E8F5',
      header: '#F6C4CE',
      footer: '#F6C4CE',
      headerText: getContrastText('#F6C4CE'),
      footerText: getContrastText('#F6C4CE'),
    }
  },
  {
    id: 'baby-boutique',
    name: '🎀 Baby Boutique',
    description: 'Ultra pastel, adorable',
    colors: {
      primary: '#FFE8F2',
      secondary: '#DDEFFF',
      background: '#FFFFFF',
      surface: '#FFF8D7',
      text: '#1F1F1F',
      textSecondary: '#DDEFFF',
      accent: '#E6FAF0',
      border: '#EDE5FF',
      header: '#FFF8D7',
      footer: '#FFF8D7',
      headerText: getContrastText('#FFF8D7'),
      footerText: getContrastText('#FFF8D7'),
    }
  },
]

interface ThemeContextType {
  currentTheme: ColorPalette
  setTheme: (themeId: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentThemeId, setCurrentThemeId] = useState<string>('noir-elegance')

  useEffect(() => {
    // Cargar tema guardado
    const saved = localStorage.getItem('theme')
    if (saved && colorPalettes.find(p => p.id === saved)) {
      setCurrentThemeId(saved)
    }
  }, [])

  function setTheme(themeId: string) {
    setCurrentThemeId(themeId)
    localStorage.setItem('theme', themeId)
  }

  const currentTheme = colorPalettes.find(p => p.id === currentThemeId) || colorPalettes[3] // Default: Noir Elegance

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
