# Reglas de Firestore - Versión Simple (Solo Perfumes)

Si solo necesitas reglas básicas para la colección de perfumes, usa estas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Perfumes: lectura pública, escritura solo para autenticados
    match /perfumes/{perfumeId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Denegar todo lo demás
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Cómo aplicar estas reglas:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: `arabiyat-5f5f0`
3. Ve a **Firestore Database** → **Rules**
4. Copia y pega las reglas
5. Haz clic en **Publish**

## Reglas más estrictas (Recomendadas para producción):

Usa el archivo `firestore.rules` que incluye validaciones de datos y reglas más específicas.



