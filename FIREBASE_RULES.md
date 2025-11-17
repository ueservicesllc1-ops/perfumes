# Reglas de Seguridad de Firebase Firestore

## Instrucciones para Aplicar las Reglas

### Opción 1: Desde Firebase Console (Recomendado)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **arabiyat-5f5f0**
3. En el menú lateral, ve a **Firestore Database**
4. Haz clic en la pestaña **Rules**
5. Copia el contenido del archivo `firestore.rules`
6. Pega las reglas en el editor
7. Haz clic en **Publish**

### Opción 2: Usando Firebase CLI

```bash
# Instalar Firebase CLI (si no lo tienes)
npm install -g firebase-tools

# Iniciar sesión
firebase login

# Inicializar Firebase (si es la primera vez)
firebase init firestore

# Desplegar reglas
firebase deploy --only firestore:rules
```

## Reglas Básicas (Solo Perfumes)

Si solo necesitas que los perfumes sean públicos para lectura:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /perfumes/{perfumeId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Reglas Completas (Recomendadas)

El archivo `firestore.rules` incluye:

### ✅ Perfumes
- **Lectura**: Pública (cualquiera puede ver)
- **Escritura**: Solo usuarios autenticados
- **Validación**: Campos requeridos y tipos de datos

### ✅ Usuarios
- Solo pueden leer/escribir su propio perfil

### ✅ Favoritos
- Solo pueden ver/modificar sus propios favoritos

### ✅ Carrito
- Solo pueden ver/modificar su propio carrito

### ✅ Pedidos
- Solo pueden ver sus propios pedidos
- Solo pueden crear pedidos con datos válidos

## Estructura de Datos Esperada

### Colección: `perfumes`

```typescript
{
  name: string;              // Requerido
  price: number;             // Requerido
  category: 'For Her' | 'For Him' | 'For Both';  // Requerido
  inStock: boolean;           // Requerido
  originalPrice?: number;     // Opcional
  size?: string;              // Opcional
  description?: string;       // Opcional
  imageUrl?: string;          // Opcional
  createdAt: Timestamp;       // Auto-generado
  updatedAt: Timestamp;       // Auto-generado
}
```

### Colección: `users`

```typescript
{
  email: string;
  displayName?: string;
  createdAt: Timestamp;
  // ... otros campos
}
```

### Colección: `favorites`

```typescript
{
  userId: string;             // ID del usuario
  perfumeId: string;          // ID del perfume
  createdAt: Timestamp;
}
```

### Colección: `cart`

```typescript
{
  userId: string;             // ID del usuario
  items: Array<{
    perfumeId: string;
    quantity: number;
  }>;
  updatedAt: Timestamp;
}
```

### Colección: `orders`

```typescript
{
  userId: string;             // ID del usuario
  items: Array<{
    perfumeId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Timestamp;
}
```

## Testing de Reglas

Puedes probar las reglas en Firebase Console:

1. Ve a **Firestore Database** → **Rules**
2. Haz clic en **Rules Playground**
3. Prueba diferentes escenarios:
   - Lectura sin autenticación
   - Escritura sin autenticación
   - Escritura con autenticación
   - Lectura de otro usuario

## Notas Importantes

⚠️ **Desarrollo**: Las reglas básicas permiten lectura pública para facilitar el desarrollo.

🔒 **Producción**: Considera agregar más restricciones según tus necesidades:
- Rate limiting
- Validación de precios
- Límites de tamaño de datos
- Validación de URLs de imágenes

## Solución de Problemas

### Error: "Missing or insufficient permissions"
- Verifica que las reglas estén publicadas
- Verifica que el usuario esté autenticado (si se requiere)
- Revisa los logs en Firebase Console

### Error: "Permission denied"
- Verifica la estructura de datos
- Verifica que los campos requeridos estén presentes
- Verifica los tipos de datos

## Recursos

- [Documentación de Firestore Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Console](https://console.firebase.google.com/)
- [Simulador de Reglas](https://firebase.google.com/docs/firestore/security/test-rules-emulator)

