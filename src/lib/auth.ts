import NextAuth, { type NextAuthOptions, type Session } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import DiscordProvider from 'next-auth/providers/discord';
import EmailProvider from 'next-auth/providers/email';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { z } from 'zod';

/**
 * Schema para validación de credenciales de login
 */
const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * Configuración de NextAuth
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],

  providers: [
    // Email/Password
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y contraseña son requeridos');
        }

        // Validar credenciales con Zod
        const validatedFields = credentialsSchema.safeParse(credentials);

        if (!validatedFields.success) {
          throw new Error('Credenciales inválidas');
        }

        const { email, password } = validatedFields.data;

        // Buscar usuario
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
          include: {
            addresses: true,
          },
        });

        if (!user || !user.hashedPassword) {
          throw new Error('Email o contraseña incorrectos');
        }

        // Verificar si la cuenta está activa
        if (!user.isActive) {
          throw new Error('Tu cuenta está desactivada. Contactá al soporte.');
        }

        // Verificar contraseña
        const isPasswordValid = await compare(password, user.hashedPassword);

        if (!isPasswordValid) {
          throw new Error('Email o contraseña incorrectos');
        }

        // Retornar usuario (sin password)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          phone: user.phone,
        };
      },
    }),

    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),

    // Discord OAuth
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
      authorization: {
        params: {
          scope: 'identify email',
        },
      },
    }),

    // Magic Links (Email sin contraseña) - Usando Resend API
    EmailProvider({
      // Resend API se configura directamente, no necesita server SMTP
      maxAge: 24 * 60 * 60, // 24 horas
      async generateVerificationToken() {
        // Generar token de 6 dígitos
        return Math.floor(100000 + Math.random() * 900000).toString();
      },
      async sendVerificationRequest({ identifier: email, url, token }) {
        const { host } = new URL(url);
        
        // Inicializar Resend
        const resend = new Resend(process.env.RESEND_API_KEY || '');
        
        try {
          await resend.emails.send({
            from: process.env.EMAIL_FROM || 'iMPORTMANIA <onboarding@resend.dev>',
            to: email,
            subject: `Iniciá sesión en ${host}`,
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #00BFFF 0%, #2ECC71 100%); color: white; }
                    .button { display: inline-block; padding: 16px 40px; background: #00BFFF; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 20px 0; }
                    .token { font-size: 36px; font-weight: bold; letter-spacing: 10px; text-align: center; padding: 20px; background: #f5f5f5; border-radius: 8px; margin: 20px 0; font-family: monospace; }
                    .content { background: #ffffff; padding: 40px 30px; }
                    .footer { text-align: center; padding: 30px; color: #999; font-size: 12px; background: #f9f9f9; }
                    .divider { border-top: 1px solid #eeeeee; margin: 20px 0; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1 style="margin: 0; font-size: 32px;">🔐 Tu código de acceso</h1>
                      <p style="margin: 10px 0 0 0; opacity: 0.95; font-size: 16px;">iMPORTMANIA</p>
                    </div>
                    <div class="content">
                      <p style="font-size: 16px; margin-bottom: 20px;">Hola,</p>
                      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Alguien solicitó un código de acceso para iniciar sesión en <strong>${host}</strong>.
                      </p>
                      
                      <p style="font-size: 14px; color: #666; margin-bottom: 10px;">Usá este código para ingresar:</p>
                      <div class="token">${token}</div>
                      
                      <div class="divider"></div>
                      
                      <p style="text-align: center; margin: 30px 0;">
                        <a href="${url}" class="button">Iniciar sesión automáticamente →</a>
                      </p>
                      
                      <p style="font-size: 14px; color: #999; margin-top: 30px; line-height: 1.6;">
                        ⚠️ Este código expira en 24 horas.<br>
                        Si no solicitaste este código, podés ignorar este email de forma segura.
                      </p>
                    </div>
                    <div class="footer">
                      <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} iMPORTMANIA. Todos los derechos reservados.</p>
                      <p style="margin: 0;">¿Tenés dudas? Respondé este email.</p>
                    </div>
                  </div>
                </body>
              </html>
            `,
            text: `
Tu código de acceso a ${host}: ${token}

Ingresá este código en la página de inicio de sesión o hacé click en este link para ingresar automáticamente:

${url}

Este código expira en 24 horas.

Si no solicitaste este código, podés ignorar este email de forma segura.

---
© ${new Date().getFullYear()} iMPORTMANIA
            `.trim(),
          });
          
          console.log('✅ Email enviado exitosamente a:', email);
        } catch (error) {
          console.error('❌ Error al enviar email con Resend:', error);
          throw new Error('Error al enviar el código de verificación. Por favor intentá de nuevo.');
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Asignar datos del usuario al token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone = user.phone;
      }

      // Actualizar sesión
      if (trigger === 'update' && session) {
        return {
          ...token,
          ...session.user,
        };
      }

      return token;
    },

    async session({ session, token }) {
      // Asignar datos del token a la sesión
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.phone = token.phone as string;
      }

      return session;
    },

    async signIn({ user, account, profile }) {
      // OAuth sign in (Google, Discord)
      if (account?.provider === 'google' || account?.provider === 'discord') {
        // Verificar si el usuario ya existe por email
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email || '' },
        });

        if (existingUser) {
          // Actualizar avatar si existe
          if (user.image && !existingUser.avatar) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { avatar: user.image },
            });
          }

          // Verificar si está activo
          if (!existingUser.isActive) {
            return false;
          }

          return true;
        }

        // Crear nuevo usuario desde OAuth
        await prisma.user.create({
          data: {
            email: user.email || '',
            name: user.name || '',
            avatar: user.image || null,
            role: 'CUSTOMER',
            isActive: true,
            emailVerified: new Date(),
            accounts: {
              create: {
                provider: account.provider,
                type: account.type,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            },
          },
        });

        return true;
      }

      // Email/ Magic Link sign in
      if (account?.provider === 'email') {
        // Verificar si el usuario ya existe por email
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email || '' },
        });

        if (existingUser) {
          // Verificar si está activo
          if (!existingUser.isActive) {
            return false;
          }

          // Actualizar emailVerified
          await prisma.user.update({
            where: { id: existingUser.id },
            data: { emailVerified: new Date() },
          });

          return true;
        }

        // Crear nuevo usuario desde Magic Link
        await prisma.user.create({
          data: {
            email: user.email || '',
            name: user.name || user.email?.split('@')[0] || 'Usuario',
            role: 'CUSTOMER',
            isActive: true,
            emailVerified: new Date(),
          },
        });

        return true;
      }

      // Credentials sign in
      return true;
    },
  },

  events: {
    async createUser({ user }) {
      // Crear notificación de bienvenida
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: 'NEW_USER',
          title: '¡Bienvenido a iMPORTMANIA!',
          message: 'Gracias por registrarte. Explorá nuestros productos y disfrutá de las mejores ofertas.',
          channel: 'IN_APP',
        },
      });
    },
  },

  // Seguridad
  secret: process.env.NEXTAUTH_SECRET,

  // Debug en desarrollo
  debug: process.env.NODE_ENV === 'development',
};

/**
 * Singleton de NextAuth
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

/**
 * Helper para obtener la sesión actual
 */
export async function getCurrentUser() {
  const { getServerSession } = await import('next-auth');
  const session = await getServerSession(authOptions);
  return session?.user || null;
}

/**
 * Helper para verificar si el usuario es admin
 */
export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === 'ADMIN';
}

/**
 * Helper para requerir autenticación
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('No autorizado');
  }
  return user;
}

/**
 * Helper para requerir rol de admin
 */
export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== 'ADMIN') {
    throw new Error('Acceso denegado');
  }
  return user;
}

/**
 * Extender tipos de NextAuth
 */
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      avatar?: string | null;
      role: string;
      phone?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    avatar?: string | null;
    role: string;
    phone?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    phone?: string | null;
  }
}

export default handler;
