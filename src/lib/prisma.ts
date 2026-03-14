import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Singleton del Prisma Client para evitar múltiples instancias en desarrollo
 * debido al hot reloading de Next.js
 */
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

/**
 * Función para desconectar Prisma al cerrar el servidor
 * Útil para scripts y tests
 */
export async function disconnectPrisma() {
  await prisma.$disconnect();
}

export default prisma;
