import { PaletteId } from './palettes'

/**
 * Obtiene las clases de Tailwind según el tema actual
 * Nota: Estas clases deben estar hardcodeadas para que Tailwind las detecte
 */
export function getThemeClasses(palette: PaletteId) {
  switch (palette) {
    case 'carbon':
      return {
        background: 'bg-carbon-900',
        surface: 'bg-carbon-800',
        surfaceSecondary: 'bg-carbon-700',
        text: 'text-carbon-50',
        textSecondary: 'text-carbon-300',
        accent: 'text-gold-500',
        accentBg: 'bg-gold-500',
        accent2: 'text-copper-500',
        accent2Bg: 'bg-copper-500',
        border: 'border-gold-500',
        borderSecondary: 'border-copper-500',
      }
    case 'nightChampagne':
      return {
        background: 'bg-night',
        surface: 'bg-night-700',
        surfaceSecondary: 'bg-night-800',
        text: 'text-beige',
        textSecondary: 'text-warmSand',
        accent: 'text-champagne',
        accentBg: 'bg-champagne',
        accent2: 'text-goldRose',
        accent2Bg: 'bg-goldRose',
        border: 'border-champagne',
        borderSecondary: 'border-goldRose',
      }
    case 'leatherOud':
      return {
        background: 'bg-coffeeBlack',
        surface: 'bg-leather',
        surfaceSecondary: 'bg-leather-900',
        text: 'text-ivory',
        textSecondary: 'text-warmSand',
        accent: 'text-darkGold',
        accentBg: 'bg-darkGold',
        accent2: 'text-warmSand',
        accent2Bg: 'bg-warmSand',
        border: 'border-darkGold',
        borderSecondary: 'border-warmSand',
      }
    case 'roseGoldElite':
      return {
        background: 'bg-carbon-800',
        surface: 'bg-carbon-700',
        surfaceSecondary: 'bg-carbon-600',
        text: 'text-vanillaCream',
        textSecondary: 'text-pinkChampagne',
        accent: 'text-roseGold',
        accentBg: 'bg-roseGold',
        accent2: 'text-softBronze',
        accent2Bg: 'bg-softBronze',
        border: 'border-roseGold',
        borderSecondary: 'border-softBronze',
      }
    case 'platinumEssence':
      return {
        background: 'bg-matteBlack',
        surface: 'bg-carbon-800',
        surfaceSecondary: 'bg-carbon-700',
        text: 'text-pearlGray',
        textSecondary: 'text-titanium',
        accent: 'text-platinum',
        accentBg: 'bg-platinum',
        accent2: 'text-petrolBlue',
        accent2Bg: 'bg-petrolBlue',
        border: 'border-platinum',
        borderSecondary: 'border-petrolBlue',
      }
    case 'goldRoyale':
      return {
        background: 'bg-deepBlack',
        surface: 'bg-smokeGray',
        surfaceSecondary: 'bg-carbon-800',
        text: 'text-pearlWhite',
        textSecondary: 'text-softGold',
        accent: 'text-metallicGold',
        accentBg: 'bg-metallicGold',
        accent2: 'text-softGold',
        accent2Bg: 'bg-softGold',
        border: 'border-metallicGold',
        borderSecondary: 'border-softGold',
      }
    case 'ivoryLuxury':
      return {
        background: 'bg-ivory',
        surface: 'bg-silkBeige',
        surfaceSecondary: 'bg-softChampagne',
        text: 'text-smokeGray',
        textSecondary: 'text-carbon-400',
        accent: 'text-lightGold',
        accentBg: 'bg-lightGold',
        accent2: 'text-softChampagne',
        accent2Bg: 'bg-softChampagne',
        border: 'border-lightGold',
        borderSecondary: 'border-softChampagne',
      }
    case 'champagneRose':
      return {
        background: 'bg-pureWhite',
        surface: 'bg-pinkChampagne',
        surfaceSecondary: 'bg-lightSand',
        text: 'text-smokeGray',
        textSecondary: 'text-carbon-400',
        accent: 'text-lightRoseGold',
        accentBg: 'bg-lightRoseGold',
        accent2: 'text-elegantNudeRose',
        accent2Bg: 'bg-elegantNudeRose',
        border: 'border-lightRoseGold',
        borderSecondary: 'border-elegantNudeRose',
      }
    case 'pearlMist':
      return {
        background: 'bg-pearlWhiteMist',
        surface: 'bg-mistGray',
        surfaceSecondary: 'bg-coldSand',
        text: 'text-smokeGray',
        textSecondary: 'text-carbon-400',
        accent: 'text-paleGold',
        accentBg: 'bg-paleGold',
        accent2: 'text-lightSilverGray',
        accent2Bg: 'bg-lightSilverGray',
        border: 'border-paleGold',
        borderSecondary: 'border-lightSilverGray',
      }
    case 'softGoldEssence':
      return {
        background: 'bg-creamWhite',
        surface: 'bg-naturalCream',
        surfaceSecondary: 'bg-lightBeigeSoft',
        text: 'text-smokeGray',
        textSecondary: 'text-carbon-400',
        accent: 'text-paleGoldSoft',
        accentBg: 'bg-paleGoldSoft',
        accent2: 'text-champagneGray',
        accent2Bg: 'bg-champagneGray',
        border: 'border-paleGoldSoft',
        borderSecondary: 'border-champagneGray',
      }
    case 'vanillaSilk':
      return {
        background: 'bg-vanillaSilk',
        surface: 'bg-goldenCream',
        surfaceSecondary: 'bg-goldenBeige',
        text: 'text-smokeGray',
        textSecondary: 'text-carbon-400',
        accent: 'text-satinLightGold',
        accentBg: 'bg-satinLightGold',
        accent2: 'text-goldenBeige',
        accent2Bg: 'bg-goldenBeige',
        border: 'border-satinLightGold',
        borderSecondary: 'border-goldenBeige',
      }
    default:
      return {
        background: 'bg-coffeeBlack',
        surface: 'bg-leather',
        surfaceSecondary: 'bg-leather-900',
        text: 'text-ivory',
        textSecondary: 'text-warmSand',
        accent: 'text-darkGold',
        accentBg: 'bg-darkGold',
        accent2: 'text-warmSand',
        accent2Bg: 'bg-warmSand',
        border: 'border-darkGold',
        borderSecondary: 'border-warmSand',
      }
  }
}

