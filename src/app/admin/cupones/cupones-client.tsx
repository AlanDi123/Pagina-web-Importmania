import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import CuponesAdminPage from './cupones-client';

export const metadata: Metadata = {
  title: 'Cupones',
  description: 'Gestión de cupones',
};

export default async function CuponesAdminPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <CuponesAdminPage initialCoupons={coupons} />;
}
