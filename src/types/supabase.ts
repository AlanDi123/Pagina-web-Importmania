/**
 * Tipo Database para Supabase
 * Este tipo se genera automáticamente desde el schema de Prisma
 * para tener type-safety en las consultas a Supabase
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          phone: string | null;
          avatar: string | null;
          role: 'CUSTOMER' | 'ADMIN';
          isActive: boolean;
          referralCode: string;
          referredBy: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          phone?: string | null;
          avatar?: string | null;
          role?: 'CUSTOMER' | 'ADMIN';
          isActive?: boolean;
          referralCode?: string;
          referredBy?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          phone?: string | null;
          avatar?: string | null;
          role?: 'CUSTOMER' | 'ADMIN';
          isActive?: boolean;
          referralCode?: string;
          referredBy?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          shortDescription: string | null;
          sku: string;
          price: number;
          compareAtPrice: number | null;
          costPrice: number | null;
          productType: 'PHYSICAL' | 'DIGITAL';
          isActive: boolean;
          isFeatured: boolean;
          stock: number;
          lowStockThreshold: number;
          weight: number | null;
          dimensions: Json | null;
          seoTitle: string | null;
          seoDescription: string | null;
          tags: string[];
          averageRating: number;
          reviewCount: number;
          salesCount: number;
          viewCount: number;
          sortOrder: number;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          shortDescription?: string | null;
          sku: string;
          price: number;
          compareAtPrice?: number | null;
          costPrice?: number | null;
          productType?: 'PHYSICAL' | 'DIGITAL';
          isActive?: boolean;
          isFeatured?: boolean;
          stock?: number;
          lowStockThreshold?: number;
          weight?: number | null;
          dimensions?: Json | null;
          seoTitle?: string | null;
          seoDescription?: string | null;
          tags?: string[];
          averageRating?: number;
          reviewCount?: number;
          salesCount?: number;
          viewCount?: number;
          sortOrder?: number;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          shortDescription?: string | null;
          sku?: string;
          price?: number;
          compareAtPrice?: number | null;
          costPrice?: number | null;
          productType?: 'PHYSICAL' | 'DIGITAL';
          isActive?: boolean;
          isFeatured?: boolean;
          stock?: number;
          lowStockThreshold?: number;
          weight?: number | null;
          dimensions?: Json | null;
          seoTitle?: string | null;
          seoDescription?: string | null;
          tags?: string[];
          averageRating?: number;
          reviewCount?: number;
          salesCount?: number;
          viewCount?: number;
          sortOrder?: number;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      // ... más tablas se pueden agregar según sea necesario
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      UserRole: 'CUSTOMER' | 'ADMIN';
      ProductType: 'PHYSICAL' | 'DIGITAL';
      OrderStatus:
        | 'PENDING'
        | 'PAYMENT_RECEIVED'
        | 'PROCESSING'
        | 'SHIPPED'
        | 'DELIVERED'
        | 'CANCELLED'
        | 'REFUNDED'
        | 'PICKUP_READY'
        | 'PICKED_UP';
      PaymentStatus:
        | 'PENDING'
        | 'APPROVED'
        | 'REJECTED'
        | 'CANCELLED'
        | 'REFUNDED'
        | 'IN_REVIEW';
      PaymentMethod: 'MERCADOPAGO' | 'TRANSFER' | 'CASH';
      ShippingMethod:
        | 'HOME_DELIVERY'
        | 'ANDREANI'
        | 'OCA'
        | 'CORREO_ARGENTINO'
        | 'PICKUP';
      CouponType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
      NotificationType:
        | 'NEW_ORDER'
        | 'PAYMENT_RECEIVED'
        | 'ORDER_SHIPPED'
        | 'ORDER_DELIVERED'
        | 'LOW_STOCK'
        | 'NEW_REVIEW'
        | 'NEW_USER'
        | 'ABANDONED_CART'
        | 'REFERRAL_COMPLETED'
        | 'SYSTEM';
      NotificationChannel: 'IN_APP' | 'EMAIL' | 'PUSH' | 'WHATSAPP';
      ReferralStatus: 'PENDING' | 'COMPLETED' | 'REWARDED';
    };
  };
}
