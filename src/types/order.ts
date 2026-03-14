import type {
  Order,
  OrderItem,
  OrderHistory,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  ShippingMethod,
  Address,
  User,
} from '@prisma/client';

/**
 * Pedido con relaciones completas
 */
export interface OrderWithRelations extends Order {
  user: User;
  address: Address | null;
  items: (OrderItem & {
    product: {
      id: string;
      name: string;
      mainImage: { url: string } | null;
    };
  })[];
  history: OrderHistory[];
}

/**
 * Pedido para listar en el dashboard
 */
export interface OrderListItem {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  total: number;
  itemsCount: number;
  createdAt: Date;
  paidAt: Date | null;
  deliveredAt: Date | null;
}

/**
 * Pedido para detalle (vista del cliente)
 */
export interface OrderDetail extends OrderWithRelations {
  statusLabel: string;
  statusColor: string;
  paymentStatusLabel: string;
  paymentStatusColor: string;
  shippingMethodLabel: string;
  paymentMethodLabel: string;
  canCancel: boolean;
  canReview: boolean;
  canDownloadInvoice: boolean;
  trackingUrl: string | null;
  estimatedDeliveryDate: Date | null;
}

/**
 * Item de pedido
 */
export interface OrderItemDetail {
  id: string;
  productId: string;
  variantId: string | null;
  productName: string;
  variantName: string | null;
  sku: string;
  price: number;
  quantity: number;
  subtotal: number;
  isDigital: boolean;
  downloadUrl: string | null;
  downloadCount: number;
  productImage: string | null;
}

/**
 * Historial de cambios de estado
 */
export interface OrderStatusChange {
  id: string;
  orderId: string;
  status: OrderStatus;
  statusLabel: string;
  comment: string | null;
  createdBy: string | null;
  createdAt: Date;
}

/**
 * Timeline de pedido para visualización
 */
export interface OrderTimeline {
  status: OrderStatus;
  label: string;
  date: Date | null;
  isCompleted: boolean;
  isCurrent: boolean;
  icon: string;
}

/**
 * Filtros para búsqueda de pedidos
 */
export interface OrderFilters {
  status?: OrderStatus[];
  paymentStatus?: PaymentStatus[];
  paymentMethod?: PaymentMethod[];
  shippingMethod?: ShippingMethod[];
  dateFrom?: Date;
  dateTo?: Date;
  minTotal?: number;
  maxTotal?: number;
  customerEmail?: string;
  orderNumber?: string;
}

/**
 * Ordenamiento de pedidos
 */
export type OrderSort =
  | 'newest'
  | 'oldest'
  | 'highest'
  | 'lowest'
  | 'status';

/**
 * Parámetros de consulta para pedidos
 */
export interface OrderQuery {
  page?: number;
  limit?: number;
  sort?: OrderSort;
  filters?: OrderFilters;
  userId?: string;
}

/**
 * Resultado paginado de pedidos
 */
export interface PaginatedOrders {
  orders: OrderListItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  summary: {
    totalRevenue: number;
    averageOrderValue: number;
    ordersByStatus: Record<OrderStatus, number>;
  };
}

/**
 * Datos para crear pedido (checkout)
 */
export interface CreateOrderData {
  userId: string;
  addressId?: string;
  address?: {
    street: string;
    number: string;
    floor?: string;
    apartment?: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    phone?: string;
    notes?: string;
  };
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
  }>;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  notes?: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  transferDiscount?: number;
  total: number;
}

/**
 * Datos para actualizar estado de pedido
 */
export interface UpdateOrderStatusData {
  orderId: string;
  status: OrderStatus;
  comment?: string;
  trackingCode?: string;
  trackingUrl?: string;
  estimatedDelivery?: Date;
}

/**
 * Datos para reembolso
 */
export interface RefundData {
  orderId: string;
  amount: number;
  reason: string;
}

/**
 * Estadísticas de pedidos
 */
export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: Record<OrderStatus, number>;
  ordersByPaymentMethod: Record<PaymentMethod, number>;
  ordersByShippingMethod: Record<ShippingMethod, number>;
  recentOrders: OrderListItem[];
  topProducts: Array<{
    productId: string;
    productName: string;
    unitsSold: number;
    revenue: number;
  }>;
}

/**
 * Resumen de pedido para email
 */
export interface OrderEmailSummary {
  orderNumber: string;
  orderDate: Date;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingAddress?: {
    street: string;
    number: string;
    city: string;
    province: string;
    postalCode: string;
  };
  paymentMethod: string;
  shippingMethod: string;
  estimatedDelivery?: string;
  trackingCode?: string;
  trackingUrl?: string;
}

export default {
  type OrderWithRelations,
  type OrderListItem,
  type OrderDetail,
  type OrderItemDetail,
  type OrderStatusChange,
  type OrderTimeline,
  type OrderFilters,
  type OrderSort,
  type OrderQuery,
  type PaginatedOrders,
  type CreateOrderData,
  type UpdateOrderStatusData,
  type RefundData,
  type OrderStats,
  type OrderEmailSummary,
};
