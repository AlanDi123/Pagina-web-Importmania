import type { Referral, ReferralStatus, User, CouponType } from '@prisma/client';

/**
 * Referido con información de usuarios
 */
export interface ReferralWithUsers extends Referral {
  referrer: Pick<User, 'id' | 'name' | 'email' | 'avatar' | 'referralCode'>;
  referred: Pick<User, 'id' | 'name' | 'email' | 'avatar'>;
}

/**
 * Referido para listar en admin
 */
export interface ReferralListItem {
  id: string;
  referrerId: string;
  referrerName: string;
  referrerEmail: string;
  referredId: string;
  referredName: string;
  referredEmail: string;
  status: ReferralStatus;
  rewardType: CouponType | null;
  rewardValue: number | null;
  rewardClaimed: boolean;
  createdAt: Date;
  completedAt: Date | null;
}

/**
 * Resumen de referidos para usuario
 */
export interface ReferralSummary {
  referralCode: string;
  referralUrl: string;
  totalReferrals: number;
  pendingReferrals: number;
  completedReferrals: number;
  rewardedReferrals: number;
  totalEarnings: number;
  conversionRate: number;
  referrals: ReferralListItem[];
  rewards: Array<{
    id: string;
    description: string;
    value: number;
    type: CouponType;
    claimed: boolean;
    claimedAt: Date | null;
  }>;
}

/**
 * Estadísticas de referidos para admin
 */
export interface ReferralStats {
  totalReferrals: number;
  pendingReferrals: number;
  completedReferrals: number;
  rewardedReferrals: number;
  conversionRate: number;
  totalRewardsGiven: number;
  averageRewardsPerReferral: number;
  topReferrers: Array<{
    userId: string;
    name: string;
    email: string;
    referralCount: number;
    completedCount: number;
    totalEarnings: number;
  }>;
  referralsByMonth: Array<{
    month: string;
    referrals: number;
    completed: number;
  }>;
  recentReferrals: ReferralListItem[];
}

/**
 * Configuración del programa de referidos
 */
export interface ReferralConfig {
  enabled: boolean;
  rewardType: CouponType;
  rewardValue: number;
  rewardForReferred: boolean;
  referredDiscountType: CouponType;
  referredDiscountValue: number;
  minPurchaseForReward: number;
  maxRewardsPerUser: number;
  referralExpiryDays: number;
}

/**
 * Datos para crear referido
 */
export interface CreateReferralData {
  referrerId: string;
  referredId: string;
  referralCode: string;
}

/**
 * Progreso de referido
 */
export interface ReferralProgress {
  step: 'registered' | 'first_purchase' | 'reward_issued';
  stepLabel: string;
  isCompleted: boolean;
  completedAt: Date | null;
  description: string;
}

/**
 * Recompensa de referido
 */
export interface ReferralReward {
  id: string;
  referralId: string;
  type: CouponType;
  value: number;
  couponCode: string;
  description: string;
  issuedAt: Date;
  expiresAt: Date;
  claimed: boolean;
  claimedAt: Date | null;
  used: boolean;
  usedAt: Date | null;
}

/**
 * Email de invitación de referido
 */
export interface ReferralInviteEmail {
  referrerName: string;
  referrerEmail: string;
  referredEmail: string;
  referralCode: string;
  referralUrl: string;
  rewardDescription: string;
  referredRewardDescription: string;
}
