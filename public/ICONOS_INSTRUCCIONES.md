# Instrucciones para Crear Iconos PWA

Para que la PWA funcione correctamente, necesitas crear los siguientes iconos:

## Iconos Requeridos

1. **icon-192x192.png** - 192x192 píxeles
2. **icon-512x512.png** - 512x512 píxeles

## Herramientas Recomendadas

### Opción 1: PWA Asset Generator (Recomendado)
```bash
npx pwa-asset-generator tu-logo.png public/
```

### Opción 2: Online
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [PWA Builder](https://www.pwabuilder.com/imageGenerator)

### Opción 3: Manual
1. Crea un logo cuadrado (mínimo 512x512)
2. Exporta como PNG
3. Redimensiona a 192x192 y 512x512
4. Coloca ambos archivos en la carpeta `public/`

## Características Importantes

- **Formato**: PNG con transparencia
- **Tamaño**: Exactamente 192x192 y 512x512
- **Fondo**: Puede ser transparente o con color sólido
- **Diseño**: Debe verse bien en fondos claros y oscuros

## Ubicación

Coloca los archivos aquí:
```
public/
  ├── icon-192x192.png
  └── icon-512x512.png
```


