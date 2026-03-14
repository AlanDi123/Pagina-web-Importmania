import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { ReferralDashboard } from '@/components/admin/ReferralDashboard';

export const metadata: Metadata = {
  title: 'Referidos',
  description: 'Programa de referidos',
};

export default async function ReferidosAdminPage() {
  const referrals = await prisma.referral.findMany({
    include: {
      referrer: { select: { name: true, email: true } },
      referred: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const stats = {
    totalReferrals: referrals.length,
    pendingReferrals: referrals.filter((r) => r.status === 'PENDING').length,
    completedReferrals: referrals.filter((r) => r.status === 'COMPLETED').length,
    rewardedReferrals: referrals.filter((r) => r.status === 'REWARDED').length,
    totalRewardsGiven: referrals
      .filter((r) => r.rewardValue)
      .reduce((sum, r) => sum + r.rewardValue!.toNumber(), 0),
  };

  const config = await prisma.storeConfig.findMany({
    where: {
      key: { in: ['referrals_enabled', 'referral_reward_type', 'referral_reward_value'] },
    },
  });

  const configObj = Object.fromEntries(config.map((c) => [c.key, c.value]));

  const transformedReferrals = referrals.map((r) => ({
    id: r.id,
    referrerName: r.referrer.name || r.referrer.email,
    referrerEmail: r.referrer.email,
    referredName: r.referred.name || r.referred.email,
    referredEmail: r.referred.email,
    status: r.status,
    rewardValue: r.rewardValue?.toNumber() || null,
    createdAt: r.createdAt,
    completedAt: r.completedAt,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Programa de Referidos</h1>

      <ReferralDashboard
        stats={stats}
        referrals={transformedReferrals}
        config={{
          enabled: (configObj.referrals_enabled as boolean) || false,
          rewardType: (configObj.referral_reward_type as 'PERCENTAGE' | 'FIXED_AMOUNT') || 'PERCENTAGE',
          rewardValue: (configObj.referral_reward_value as number) || 10,
        }}
      />
    </div>
  );
}
