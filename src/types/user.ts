import type { User, Address, Session, Account, UserRole } from '@prisma/client';

/**
 * Usuario con relaciones
 */
export interface UserWithRelations extends User {
  addresses: Address[];
  orders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: Date;
  }>;
  reviews: Array<{
    id: string;
    productId: string;
    rating: number;
    createdAt: Date;
  }>;
  wishlist: Array<{
    id: string;
    productId: string;
  }>;
}

/**
 * Usuario para listar en admin
 */
export interface UserListItem {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: UserRole;
  isActive: boolean;
  referralCode: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: Date;
}

/**
 * Perfil de usuario (vista del cliente)
 */
export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  avatar: string | null;
  role: UserRole;
  referralCode: string;
  referredBy: string | null;
  totalOrders: number;
  totalSpent: number;
  wishlistCount: number;
  addresses: Address[];
  defaultAddress: Address | null;
}

/**
 * Dirección completa
 */
export interface FullAddress extends Address {
  user: User;
  orders: Array<{
    id: string;
    orderNumber: string;
    createdAt: Date;
  }>;
}

/**
 * Datos para registro de usuario
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  referralCode?: string;
  newsletter?: boolean;
}

/**
 * Datos para login
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * Datos para actualizar perfil
 */
export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  currentPassword?: string;
  newPassword?: string;
}

/**
 * Datos para dirección
 */
export interface AddressFormData {
  label: string;
  street: string;
  number: string;
  floor?: string;
  apartment?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  phone?: string;
  notes?: string;
}

/**
 * Estadísticas de usuario
 */
export interface UserStats {
  totalUsers: number;
  newUsersThisMonth: number;
  activeUsers: number;
  usersByRole: Record<UserRole, number>;
  topCustomers: Array<{
    userId: string;
    name: string;
    email: string;
    totalOrders: number;
    totalSpent: number;
  }>;
}

/**
 * Filtros para búsqueda de usuarios
 */
export interface UserFilters {
  role?: UserRole;
  isActive?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
  minOrders?: number;
  minSpent?: number;
}

/**
 * Sesión de usuario extendida
 */
export interface UserSession extends Session {
  user: {
    id: string;
    email: string;
    name?: string | null;
    avatar?: string | null;
    role: UserRole;
    phone?: string | null;
  };
}

/**
 * Datos de OAuth
 */
export interface OAuthData {
  provider: string;
  providerAccountId: string;
  type: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
}

/**
 * Progreso de registro (onboarding)
 */
export interface OnboardingProgress {
  accountCreated: boolean;
  emailVerified: boolean;
  profileCompleted: boolean;
  addressAdded: boolean;
  firstOrderPlaced: boolean;
}

/**
 * Preferencias de usuario
 */
export interface UserPreferences {
  newsletter: boolean;
  pushNotifications: boolean;
  emailNotifications: {
    newOrder: boolean;
    shippingUpdate: boolean;
    promotions: boolean;
    reviewRequest: boolean;
  };
  language: string;
  currency: string;
}

/**
 * Actividad reciente de usuario
 */
export interface UserActivity {
  type: 'order' | 'review' | 'wishlist' | 'login';
  description: string;
  url?: string;
  createdAt: Date;
}

/**
 * Resumen de referido
 */
export interface ReferralSummary {
  referralCode: string;
  totalReferrals: number;
  pendingReferrals: number;
  completedReferrals: number;
  rewardedReferrals: number;
  totalEarnings: number;
  referralUrl: string;
}

export default {
  type UserWithRelations,
  type UserListItem,
  type UserProfile,
  type FullAddress,
  type RegisterData,
  type LoginData,
  type UpdateProfileData,
  type AddressFormData,
  type UserStats,
  type UserFilters,
  type UserSession,
  type OAuthData,
  type OnboardingProgress,
  type UserPreferences,
  type UserActivity,
  type ReferralSummary,
};
