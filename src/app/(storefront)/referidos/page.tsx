import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Footer } from '@/components/storefront/Footer';
import { PromoBar } from '@/components/storefront/PromoBar';
import ReferidosClient from './referidos-client';

export const metadata: Metadata = {
  title: 'Programa de Referidos',
  description: 'Invitá a tus amigos y ganá recompensas en iMPORTMANIA',
};

export default async function ReferidosPage() {
  const session = await getServerSession(authOptions);

  let referralCode = '';

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { referralCode: true },
    });

    if (user) {
      referralCode = user.referralCode || '';
    }
  }

  return (
    <>
      <PromoBar
        text="¡Envío gratis en compras mayores a $50.000!"
        enabled
      />


      <main className="py-8">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ReferidosClient referralCode={referralCode} />
        </div>
      </main>

      <Footer
        categories={[]}
        socialLinks={{}}
        contactInfo={{}}
      />
    </>
  );
}
