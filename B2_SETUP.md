# Configuración de Backblaze B2

Backblaze B2 está configurado para almacenar las imágenes de los perfumes. Firestore se usa solo para los datos.

## Configuración

Las credenciales de B2 están en `lib/b2/config.ts`:

- **Key ID**: `005c2b526be0baa0000000022`
- **Application Key**: `K0050th3Izw948pBo5EwyO0uYP4kEdg`
- **Bucket Name**: `arabikey`
- **Bucket ID**: `dcd2cbc5c2468bee90ab0a1a`
- **Endpoint**: `s3.us-east-005.backblazeb2.com`

## Arquitectura

### Servidor Proxy

Se usa un servidor proxy Next.js API Routes para manejar CORS y seguridad:

1. **`/api/b2/upload`** - Subir imágenes
2. **`/api/b2/image`** - Obtener imágenes (proxy)
3. **`/api/b2/delete`** - Eliminar imágenes

### Flujo de Trabajo

```
Cliente → API Route (Proxy) → Backblaze B2
         ↓
    CORS habilitado
    Credenciales seguras
```

## Uso

### Subir Imagen

```typescript
import { uploadPerfumeImage } from '@/lib/b2/storage'

const file = // File object
const perfumeId = 'perfume-123'
const imageUrl = await uploadPerfumeImage(file, perfumeId)
```

### Mostrar Imagen

```tsx
import PerfumeImage from '@/components/PerfumeImage'

<PerfumeImage 
  imageUrl={perfume.imageUrl} 
  perfumeName={perfume.name}
/>
```

### Obtener URL de Imagen

```typescript
import { getImageUrl } from '@/lib/b2/storage'

const url = getImageUrl('perfumes/perfume-123/image.jpg')
// Retorna: /api/b2/image?path=perfumes%2Fperfume-123%2Fimage.jpg
```

## Estructura de Archivos en B2

```
arabikey/
  └── perfumes/
      └── {perfumeId}/
          └── {timestamp}-{filename}.jpg
```

## Seguridad

- Las credenciales están en el servidor (API Routes)
- CORS está configurado en el proxy
- Las imágenes se sirven a través del proxy para control de acceso

## Ventajas del Proxy

1. **CORS**: Resuelve problemas de CORS con B2
2. **Seguridad**: Las credenciales no se exponen al cliente
3. **Control**: Puedes agregar autenticación, rate limiting, etc.
4. **Cache**: Puedes agregar cache de imágenes si es necesario

## Próximos Pasos

1. Subir imágenes de perfumes a B2
2. Actualizar los perfumes en Firestore con las URLs de las imágenes
3. Las imágenes se mostrarán automáticamente en el catálogo

## Notas

- El bucket B2 debe estar configurado como **Público** para lectura
- Las subidas se hacen a través del proxy (más seguro)
- Las imágenes se sirven a través del proxy para evitar problemas de CORS

