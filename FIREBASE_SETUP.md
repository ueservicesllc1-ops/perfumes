# Configuración de Firebase

Firebase ha sido integrado en la aplicación. Aquí está la información de configuración y uso.

## Configuración

Firebase está configurado en `lib/firebase/config.ts` con las siguientes credenciales:

- **Project ID**: `arabiyat-5f5f0`
- **Auth Domain**: `arabiyat-5f5f0.firebaseapp.com`
- **Storage Bucket**: `arabiyat-5f5f0.firebasestorage.app`

## Servicios Disponibles

### 1. Firestore (Base de Datos)
Ubicación: `lib/firebase/perfumes.ts`

Funciones disponibles:
- `getAllPerfumes()` - Obtener todos los perfumes
- `getPerfumesByCategory(category)` - Obtener perfumes por categoría
- `getPerfumeById(id)` - Obtener un perfume específico
- `addPerfume(perfume)` - Agregar nuevo perfume
- `updatePerfume(id, perfume)` - Actualizar perfume
- `deletePerfume(id)` - Eliminar perfume

### 2. Authentication
Ubicación: `lib/firebase/auth.ts`

Funciones disponibles:
- `signIn(email, password)` - Iniciar sesión
- `signUp(email, password, displayName)` - Registrar usuario
- `logOut()` - Cerrar sesión
- `onAuthChange(callback)` - Observar cambios de autenticación
- `resetPassword(email)` - Recuperar contraseña
- `getCurrentUser()` - Obtener usuario actual

### 3. Storage
Ubicación: `lib/firebase/storage.ts`

Funciones disponibles:
- `uploadPerfumeImage(file, perfumeId)` - Subir imagen de perfume
- `deletePerfumeImage(imagePath)` - Eliminar imagen
- `getImageUrl(imagePath)` - Obtener URL de imagen

## Hooks Personalizados

### usePerfumes
Ubicación: `hooks/usePerfumes.ts`

Hook para obtener perfumes con estados de carga y error:

```tsx
import { usePerfumes } from '@/hooks/usePerfumes'

function MyComponent() {
  const { perfumes, loading, error } = usePerfumes('For Her')
  
  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return <div>{/* Renderizar perfumes */}</div>
}
```

## Poblar Base de Datos

Para poblar la base de datos con los perfumes iniciales:

1. Asegúrate de tener las reglas de Firestore configuradas
2. Ejecuta el script:

```bash
npx ts-node scripts/populate-perfumes.ts
```

O si prefieres usar tsx:

```bash
npx tsx scripts/populate-perfumes.ts
```

## Reglas de Firestore Recomendadas

En Firebase Console, configura estas reglas para desarrollo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Perfumes: lectura pública, escritura solo para autenticados
    match /perfumes/{perfumeId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Estructura de Datos

### Colección: `perfumes`

```typescript
{
  name: string;
  price: number;
  originalPrice?: number;
  category: 'For Her' | 'For Him' | 'For Both';
  size?: string;
  inStock: boolean;
  description?: string;
  imageUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Uso en Componentes

El catálogo (`app/catalogo/page.tsx`) ya está configurado para usar Firebase. Si no hay datos en Firebase, automáticamente usa datos de respaldo (fallback).

## Próximos Pasos

1. Configurar reglas de seguridad en Firebase Console
2. Poblar la base de datos con el script
3. Configurar autenticación si es necesario
4. Subir imágenes a Firebase Storage


