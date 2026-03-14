import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { StoreSettings } from '@/components/admin/StoreSettings';

export const metadata: Metadata = {
  title: 'Configuración',
  description: 'Configuración de la tienda',
};

export default async function ConfiguracionAdminPage() {
  const config = await prisma.storeConfig.findMany();
  const configObj = Object.fromEntries(config.map((c) => [c.key, c.value]));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Configuración de la Tienda</h1>

      <StoreSettings config={configObj} />
    </div>
  );
}
