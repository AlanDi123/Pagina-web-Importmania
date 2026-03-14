# iMPORTMANIA - Tienda Online E-commerce

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-gray?logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![MercadoPago](https://img.shields.io/badge/MercadoPago-API-00BFFF?logo=mercadopago)](https://www.mercadopago.com.ar/developers)

Plataforma de e-commerce completa construida con Next.js 14, TypeScript, Prisma y Supabase. Diseñada específicamente para el mercado argentino con integración de MercadoPago y envíos a todo el país.

## 🚀 Características Principales

### Storefront (Tienda)
- ✅ Home page con hero banner, categorías y productos destacados
- ✅ Catálogo de productos con filtros avanzados (precio, categoría, rating, stock)
- ✅ Búsqueda con autocompletado y sugerencias
- ✅ Detalle de producto con galería, variantes y reseñas
- ✅ Carrito de compras persistente (localStorage + DB)
- ✅ Checkout completo con múltiples métodos de pago
- ✅ Sistema de favoritos / lista de deseos
- ✅ Blog integrado con editor WYSIWYG
- ✅ Programa de referidos con recompensas
- ✅ Dark mode / Light mode
- ✅ Responsive design (mobile-first)
- ✅ SEO optimizado con structured data

### Panel de Administración
- ✅ Dashboard con KPIs y estadísticas de ventas
- ✅ CRUD completo de productos (con variantes e imágenes)
- ✅ Gestión de categorías jerárquicas
- ✅ Administración de pedidos con timeline de estados
- ✅ Gestión de clientes
- ✅ Sistema de cupones de descuento
- ✅ Editor de blog con Tiptap
- ✅ Configuración de zonas y tarifas de envío
- ✅ Configuración general de la tienda
- ✅ Sistema de notificaciones

### Pagos (Argentina)
- ✅ **MercadoPago**: Checkout Pro con webhook automático
- ✅ **Transferencia bancaria**: Con descuento configurable y subida de comprobante
- ✅ **Efectivo**: Solo con retiro en persona

### Envíos
- ✅ Zonas de envío configurables por provincia/código postal
- ✅ Múltiples métodos (Andreani, OCA, Correo Argentino, envío propio)
- ✅ Envío gratis configurable por monto mínimo
- ✅ Retiro en persona

### Email Marketing
- ✅ Emails transaccionales con React Email
- ✅ Newsletter con Resend
- ✅ Carritos abandonados
- ✅ Solicitud de reseñas post-compra

## 📋 Requisitos Previos

- **Node.js** 18+ ([descargar](https://nodejs.org/))
- **npm** o **pnpm**
- Cuenta de **Supabase** ([crear gratis](https://supabase.com/))
- Cuenta de **MercadoPago** (modo sandbox para desarrollo)
- Cuenta de **Resend** para emails ([resend.com](https://resend.com/))
- Cuenta de **Vercel** para deploy (opcional)

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd Pagina-web-Importmania
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiar el archivo `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Completar las siguientes variables en `.env.local`:

#### Base de Datos (Supabase)
```env
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
```

#### Supabase
```env
NEXT_PUBLIC_SUPABASE_URL="https://[project].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
```

#### NextAuth
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generar-con-openssl-rand-base64-32"
```

Para generar el secret:
```bash
openssl rand -base64 32
```

#### MercadoPago
```env
MP_ACCESS_TOKEN="APP_USR-..."
NEXT_PUBLIC_MP_PUBLIC_KEY="APP_USR-..."
MP_WEBHOOK_SECRET="tu-webhook-secret"
```

**Nota**: Usar credenciales de **Sandbox** para desarrollo.

#### Email (Resend)
```env
RESEND_API_KEY="re_..."
EMAIL_FROM="iMPORTMANIA <hola@importmania.com.ar>"
```

#### Analytics (opcionales)
```env
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_FB_PIXEL_ID="1234567890"
NEXT_PUBLIC_TIKTOK_PIXEL_ID="XXXXXXXXXX"
```

#### App
```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_NUMBER="5411XXXXXXXX"
```

### 4. Configurar base de datos

```bash
# Generar Prisma Client
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init

# Seedear datos iniciales (opcional)
npx prisma db seed
```

### 5. Iniciar servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
importmania/
├── prisma/
│   ├── schema.prisma          # Schema de base de datos
│   ├── seed.ts                # Datos iniciales
│   └── migrations/            # Migraciones
├── public/                    # Archivos estáticos
├── src/
│   ├── app/
│   │   ├── (storefront)/      # Rutas públicas de la tienda
│   │   ├── (auth)/            # Rutas de autenticación
│   │   ├── admin/             # Panel de administración
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── ui/                # Componentes shadcn/ui
│   │   ├── storefront/        # Componentes del storefront
│   │   └── admin/             # Componentes del admin
│   ├── lib/                   # Utilidades y configuraciones
│   ├── hooks/                 # Custom hooks
│   ├── stores/                # Zustand stores
│   ├── types/                 # Tipos TypeScript
│   └── emails/                # Templates de emails
├── .env.example               # Variables de entorno de ejemplo
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo

# Build
npm run build            # Compilar para producción
npm run start            # Iniciar servidor de producción

# Base de datos
npm run db:generate      # Generar Prisma Client
npm run db:push          # Push del schema a la DB
npm run db:migrate       # Ejecutar migraciones
npm run db:seed          # Seedear datos iniciales
npm run db:studio        # Abrir Prisma Studio

# Linting
npm run lint             # Ejecutar ESLint

# Email development
npm run email:dev        # Servidor de emails en puerto 3001
```

## 👤 Usuario Admin por Defecto

Después de ejecutar el seed, podés acceder al admin con:

- **Email**: `admin@importmania.com.ar`
- **Password**: `Admin123!`

**Importante**: Cambiar la contraseña en producción.

## 💳 Configurar MercadoPago

### Modo Sandbox (Desarrollo)

1. Ir al [Panel de Desarrollador de MercadoPago](https://www.mercadopago.com.ar/developers/panel)
2. Crear una aplicación
3. Obtener las credenciales de **Sandbox**:
   - Access Token
   - Public Key
4. Configurar el Webhook URL en el panel:
   - URL: `https://tu-dominio.vercel.app/api/pagos/mercadopago/webhook`
   - Eventos: `payment`

### Modo Producción

1. Cambiar a credenciales de **Production** en el panel
2. Actualizar las variables de entorno
3. Configurar el Webhook URL de producción

## 📧 Configurar Emails (Resend)

1. Crear cuenta en [Resend](https://resend.com/)
2. Verificar el dominio desde el cual se enviarán los emails
3. Obtener la API Key desde el dashboard
4. Configurar `EMAIL_FROM` con el email verificado

## 🚀 Deploy en Vercel

### 1. Conectar repositorio a Vercel

```bash
vercel
```

O desde el dashboard de Vercel:
1. Importar el repositorio
2. Configurar las variables de entorno (todas las del `.env.example`)
3. Deploy

### 2. Configurar variables de entorno en Vercel

Ir a **Settings > Environment Variables** y agregar todas las variables.

### 3. Base de datos

Asegurarse de que la URL de Supabase sea accesible desde Vercel (por defecto lo es).

### 4. Webhook de MercadoPago

Configurar en el panel de MercadoPago la URL:
```
https://tu-dominio.vercel.app/api/pagos/mercadopago/webhook
```

### 5. Cron Jobs

Vercel ejecutará automáticamente los cron jobs configurados en `vercel.json`:
- Carritos abandonados (cada 6 horas)
- Sitemap (diario a las 3 AM)

## 🔒 Seguridad

- ✅ Autenticación con NextAuth.js + Supabase Auth
- ✅ Passwords hasheados con bcrypt
- ✅ CSRF protection automático de Next.js
- ✅ Rate limiting en endpoints sensibles
- ✅ Validación de inputs con Zod (client + server)
- ✅ SQL injection prevention con Prisma
- ✅ Headers de seguridad configurados

## 📊 SEO

- ✅ Meta tags dinámicos por página
- ✅ Structured data (JSON-LD) para productos, organización, blog posts
- ✅ Sitemap automático con next-sitemap
- ✅ robots.txt configurado
- ✅ Open Graph tags para redes sociales
- ✅ URLs amigables y descriptivas

## 🎨 Personalización

### Colores de marca

Editar `tailwind.config.ts`:

```ts
colors: {
  brand: {
    primary: '#00BFFF',    // Celeste
    secondary: '#2ECC71',  // Verde
    accent: '#FF8C00',     // Naranja
  },
}
```

### Logo y favicon

1. Subir logo desde el panel de admin (`/admin/configuracion`)
2. O reemplazar manualmente en `/public/logo.png` y `/public/favicon.ico`

## 🐛 Troubleshooting

### Error: "Prisma Client no generado"

```bash
npx prisma generate
```

### Error: "DATABASE_URL no definida"

Verificar que `.env.local` exista y tenga las variables correctas.

### Error: "MercadoPago no configurado"

Verificar que `MP_ACCESS_TOKEN` esté definida en `.env.local`.

### Error de migraciones

```bash
npx prisma migrate reset
npx prisma migrate dev
```

### Error: "NEXTAUTH_SECRET no válido"

Generar un nuevo secret:
```bash
openssl rand -base64 32
```

## 📞 Soporte

Para consultas o problemas:
- Email: soporte@importmania.com.ar
- WhatsApp: +54 11 XXXX-XXXX

## 📄 Licencia

Este proyecto es propiedad de iMPORTMANIA. Todos los derechos reservados.

---

**Construido con ❤️ en Argentina**

[Next.js](https://nextjs.org/) | [TypeScript](https://www.typescriptlang.org/) | [Prisma](https://www.prisma.io/) | [Supabase](https://supabase.com/) | [Tailwind CSS](https://tailwindcss.com/) | [shadcn/ui](https://ui.shadcn.com/)
