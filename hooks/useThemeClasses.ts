import { useTheme } from '@/contexts/ThemeContext'
import { getThemeClasses } from '@/lib/themes/themeUtils'

/**
 * Hook helper para obtener clases de Tailwind según el tema actual
 * Nota: Tailwind necesita ver las clases completas en el código,
 * por lo que este hook devuelve las clases completas según el tema
 */
export function useThemeClasses() {
  const { currentPalette } = useTheme()
  return getThemeClasses(currentPalette)
}

