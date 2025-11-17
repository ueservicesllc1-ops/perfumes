# Configuración de Autenticación con Google

## Pasos para Habilitar Google Sign-In en Firebase

1. **Ve a Firebase Console**
   - Accede a [Firebase Console](https://console.firebase.google.com/)
   - Selecciona tu proyecto: **arabiyat-5f5f0**

2. **Habilita Google como Proveedor de Autenticación**
   - En el menú lateral, ve a **Authentication** (Autenticación)
   - Haz clic en la pestaña **Sign-in method** (Métodos de inicio de sesión)
   - Busca **Google** en la lista de proveedores
   - Haz clic en **Google**
   - Activa el toggle **Enable** (Habilitar)
   - Completa el formulario:
     - **Project support email**: Tu email de soporte
     - **Project public-facing name**: Arabiyat Prestige (o el nombre que prefieras)
   - Haz clic en **Save** (Guardar)

3. **Configura los Dominios Autorizados (Opcional)**
   - En la misma página de Google Sign-in, ve a la sección **Authorized domains** (Dominios autorizados)
   - Asegúrate de que tu dominio esté listado
   - Por defecto, Firebase incluye:
     - `localhost` (para desarrollo)
     - Tu dominio de Firebase (`arabiyat-5f5f0.firebaseapp.com`)

4. **¡Listo!**
   - Ahora puedes usar el botón "Continuar con Google" en el panel de administración
   - Los usuarios podrán iniciar sesión con sus cuentas de Google

## Uso en la Aplicación

El panel de administración (`/admin`) ahora tiene dos opciones de inicio de sesión:

1. **Email y Contraseña**: Para usuarios registrados con email
2. **Google**: Para iniciar sesión rápidamente con una cuenta de Google

## Notas Importantes

- La primera vez que un usuario inicia sesión con Google, Firebase crea automáticamente una cuenta para ese usuario
- El email de la cuenta de Google se usa como identificador único
- Los usuarios pueden usar cualquiera de los dos métodos de autenticación

