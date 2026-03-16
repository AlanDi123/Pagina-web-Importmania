import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'react-hot-toast';
import type { CartItemDisplay, Cart, EmptyCart, AddToCartData, CartSummary, AppliedCoupon } from '@/types/cart';
import { LIMITS, FREE_SHIPPING_MIN_AMOUNT } from '@/lib/constants';
import { formatARS } from '@/lib/formatters';

/**
 * Estado inicial del carrito vacío
 */
const emptyCart: EmptyCart = {
  items: [],
  itemsCount: 0,
  subtotal: 0,
  totalDiscount: 0,
  shippingCost: 0,
  transferDiscount: 0,
  total: 0,
  isFreeShipping: false,
  freeShippingThreshold: FREE_SHIPPING_MIN_AMOUNT,
  remainingForFreeShipping: FREE_SHIPPING_MIN_AMOUNT,
};

/**
 * Estado del store del carrito
 */
interface CartState {
  // Datos del carrito
  items: CartItemDisplay[];
  coupon: AppliedCoupon | null;
  
  // Estado de UI
  isOpen: boolean;
  isLoading: boolean;
  
  // Errores
  error: string | null;
  
  // Acciones
  addItem: (item: AddToCartData) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  incrementQuantity: (itemId: string) => void;
  decrementQuantity: (itemId: string) => void;
  clearCart: () => void;
  
  // UI actions
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  // Coupon actions
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  
  // Sync actions
  syncFromServer: (items: CartItemDisplay[]) => void;
  
  // Calculated values
  getCart: () => Cart;
  getCartSummary: () => CartSummary;
  getItemQuantity: (productId: string, variantId?: string) => number;
  isInCart: (productId: string, variantId?: string) => boolean;
}

/**
 * Calcula los totales del carrito
 */
function calculateCartTotals(
  items: CartItemDisplay[],
  coupon: AppliedCoupon | null
): Omit<Cart, 'items' | 'itemsCount'> {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  
  // Calcular descuento por cupón
  let totalDiscount = 0;
  if (coupon) {
    if (coupon.type === 'PERCENTAGE') {
      totalDiscount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscount && totalDiscount > coupon.maxDiscount) {
        totalDiscount = coupon.maxDiscount;
      }
    } else if (coupon.type === 'FIXED_AMOUNT') {
      totalDiscount = Math.min(coupon.value, subtotal);
    }
    // FREE_SHIPPING no afecta el subtotal, solo el envío
  }
  
  // Calcular envío (por ahora 0, se calcula en checkout)
  const shippingCost = 0;
  
  // Calcular descuento por transferencia (10% por defecto)
  const transferDiscount = 0; // Se calcula en checkout
  
  // Calcular total
  const total = Math.max(0, subtotal - totalDiscount + shippingCost - transferDiscount);
  
  // Calcular si tiene envío gratis
  const isFreeShipping = subtotal >= FREE_SHIPPING_MIN_AMOUNT || coupon?.type === 'FREE_SHIPPING';
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_MIN_AMOUNT - subtotal);
  
  return {
    subtotal,
    totalDiscount,
    shippingCost,
    transferDiscount,
    total,
    isFreeShipping,
    freeShippingThreshold: FREE_SHIPPING_MIN_AMOUNT,
    remainingForFreeShipping,
  };
}

