# Configuración de Discord OAuth para iMPORTMANIA

## Credenciales Configuradas

- **Client ID**: `1483137421628670155`
- **Client Secret**: `aaH8Kh_iYP3YSuY9MAsNxb94Q3K-U_gc`

## Pasos para Configurar en Discord Developer Portal

### 1. Crear Aplicación en Discord

1. Ir a [Discord Developer Portal](https://discord.com/developers/applications)
2. Click en **"New Application"** (arriba a la derecha)
3. Poner nombre: `iMPORTMANIA`
4. Aceptar términos y crear

### 2. Configurar OAuth2

1. En el menú lateral, ir a **"OAuth2"**
2. En **"Redirects"**, click en **"Add Redirect"**
3. Agregar las siguientes URLs:

```
# Desarrollo Local
http://localhost:3000/api/auth/callback/discord

# Producción (cuando esté listo)
https://importmania.com.ar/api/auth/callback/discord
```

4. Click en **"Save Changes"**

### 3. Obtener Credenciales

1. En la página de **OAuth2**, vas a ver:
   - **CLIENT ID**: `1483137421628670155`
   - **CLIENT SECRET**: Click en **"Reset Secret"** para verlo/copiarlo

2. Estas credenciales ya están configuradas en el `.env` del proyecto

### 4. Configurar Permisos (Opcional)

En **"OAuth2" > "Scopes"**:

- ✅ Marcar: `identify`
- ✅ Marcar: `email`

Esto permite obtener:
- Username de Discord
- Email verificado
- Avatar

### 5. Personalización (Opcional)

En **"OAuth2" > "Customize Authorization Screen"**:

- Subir logo de iMPORTMANIA
- Agregar descripción: "Tu tienda de productos importados de confianza"

---

## Variables de Entorno (.env)

Las siguientes variables ya están configuradas en tu `.env`:

```bash
DISCORD_CLIENT_ID="1483137421628670155"
DISCORD_CLIENT_SECRET="aaH8Kh_iYP3YSuY9MAsNxb94Q3K-U_gc"
```

---

## Verificación de Funcionamiento

### 1. Reiniciar el Servidor

```bash
# Detener servidor (Ctrl + C)
# Volver a iniciar
npm run dev
```

### 2. Probar Login con Discord

1. Ir a `http://localhost:3000/login`
2. Click en **"Continuar con Discord"**
3. Debería redirigir a Discord para autorizar
4. Después de autorizar, redirige a la home

### 3. Verificar en Base de Datos

El usuario debería guardarse en PostgreSQL con:
- Email de Discord
- Nombre de usuario
- Avatar (si está disponible)
- Provider: `discord`
- Provider Account ID: ID de Discord

---

## URLs Importantes

| Propósito | URL |
|-----------|-----|
| Discord Developer Portal | https://discord.com/developers/applications |
| Tu Aplicación | https://discord.com/developers/applications/1483137421628670155 |
| Redirect URI (dev) | `http://localhost:3000/api/auth/callback/discord` |
| Redirect URI (prod) | `https://importmania.com.ar/api/auth/callback/discord` |

---

## Solución de Problemas

### Error: "Invalid Redirect URI"

**Causa:** El redirect URI no está registrado en Discord Developer Portal

**Solución:**
1. Ir a Discord Developer Portal
2. Tu aplicación > OAuth2
3. Agregar exactamente: `http://localhost:3000/api/auth/callback/discord`
4. Guardar cambios

### Error: "Unknown Application"

**Causa:** Client ID incorrecto o aplicación eliminada

**Solución:**
1. Verificar que el Client ID en `.env` sea `1483137421628670155`
2. Reiniciar el servidor después de cambiar `.env`

### Error: "Invalid Client Secret"

**Causa:** Client Secret incorrecto

**Solución:**
1. Ir a Discord Developer Portal > OAuth2
2. Click en **"Reset Secret"**
3. Copiar nuevo secret
4. Actualizar en `.env`
5. Reiniciar servidor

### El botón de Discord no aparece

**Causa:** Variables de entorno no cargadas

**Solución:**
1. Verificar que `.env` tenga las variables `DISCORD_CLIENT_ID` y `DISCORD_CLIENT_SECRET`
2. Reiniciar el servidor
3. Verificar consola de Next.js por errores

---

## Configuración de Resend (Email)

### Credenciales Configuradas

- **API Key**: `re_B31ptA8w_NeVQitEXXV3zX5KCdQS2nhht`
- **SMTP**: `smtp://resend:re_B31ptA8w...@smtp.resend.com:465`

### Pasos para Verificar Dominio en Resend

1. Ir a [Resend.com](https://resend.com)
2. Iniciar sesión
3. Ir a **"Domains"**
4. Agregar dominio: `importmania.com.ar`
5. Configurar DNS records proporcionados por Resend:
   - MX record
   - TXT record (SPF)
   - CNAME record (DKIM)

### Verificar Email From

El email `noreply@importmania.com.ar` debe estar verificado en Resend antes de enviar emails.

### Probar Magic Link

1. Ir a `http://localhost:3000/login`
2. Ingresar email en "Correo electrónico"
3. Click en botón 📧
4. Toast: "¡Revisá tu bandeja de entrada!"
5. Revisar email (tarda 1-2 minutos)
6. Usar código de 6 dígitos o link mágico

---

## Recursos Útiles

- [NextAuth Discord Provider](https://next-auth.js.org/providers/discord)
- [Discord OAuth2 Documentation](https://discord.com/developers/docs/topics/oauth2)
- [Resend Documentation](https://resend.com/docs)
- [NextAuth Email Provider](https://next-auth.js.org/providers/email)

---

## Checklist de Configuración

- [ ] Discord Application creada
- [ ] Redirect URI agregado en Discord
- [ ] Client ID y Secret en `.env`
- [ ] Dominio verificado en Resend
- [ ] Email from verificado en Resend
- [ ] Servidor reiniciado
- [ ] Login con Discord probado
- [ ] Magic Link probado
