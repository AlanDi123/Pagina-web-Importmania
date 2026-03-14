import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { ShippingZoneManager } from '@/components/admin/ShippingZoneManager';

export const metadata: Metadata = {
  title: 'Envíos',
  description: 'Configuración de envíos',
};

export default async function EnviosAdminPage() {
  const zones = await prisma.shippingZone.findMany({
    include: {
      rates: true,
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Configuración de Envíos</h1>

      <ShippingZoneManager zones={zones} />
    </div>
  );
}