/**
 * Store del carrito con Zustand + persistencia en localStorage
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      items: [],
      coupon: null,
      isOpen: false,
      isLoading: false,
      error: null,
      
      // Agregar item al carrito
      addItem: (item) => {
        const { items } = get();

        // Verificar si el producto ya está en el carrito
        const existingItemIndex = items.findIndex(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );

        let newItems: CartItemDisplay[];

        if (existingItemIndex >= 0) {
          // Actualizar cantidad del item existente
          newItems = items.map((i, index) => {
            if (index === existingItemIndex) {
              const newQuantity = Math.min(
                i.quantity + item.quantity,
                LIMITS.MAX_CART_QUANTITY
              );
              return {
                ...i,
                quantity: newQuantity,
                subtotal: newQuantity * i.price,
              };
            }
            return i;
          });
        } else {
          // Agregar nuevo item con datos completos
          const newItem: CartItemDisplay = {
            id: `temp-${Date.now()}`,
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity,
            name: item.name || '',
            slug: item.slug || '',
            sku: item.sku || '',
            price: item.price || 0,
            compareAtPrice: item.compareAtPrice || null,
            stock: item.stock || 0,
            mainImage: item.mainImage || null,
            variantName: item.variantName || null,
            variantOptions: item.variantOptions || null,
            subtotal: (item.price || 0) * item.quantity,
            discountPercentage: item.compareAtPrice
              ? Math.round(((item.compareAtPrice - (item.price || 0)) / item.compareAtPrice) * 100)
              : null,
            isAvailable: (item.stock || 0) >= item.quantity,
            isDigital: item.isDigital || false,
          };
          newItems = [...items, newItem];
        }

        set({ items: newItems });
        set({ isOpen: true }); // Abrir drawer al agregar

        toast.success('Producto agregado al carrito');
      },
      
      // Remover item del carrito
      removeItem: (itemId) => {
        const { items } = get();
        const newItems = items.filter((i) => i.id !== itemId);
        set({ items: newItems });
        toast.success('Producto eliminado del carrito');
      },
      
      // Actualizar cantidad de item
      updateQuantity: (itemId, quantity) => {
        const { items } = get();
        const newItems = items.map((i) => {
          if (i.id === itemId) {
            const newQty = Math.max(1, Math.min(quantity, LIMITS.MAX_CART_QUANTITY));
            return {
              ...i,
              quantity: newQty,
              subtotal: newQty * i.price,
            };
          }
          return i;
        });
        set({ items: newItems });
      },
      
      // Incrementar cantidad
      incrementQuantity: (itemId) => {
        const { items, updateQuantity } = get();
        const item = items.find((i) => i.id === itemId);
        if (item) {
          updateQuantity(itemId, item.quantity + 1);
        }
      },
      
      // Decrementar cantidad
      decrementQuantity: (itemId) => {
        const { items, updateQuantity, removeItem } = get();
        const item = items.find((i) => i.id === itemId);
        if (item && item.quantity > 1) {
          updateQuantity(itemId, item.quantity - 1);
        } else if (item) {
          removeItem(itemId);
        }
      },
      
      // Vaciar carrito
      clearCart: () => {
        set({ items: [], coupon: null });
        toast.success('Carrito vaciado');
      },
      
      // Toggle drawer del carrito
      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },
      
      // Abrir drawer del carrito
      openCart: () => {
        set({ isOpen: true });
      },
      
      // Cerrar drawer del carrito
      closeCart: () => {
        set({ isOpen: false });
      },
      
      // Aplicar cupón
      applyCoupon: (coupon) => {
        set({ coupon });
        if (coupon.isValid) {
          toast.success(`Cupón "${coupon.code}" aplicado`);
        } else {
          toast.error(coupon.errorMessage || 'Cupón inválido');
        }
      },
      
      // Remover cupón
      removeCoupon: () => {
        set({ coupon: null });
        toast.success('Cupón removido');
      },
      
      // Sincronizar desde servidor (cuando el usuario se loguea)
      syncFromServer: (serverItems) => {
        const { items: localItems } = get();
        
        // Fusionar items locales con los del servidor
        const mergedItems = [...serverItems];
        
        localItems.forEach((localItem) => {
          const existingIndex = mergedItems.findIndex(
            (i) => i.productId === localItem.productId && i.variantId === localItem.variantId
          );
          
          if (existingIndex >= 0) {
            // Sumar cantidades
            mergedItems[existingIndex] = {
              ...mergedItems[existingIndex],
              quantity: Math.min(
                mergedItems[existingIndex].quantity + localItem.quantity,
                LIMITS.MAX_CART_QUANTITY
              ),
            };
          } else {
            mergedItems.push(localItem);
          }
        });
        
        set({ items: mergedItems });
      },
      
      // Obtener carrito completo con totales
      getCart: () => {
        const { items, coupon } = get();
        const totals = calculateCartTotals(items, coupon);
        
        return {
          items,
          itemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
          ...totals,
        };
      },
      
      // Obtener resumen del carrito para checkout
      getCartSummary: () => {
        const { items } = get();
        const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
        const totalWeight = items.reduce((sum, item) => sum + (item.stock > 0 ? 500 : 0), 0); // Peso estimado
        
        return {
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
          })),
          subtotal,
          discount: 0,
          shippingCost: 0,
          total: subtotal,
          itemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
          totalWeight,
        };
      },
      
      // Obtener cantidad de un producto en el carrito
      getItemQuantity: (productId, variantId) => {
        const { items } = get();
        const item = items.find(
          (i) => i.productId === productId && i.variantId === variantId
        );
        return item?.quantity || 0;
      },
      
      // Verificar si un producto está en el carrito
      isInCart: (productId, variantId) => {
        const { items } = get();
        return items.some(
          (i) => i.productId === productId && i.variantId === variantId
        );
      },
    }),
    {
      name: 'importmania_cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
      }),
    }
  )
);

/**
 * Hook selector para obtener datos del carrito
 */
export const useCart = () => {
  const cart = useCartStore((state) => state.getCart());
  const itemsCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const isOpen = useCartStore((state) => state.isOpen);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  
  return {
    cart,
    itemsCount,
    isOpen,
    toggleCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
};

export default useCartStore;
