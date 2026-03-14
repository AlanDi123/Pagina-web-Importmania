import type { Notification, NotificationType, NotificationChannel, User } from '@prisma/client';

/**
 * Notificación con relaciones
 */
export interface NotificationWithUser extends Notification {
  user: Pick<User, 'id' | 'name' | 'email' | 'avatar'> | null;
}

/**
 * Notificación para mostrar en UI
 */
export interface NotificationDisplay {
  id: string;
  type: NotificationType;
  typeLabel: string;
  typeIcon: string;
  typeColor: string;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  isRead: boolean;
  channel: NotificationChannel;
  createdAt: Date;
  relativeTime: string;
  actionUrl?: string;
  actionLabel?: string;
}

/**
 * Notificación para admin
 */
export interface NotificationAdmin {
  id: string;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  channel: NotificationChannel;
  createdAt: Date;
}

/**
 * Tipos de notificación con metadata
 */
export interface NotificationTypeInfo {
  type: NotificationType;
  label: string;
  description: string;
  icon: string;
  color: string;
  defaultChannels: NotificationChannel[];
}

/**
 * Configuración de notificaciones por tipo
 */
export interface NotificationTypeConfig {
  type: NotificationType;
  enabled: boolean;
  channels: {
    inApp: boolean;
    email: boolean;
    push: boolean;
    whatsapp: boolean;
  };
}

/**
 * Preferencias de notificaciones de usuario
 */
export interface NotificationPreferences {
  emailNotifications: {
    newOrder: boolean;
    paymentReceived: boolean;
    orderShipped: boolean;
    orderDelivered: boolean;
    reviewRequest: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
  pushNotifications: {
    enabled: boolean;
    newOrder: boolean;
    paymentReceived: boolean;
    orderShipped: boolean;
    lowStock: boolean;
  };
  whatsappNotifications: {
    enabled: boolean;
    orderUpdates: boolean;
    promotions: boolean;
  };
}

/**
 * Estadísticas de notificaciones
 */
export interface NotificationStats {
  totalNotifications: number;
  unreadNotifications: number;
  readNotifications: number;
  notificationsByType: Record<NotificationType, number>;
  notificationsByChannel: Record<NotificationChannel, number>;
  recentNotifications: NotificationAdmin[];
  deliveryRates: {
    email: number;
    push: number;
    whatsapp: number;
  };
}

/**
 * Datos para crear notificación
 */
export interface NotificationData {
  userId?: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  channel?: NotificationChannel;
  channels?: NotificationChannel[];
}

/**
 * Notificación en tiempo real (WebSocket)
 */
export interface RealtimeNotification {
  event: 'notification_created' | 'notification_updated' | 'notification_deleted';
  notification: NotificationDisplay;
  timestamp: Date;
}

/**
 * Subscription a Web Push
 */
export interface PushSubscription {
  id: string;
  userId: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  createdAt: Date;
  lastUsedAt: Date | null;
  isActive: boolean;
}

/**
 * Plantilla de notificación
 */
export interface NotificationTemplate {
  type: NotificationType;
  subjectTemplate: string;
  titleTemplate: string;
  messageTemplate: string;
  channels: NotificationChannel[];
  variables: string[];
}

export default {
  type NotificationWithUser,
  type NotificationDisplay,
  type NotificationAdmin,
  type NotificationTypeInfo,
  type NotificationTypeConfig,
  type NotificationPreferences,
  type NotificationStats,
  type NotificationData,
  type RealtimeNotification,
  type PushSubscription,
  type NotificationTemplate,
};
