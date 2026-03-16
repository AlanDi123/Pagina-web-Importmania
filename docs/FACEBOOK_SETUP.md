# Configuración de Facebook Login para iMPORTMANIA

## Credenciales Configuradas

- **App ID**: `1589377639234834`
- **App Secret**: `8d7068a271343cda60adce7cea075db5`

## Pasos para Configurar en Meta (Facebook) Developers

### 1. Crear/Editar App en Facebook Developers

1. Ir a [Facebook Developers](https://developers.facebook.com/apps/)
2. Seleccionar tu app o crear una nueva
3. Ir a **Configuración** > **General**

### 2. Agregar Producto "Facebook Login"

1. En el dashboard de la app, hacer click en **"Agregar Producto"**
2. Buscar **"Facebook Login"** y agregarlo
3. Ir a **Facebook Login** > **Configuración**

### 3. Configurar OAuth Redirect URIs

En la sección **"Valid Login URIs"** agregar:

```
# Desarrollo Local
http://localhost:3000/api/auth/callback/facebook

# Producción (reemplazar con tu dominio)
https://importmania.com.ar/api/auth/callback/facebook
```

### 4. Configurar OAuth Settings

En **Facebook Login** > **Configuración**:

- ✅ **Client OAuth Login**: Habilitado
- ✅ **Web OAuth Login**: Habilitado
- ✅ **Embedded Browser OAuth Login**: Deshabilitado
- **Valid OAuth Redirect URIs**:
  ```
  http://localhost:3000/api/auth/callback/facebook
  ```

### 5. Configurar App Domain

En **Configuración** > **General**:

- **App Domain**: `localhost` (para desarrollo)
- **App Domain**: `importmania.com.ar` (para producción)
- **Privacy Policy URL**: `https://importmania.com.ar/privacidad`
- **Terms of Service URL**: `https://importmania.com.ar/terminos`

### 6. Configurar App Info

En **Configuración** > **General** > **Información de la app**:

- **Categoría**: `Compras y retail`
- **Correo electrónico de contacto**: Tu email de contacto

### 7. Personalización de Inicio de Sesión (Opcional)

En **Facebook Login** > **Configuración** > **Personalización del inicio de sesión**:

- Deshabilitar **"Usar el inicio de sesión de Facebook"** si querés usar botones personalizados
- Esto permite usar nuestros botones personalizados en el formulario

### 8. Verificación de App (Para Producción)

⚠️ **Importante**: Para producción, Facebook requiere verificación de app:

1. Ir a **Configuración de la app** > **Verificación de la app**
2. Completar el proceso de verificación
3. Proporcionar URL de política de privacidad y términos de servicio
4. Esperar aprobación de Meta

Mientras tanto, la app estará en **Modo Desarrollo** y solo los usuarios agregados como "Testers" podrán iniciar sesión.

### 9. Agregar Testers (Modo Desarrollo)

1. Ir a **Roles** > **Usuarios de prueba**
2. Agregar emails de los usuarios que probarán el login
3. Los usuarios recibirán una invitación por email

## Variables de Entorno (.env)

```bash
FACEBOOK_CLIENT_ID="1589377639234834"
FACEBOOK_CLIENT_SECRET="8d7068a271343cda60adce7cea075db5"
```

## Verificación de Funcionamiento

### En Desarrollo:

1. Reiniciar el servidor: `npm run dev`
2. Ir a `http://localhost:3000/login` o `http://localhost:3000/registro`
3. Click en **"Continuar con Facebook"**
4. Debería redirigir a Facebook y luego volver a la home

### URLs de Callback

- **Desarrollo**: `http://localhost:3000/api/auth/callback/facebook`
- **Producción**: `https://importmania.com.ar/api/auth/callback/facebook`

## Solución de Problemas

### Error: "URL Blocked"

- Verificar que el **Valid Login URI** esté configurado correctamente en Facebook Developers
- Asegurarse que el redirect URI coincida exactamente (incluyendo http/https)

### Error: "App Not Configured"

- La app está en modo desarrollo y el usuario no es tester
- Agregar el usuario en **Roles** > **Usuarios de prueba**

### Error: "Invalid OAuth Request"

- Verificar que `FACEBOOK_CLIENT_ID` y `FACEBOOK_CLIENT_SECRET` estén correctos en `.env`
- Reiniciar el servidor después de cambiar variables de entorno

## Instagram Login (Opcional)

Instagram usa Facebook Login para OAuth. Para habilitarlo:

1. En Facebook Developers, agregar el producto **"Instagram Basic Display"**
2. Configurar redirect URI similar a Facebook
3. No se necesitan credenciales adicionales en el `.env`

## Recursos Útiles

- [Documentación de Facebook Login](https://developers.facebook.com/docs/facebook-login/)
- [NextAuth Facebook Provider](https://next-auth.js.org/providers/facebook)
- [Meta App Dashboard](https://developers.facebook.com/apps/)
