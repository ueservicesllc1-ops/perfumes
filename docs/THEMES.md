# Sistema de Temas y Paletas

Este proyecto incluye un sistema completo de gestión de temas que permite cambiar entre diferentes paletas de colores.

## Paletas Disponibles

### 1. Carbon & Gold (`carbon`)
- **Descripción**: Negro carbón, oro y cobre
- **Colores principales**: Carbon (negro), Gold (oro), Copper (cobre)

### 2. Noche Champagne (`nightChampagne`)
- **Descripción**: Lujo moderno, sofisticación minimalista
- **Colores principales**: Night (azul noche), Champagne, Beige, GoldRose

### 3. Leather & Oud (`leatherOud`)
- **Descripción**: Unisex elegante, aroma caro
- **Colores principales**: CoffeeBlack, Leather, DarkGold, WarmSand, Ivory

## Uso del Sistema de Temas

### Cambiar Tema

1. Navega a la página de **Configuración** (`/configuracion`)
2. En la sección "Tema de Color", selecciona la paleta deseada
3. El tema se guardará automáticamente en `localStorage`
4. La preferencia se mantendrá entre sesiones

### Usar el Tema en Componentes

```tsx
import { useTheme } from '@/contexts/ThemeContext'
import { useThemeClasses } from '@/hooks/useThemeClasses'

function MyComponent() {
  const { currentPalette, palette } = useTheme()
  const classes = useThemeClasses()
  
  return (
    <div className={classes.background}>
      <h1 className={classes.text}>Título</h1>
      <button className={classes.accentBg}>Botón</button>
    </div>
  )
}
```

### Acceder a Colores Específicos

```tsx
import { useTheme } from '@/contexts/ThemeContext'

function MyComponent() {
  const { palette } = useTheme()
  
  // Acceder a colores hexadecimales
  const primaryColor = palette.colors.primary
  const accentColor = palette.colors.accent
  
  // Acceder a clases Tailwind
  const primaryClass = palette.tailwind.primary
  const accentClass = palette.tailwind.accent
}
```

## Agregar una Nueva Paleta

1. Edita `lib/themes/palettes.ts`
2. Agrega una nueva entrada en el objeto `palettes`:

```typescript
export const palettes: Record<PaletteId, ColorPalette> = {
  // ... paletas existentes
  nuevaPaleta: {
    id: 'nuevaPaleta',
    name: 'Nombre de la Paleta',
    description: 'Descripción de la paleta',
    colors: {
      primary: '#HEX_COLOR',
      secondary: '#HEX_COLOR',
      accent: '#HEX_COLOR',
      accent2: '#HEX_COLOR',
      text: '#HEX_COLOR',
      textSecondary: '#HEX_COLOR',
      background: '#HEX_COLOR',
      surface: '#HEX_COLOR',
    },
    tailwind: {
      primary: 'nombre-color-800',
      secondary: 'nombre-color-700',
      accent: 'nombre-color-500',
      accent2: 'nombre-color-500',
      text: 'nombre-color-50',
      textSecondary: 'nombre-color-300',
      background: 'nombre-color-900',
      surface: 'nombre-color-600',
    },
  },
}
```

3. Agrega los colores a `tailwind.config.js` si no existen
4. Actualiza el tipo `PaletteId` en `lib/themes/palettes.ts`

## Estructura de Archivos

```
lib/themes/
  └── palettes.ts          # Definición de todas las paletas

contexts/
  └── ThemeContext.tsx      # Contexto React para gestión de temas

hooks/
  └── useThemeClasses.ts   # Hook helper para clases de tema

components/
  └── ThemeSwitcher.tsx   # Componente UI para cambiar temas

app/configuracion/
  └── page.tsx             # Página de configuración con selector
```

## Notas Técnicas

- El tema se guarda en `localStorage` con la clave `arabiyat-theme-palette`
- El tema se aplica al atributo `data-theme` del elemento `<html>`
- Los componentes actuales usan clases hardcodeadas, pero pueden migrarse a usar `useThemeClasses()` para ser dinámicos
- Tailwind necesita ver las clases completas en el código, por lo que se usan funciones helper que devuelven las clases completas

## Migración de Componentes a Temas Dinámicos

Para hacer que un componente use el tema dinámicamente:

1. Importa `useThemeClasses`:
```tsx
import { useThemeClasses } from '@/hooks/useThemeClasses'
```

2. Obtén las clases:
```tsx
const classes = useThemeClasses()
```

3. Reemplaza las clases hardcodeadas:
```tsx
// Antes
<div className="bg-coffeeBlack text-ivory">

// Después
<div className={`${classes.background} ${classes.text}`}>
```

