import NextAuth, { type NextAuthOptions, type Session } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
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

    async signIn({ user, account }) {
      // OAuth sign in
      if (account?.provider === 'google') {
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

        // Crear nuevo usuario desde Google
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
                provider: 'google',
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
