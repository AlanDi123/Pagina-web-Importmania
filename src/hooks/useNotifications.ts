'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

/**
 * Tipo de notificación
 */
export interface Notification {
  id: string;
  type: string;
  typeLabel: string;
  typeIcon: string;
  typeColor: string;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: Date;
  relativeTime: string;
  actionUrl?: string;
}

/**
 * Estado del hook de notificaciones
 */
interface UseNotificationsReturn {
  // Estado
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  hasUnread: boolean;
  
  // Acciones
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  clearAll: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
  
  // UI
  openNotifications: () => void;
  closeNotifications: () => void;
  toggleNotifications: () => void;
  isOpen: boolean;
}

/**
 * Hook para manejar notificaciones del usuario
 */
export function useNotifications(): UseNotificationsReturn {
  const { isAuthenticated, user } = useAuth();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Mapeo de tipos de notificación a labels e íconos
   */
  const typeMapping: Record<string, { label: string; icon: string; color: string }> = {
    NEW_ORDER: { label: 'Nuevo pedido', icon: '📦', color: 'text-blue-500' },
    PAYMENT_RECEIVED: { label: 'Pago recibido', icon: '💰', color: 'text-green-500' },
    ORDER_SHIPPED: { label: 'Pedido enviado', icon: '🚚', color: 'text-indigo-500' },
    ORDER_DELIVERED: { label: 'Pedido entregado', icon: '✅', color: 'text-emerald-500' },
    LOW_STOCK: { label: 'Stock bajo', icon: '⚠️', color: 'text-yellow-500' },
    NEW_REVIEW: { label: 'Nueva reseña', icon: '⭐', color: 'text-amber-500' },
    NEW_USER: { label: 'Nuevo usuario', icon: '👤', color: 'text-purple-500' },
    ABANDONED_CART: { label: 'Carrito abandonado', icon: '🛒', color: 'text-orange-500' },
    REFERRAL_COMPLETED: { label: 'Referido completado', icon: '🎁', color: 'text-pink-500' },
    SYSTEM: { label: 'Sistema', icon: 'ℹ️', color: 'text-gray-500' },
  };

  /**
   * Formatear tiempo relativo
   */
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'justo ahora';
    if (diffMins < 60) return `hace ${diffMins}m`;
    if (diffHours < 24) return `hace ${diffHours}h`;
    if (diffDays < 7) return `hace ${diffDays}d`;
    return date.toLocaleDateString('es-AR');
  };

  /**
   * Obtener notificaciones
   */
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/notificaciones');
      
      if (!response.ok) {
        throw new Error('Error al cargar notificaciones');
      }

      const data = await response.json();
      
      const formattedNotifications: Notification[] = (data.notifications || []).map((n: {
        id: string;
        type: string;
        title: string;
        message: string;
        data: Record<string, unknown>;
        isRead: boolean;
        createdAt: string;
      }) => {
        const typeInfo = typeMapping[n.type] || typeMapping.SYSTEM;
        
        return {
          id: n.id,
          type: n.type,
          typeLabel: typeInfo.label,
          typeIcon: typeInfo.icon,
          typeColor: typeInfo.color,
          title: n.title,
          message: n.message,
          data: n.data,
          isRead: n.isRead,
          createdAt: new Date(n.createdAt),
          relativeTime: formatRelativeTime(new Date(n.createdAt)),
          actionUrl: n.data?.url as string | undefined,
        };
      });

      setNotifications(formattedNotifications);
      
      // Calcular no leídas
      const unread = formattedNotifications.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar notificaciones');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  /**
   * Marcar notificación como leída
   */
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notificaciones/${notificationId}/read`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Error al marcar como leída');
      }

      // Actualizar estado local
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, []);

  /**
   * Marcar todas como leídas
   */
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch('/api/notificaciones/read-all', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Error al marcar todas como leídas');
      }

      // Actualizar estado local
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  }, []);

  /**
   * Eliminar notificación
   */
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notificaciones/${notificationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar notificación');
      }

      // Actualizar estado local
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      
      // Actualizar contador si era no leída
      const notification = notifications.find((n) => n.id === notificationId);
      if (notification && !notification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  }, [notifications]);

  /**
   * Limpiar todas las notificaciones
   */
  const clearAll = useCallback(async () => {
    try {
      const response = await fetch('/api/notificaciones/read-all', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al limpiar notificaciones');
      }

      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error('Error clearing all notifications:', err);
    }
  }, []);

  /**
   * Refrescar contador de no leídas
   */
  const refreshUnreadCount = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return;

    try {
      const response = await fetch('/api/notificaciones/unread-count');
      const data = await response.json();
      setUnreadCount(data.count || 0);
    } catch (err) {
      console.error('Error refreshing unread count:', err);
    }
  }, [isAuthenticated, user?.id]);

  /**
   * Abrir panel de notificaciones
   */
  const openNotifications = useCallback(() => {
    setIsOpen(true);
    fetchNotifications();
  }, [fetchNotifications]);

  /**
   * Cerrar panel de notificaciones
   */
  const closeNotifications = useCallback(() => {
    setIsOpen(false);
  }, []);

  /**
   * Toggle panel
   */
  const toggleNotifications = useCallback(() => {
    if (isOpen) {
      closeNotifications();
    } else {
      openNotifications();
    }
  }, [isOpen, openNotifications, closeNotifications]);

  /**
   * Cargar notificaciones al autenticarse
   */
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchNotifications();
      
      // Polling cada 30 segundos
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user?.id, fetchNotifications]);

  /**
   * Request permission para push notifications
   */
  const requestPushPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      throw new Error('Este navegador no soporta notificaciones push');
    }

    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      throw new Error('Permiso denegado');
    }

    // Suscribirse a push notifications
    // Aquí iría la lógica para registrar el service worker y obtener el subscription
    return true;
  }, []);

  return {
    // Estado
    notifications,
    unreadCount,
    isLoading,
    error,
    hasUnread: unreadCount > 0,
    
    // Acciones
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    refreshUnreadCount,
    requestPushPermission,
    
    // UI
    isOpen,
    openNotifications,
    closeNotifications,
    toggleNotifications,
  };
}

export default useNotifications;
