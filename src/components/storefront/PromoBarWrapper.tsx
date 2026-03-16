import { prisma } from '@/lib/prisma';
import { PromoBar } from './PromoBar';

/**
 * PromoBarWrapper - Server Component que obtiene la configuración del PromoBar
 */
export async function PromoBarWrapper() {
  try {
    const storeConfig = await prisma.storeConfig.findMany();
    const config = Object.fromEntries(
      storeConfig.map((c) => [c.key, c.value])
    ) as Record<string, unknown>;

    return (
      <PromoBar
        text={(config.promoBarText as string) || '¡Envío gratis en compras mayores a $50.000!'}
        enabled={(config.promoBarEnabled as boolean) || true}
      />
    );
  } catch (error) {
    console.error('Error al cargar PromoBar:', error);
    return null;
  }
}
