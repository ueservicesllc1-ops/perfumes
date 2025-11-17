export type PaletteId = 'modernElegance' | 'carbon' | 'nightChampagne' | 'leatherOud' | 'roseGoldElite' | 'platinumEssence' | 'goldRoyale' | 'ivoryLuxury' | 'champagneRose' | 'pearlMist' | 'softGoldEssence' | 'vanillaSilk'

export interface ColorPalette {
  id: PaletteId
  name: string
  description: string
  colors: {
    primary: string      // Color principal (fondos oscuros)
    secondary: string    // Color secundario (fondos medios)
    accent: string       // Color de acento principal
    accent2: string      // Color de acento secundario
    text: string         // Color de texto principal
    textSecondary: string // Color de texto secundario
    background: string   // Color de fondo
    surface: string     // Color de superficie (tarjetas)
  }
  tailwind: {
    primary: string      // Clase Tailwind para primary
    secondary: string    // Clase Tailwind para secondary
    accent: string       // Clase Tailwind para accent
    accent2: string      // Clase Tailwind para accent2
    text: string         // Clase Tailwind para text
    textSecondary: string // Clase Tailwind para textSecondary
    background: string   // Clase Tailwind para background
    surface: string      // Clase Tailwind para surface
  }
}

export const palettes: Record<PaletteId, ColorPalette> = {
  modernElegance: {
    id: 'modernElegance',
    name: '✨ Modern Elegance',
    description: 'Diseño ultra moderno y elegante - NUEVO',
    colors: {
      primary: '#0A0E1A',      // Azul noche profundo
      secondary: '#1A1F2E',    // Azul gris oscuro
      accent: '#FF6B9D',       // Rosa elegante moderno
      accent2: '#00D4FF',     // Cian brillante
      text: '#FFFFFF',        // Blanco puro
      textSecondary: '#B0B8C8', // Gris azulado suave
      background: '#0A0E1A',   // Azul noche profundo
      surface: '#1A1F2E',     // Azul gris oscuro
    },
    tailwind: {
      primary: 'carbon-900',
      secondary: 'carbon-800',
      accent: 'roseGold',
      accent2: 'platinum',
      text: 'pearlWhite',
      textSecondary: 'titanium',
      background: 'carbon-900',
      surface: 'carbon-800',
    },
  },
  carbon: {
    id: 'carbon',
    name: 'Carbon & Gold',
    description: 'Negro carbón, oro y cobre',
    colors: {
      primary: '#1a1a1a',      // carbon-800
      secondary: '#2d2d2d',   // carbon-700
      accent: '#d4af37',       // gold-500
      accent2: '#b87333',      // copper-500
      text: '#f5f5f5',         // carbon-50
      textSecondary: '#9e9e9e', // carbon-300
      background: '#0a0a0a',   // carbon-900
      surface: '#424242',     // carbon-600
    },
    tailwind: {
      primary: 'carbon-800',
      secondary: 'carbon-700',
      accent: 'gold-500',
      accent2: 'copper-500',
      text: 'carbon-50',
      textSecondary: 'carbon-300',
      background: 'carbon-900',
      surface: 'carbon-600',
    },
  },
  nightChampagne: {
    id: 'nightChampagne',
    name: 'Noche Champagne',
    description: 'Lujo moderno, sofisticación minimalista',
    colors: {
      primary: '#0A0F1F',      // night-600
      secondary: '#080C18',    // night-700
      accent: '#E7D2B8',       // champagne
      accent2: '#C9A574',      // goldRose
      text: '#F4ECE2',         // beige
      textSecondary: '#C6A67F', // warmSand (similar)
      background: '#0A0F1F',   // night
      surface: '#080C18',      // night-700
    },
    tailwind: {
      primary: 'night',
      secondary: 'night-700',
      accent: 'champagne',
      accent2: 'goldRose',
      text: 'beige',
      textSecondary: 'warmSand',
      background: 'night',
      surface: 'night-700',
    },
  },
  leatherOud: {
    id: 'leatherOud',
    name: 'Leather & Oud',
    description: 'Unisex elegante, aroma caro',
    colors: {
      primary: '#241F1C',      // coffeeBlack
      secondary: '#3B2F2F',    // leather
      accent: '#A87C2A',       // darkGold
      accent2: '#C6A67F',      // warmSand
      text: '#F8F5EF',         // ivory
      textSecondary: '#C6A67F', // warmSand
      background: '#241F1C',   // coffeeBlack
      surface: '#3B2F2F',      // leather
    },
    tailwind: {
      primary: 'coffeeBlack',
      secondary: 'leather',
      accent: 'darkGold',
      accent2: 'warmSand',
      text: 'ivory',
      textSecondary: 'warmSand',
      background: 'coffeeBlack',
      surface: 'leather',
    },
  },
  roseGoldElite: {
    id: 'roseGoldElite',
    name: 'Rose Gold Elite',
    description: 'Elegante, delicada, extremadamente premium',
    colors: {
      primary: '#1A1A1A',      // carbon black
      secondary: '#2D2D2D',    // carbon-700
      accent: '#B76E79',        // roseGold
      accent2: '#A67856',      // softBronze
      text: '#FFF7F0',         // vanillaCream
      textSecondary: '#E8C7C8', // pinkChampagne
      background: '#1A1A1A',   // carbon black
      surface: '#2D2D2D',      // carbon-700
    },
    tailwind: {
      primary: 'carbon-800',
      secondary: 'carbon-700',
      accent: 'roseGold',
      accent2: 'softBronze',
      text: 'vanillaCream',
      textSecondary: 'pinkChampagne',
      background: 'carbon-800',
      surface: 'carbon-700',
    },
  },
  platinumEssence: {
    id: 'platinumEssence',
    name: 'Platinum Essence',
    description: 'Lujo minimalista, súper moderno y limpio',
    colors: {
      primary: '#111111',      // matteBlack
      secondary: '#1A1A1A',    // darker black
      accent: '#D9D9D9',        // platinum
      accent2: '#12313F',      // petrolBlue
      text: '#ECECEC',         // pearlGray
      textSecondary: '#A1A1A1', // titanium
      background: '#111111',   // matteBlack
      surface: '#1A1A1A',      // darker black
    },
    tailwind: {
      primary: 'matteBlack',
      secondary: 'carbon-800',
      accent: 'platinum',
      accent2: 'petrolBlue',
      text: 'pearlGray',
      textSecondary: 'titanium',
      background: 'matteBlack',
      surface: 'carbon-800',
    },
  },
  goldRoyale: {
    id: 'goldRoyale',
    name: 'Gold Royale',
    description: 'Lujo clásico, alta exclusividad',
    colors: {
      primary: '#0D0D0D',      // deepBlack
      secondary: '#2B2B2B',    // smokeGray
      accent: '#D4AF37',        // metallicGold
      accent2: '#E4C580',      // softGold
      text: '#F5F5F5',         // pearlWhite
      textSecondary: '#E4C580', // softGold
      background: '#0D0D0D',   // deepBlack
      surface: '#2B2B2B',      // smokeGray
    },
    tailwind: {
      primary: 'deepBlack',
      secondary: 'smokeGray',
      accent: 'metallicGold',
      accent2: 'softGold',
      text: 'pearlWhite',
      textSecondary: 'softGold',
      background: 'deepBlack',
      surface: 'smokeGray',
    },
  },
  ivoryLuxury: {
    id: 'ivoryLuxury',
    name: 'Ivory Luxury',
    description: 'Lujo limpio, delicado y premium',
    colors: {
      primary: '#F8F5EF',      // ivory
      secondary: '#F3EDE4',    // silkBeige
      accent: '#D7B774',        // lightGold
      accent2: '#E9DCC9',      // softChampagne
      text: '#2B2B2B',         // darkGray (para contraste)
      textSecondary: '#6B6B6B', // mediumGray
      background: '#F8F5EF',   // ivory
      surface: '#F3EDE4',      // silkBeige
    },
    tailwind: {
      primary: 'ivory',
      secondary: 'silkBeige',
      accent: 'lightGold',
      accent2: 'softChampagne',
      text: 'smokeGray',
      textSecondary: 'carbon-400',
      background: 'ivory',
      surface: 'silkBeige',
    },
  },
  champagneRose: {
    id: 'champagneRose',
    name: 'Champagne Rose',
    description: 'Lujo moderno y femenino',
    colors: {
      primary: '#FFFFFF',      // pureWhite
      secondary: '#EFE8DF',    // lightSand
      accent: '#E2B8A4',        // lightRoseGold
      accent2: '#EED7D0',      // elegantNudeRose
      text: '#2B2B2B',         // darkGray (para contraste)
      textSecondary: '#6B6B6B', // mediumGray
      background: '#FFFFFF',   // pureWhite
      surface: '#F4E9E4',      // pinkChampagne
    },
    tailwind: {
      primary: 'pureWhite',
      secondary: 'lightSand',
      accent: 'lightRoseGold',
      accent2: 'elegantNudeRose',
      text: 'smokeGray',
      textSecondary: 'carbon-400',
      background: 'pureWhite',
      surface: 'pinkChampagne',
    },
  },
  pearlMist: {
    id: 'pearlMist',
    name: 'Pearl Mist',
    description: 'Minimalista, premium y muy limpio',
    colors: {
      primary: '#FAF9F7',      // pearlWhite
      secondary: '#E8E3DC',    // coldSand
      accent: '#E7D8A9',        // paleGold
      accent2: '#D3D3D3',      // lightSilverGray
      text: '#2B2B2B',         // darkGray (para contraste)
      textSecondary: '#6B6B6B', // mediumGray
      background: '#FAF9F7',   // pearlWhite
      surface: '#E6E6E6',      // mistGray
    },
    tailwind: {
      primary: 'pearlWhiteMist',
      secondary: 'coldSand',
      accent: 'paleGold',
      accent2: 'lightSilverGray',
      text: 'smokeGray',
      textSecondary: 'carbon-400',
      background: 'pearlWhiteMist',
      surface: 'mistGray',
    },
  },
  softGoldEssence: {
    id: 'softGoldEssence',
    name: 'Soft Gold Essence',
    description: 'Lujo discreto, elegante y muy suave',
    colors: {
      primary: '#FBF8F2',      // creamWhite
      secondary: '#EFE7DA',    // lightBeige
      accent: '#E5CC8F',        // paleGoldSoft
      accent2: '#DCD2C2',      // champagneGray
      text: '#2B2B2B',         // darkGray (para contraste)
      textSecondary: '#6B6B6B', // mediumGray
      background: '#FBF8F2',   // creamWhite
      surface: '#F4EBDD',      // naturalCream
    },
    tailwind: {
      primary: 'creamWhite',
      secondary: 'lightBeigeSoft',
      accent: 'paleGoldSoft',
      accent2: 'champagneGray',
      text: 'smokeGray',
      textSecondary: 'carbon-400',
      background: 'creamWhite',
      surface: 'naturalCream',
    },
  },
  vanillaSilk: {
    id: 'vanillaSilk',
    name: 'Vanilla Silk',
    description: 'Cálido, elegante, perfecto para perfumes premium',
    colors: {
      primary: '#FFFFFF',      // softWhite
      secondary: '#F5E7CF',    // goldenCream
      accent: '#D9BE85',        // satinLightGold
      accent2: '#E8D7BA',      // goldenBeige
      text: '#2B2B2B',         // darkGray (para contraste)
      textSecondary: '#6B6B6B', // mediumGray
      background: '#FFF6E9',   // vanillaSilk
      surface: '#F5E7CF',      // goldenCream
    },
    tailwind: {
      primary: 'softWhite',
      secondary: 'goldenCream',
      accent: 'satinLightGold',
      accent2: 'goldenBeige',
      text: 'smokeGray',
      textSecondary: 'carbon-400',
      background: 'vanillaSilk',
      surface: 'goldenCream',
    },
  },
}

export const defaultPalette: PaletteId = 'modernElegance'

