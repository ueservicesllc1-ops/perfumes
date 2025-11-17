# Arabiyat - Web App Móvil

Aplicación web móvil construida con **Next.js** y **TailwindCSS**, diseñada con enfoque **mobile-first** y configurada como **PWA** (Progressive Web App) instalable.

## 🚀 Características

- ✅ **Mobile-First Design**: Diseño optimizado para móviles desde el inicio
- ✅ **PWA Instalable**: Se puede instalar en iOS y Android sin tiendas
- ✅ **Componentes Móviles**:
  - Navbar móvil con menú hamburguesa
  - Bottom Navigation (navegación inferior)
  - Floating Action Button (FAB)
- ✅ **TailwindCSS**: Estilos optimizados para móvil
- ✅ **TypeScript**: Código type-safe

## 📱 Componentes Móviles Incluidos

### 1. MobileNavbar
Barra de navegación superior con:
- Logo/título
- Menú hamburguesa desplegable
- Diseño fijo en la parte superior

### 2. BottomNavigation
Navegación inferior estilo TikTok/Instagram con:
- Iconos y etiquetas
- Indicador de página activa
- 4 secciones: Inicio, Explorar, Favoritos, Perfil

### 3. FloatingActionButton (FAB)
Botón flotante estilo WhatsApp con:
- Menú de acciones desplegable
- Animaciones suaves
- Posicionado en la esquina inferior derecha

## 🛠️ Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Ejecutar en desarrollo:**
```bash
npm run dev
```

3. **Abrir en el navegador:**
```
http://localhost:3000
```

## 📱 Probar en Móvil

### Chrome DevTools (Recomendado)
1. Abre Chrome → F12 (DevTools)
2. Click en el ícono de dispositivo móvil (Ctrl+Shift+M)
3. Selecciona **iPhone 12** o **Galaxy S20**
4. Recarga la página

### En dispositivo real
1. Asegúrate de que tu móvil y PC estén en la misma red WiFi
2. Encuentra tu IP local (ej: `ipconfig` en Windows)
3. Accede desde el móvil: `http://TU_IP:3000`

## 🎨 Diseño Mobile-First

El diseño sigue el principio **mobile-first**:

```tsx
// Estilos para móvil (por defecto)
<div className="max-w-sm mx-auto p-4 text-sm">

// Luego agregas estilos para pantallas grandes
<div className="p-4 text-sm md:text-base md:p-6 lg:p-10">
```

### Contenedores
- `max-w-sm`: Ancho máximo para móviles
- `mx-auto`: Centrado horizontal
- `p-4`: Padding móvil por defecto

## 🔧 Configuración PWA

La app está configurada como PWA con:

- **manifest.json**: Configuración de la app instalable
- **Service Worker**: Caché offline y mejor rendimiento
- **Iconos**: Preparado para iconos 192x192 y 512x512

### Instalar como App

**En Android (Chrome):**
1. Abre la web en Chrome
2. Menú → "Agregar a pantalla de inicio"
3. La app se instalará como app nativa

**En iOS (Safari):**
1. Abre la web en Safari
2. Compartir → "Agregar a pantalla de inicio"
3. La app se instalará como app nativa

## 📁 Estructura del Proyecto

```
arabiyat/
├── app/
│   ├── layout.tsx          # Layout principal con metadata PWA
│   ├── page.tsx            # Página de inicio
│   ├── explorar/           # Página explorar
│   ├── favoritos/          # Página favoritos
│   ├── perfil/             # Página perfil
│   ├── globals.css         # Estilos globales mobile-first
│   └── register-sw.tsx     # Registro del Service Worker
├── components/
│   ├── MobileNavbar.tsx    # Navbar móvil
│   ├── BottomNavigation.tsx # Navegación inferior
│   └── FloatingActionButton.tsx # FAB
├── public/
│   ├── manifest.json       # Configuración PWA
│   ├── sw.js              # Service Worker
│   └── icon-*.png         # Iconos (necesitas crearlos)
└── package.json
```

## 🎯 Próximos Pasos

1. **Crear iconos reales**: Reemplaza los iconos placeholder con tus propios iconos
2. **Agregar contenido real**: Personaliza las páginas con tu contenido
3. **Agregar funcionalidad**: Conecta con APIs o bases de datos
4. **Optimizar para desktop**: Agrega clases `md:` y `lg:` cuando sea necesario

## 📝 Notas

- Los iconos (`icon-192x192.png` y `icon-512x512.png`) necesitan ser creados. Puedes usar herramientas como [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- El Service Worker funciona mejor en producción (con `npm run build`)
- Para testing en móvil real, considera usar [ngrok](https://ngrok.com/) o similar

## 🚀 Build para Producción

```bash
npm run build
npm start
```

---

**Diseñado con ❤️ siguiendo principios mobile-first**

