import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

/**
 * Item de la lista de deseos
 */
export interface WishlistItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  mainImage: string | null;
  isAvailable: boolean;
  stock: number;
  averageRating: number;
  addedAt: number; // timestamp
}

/**
 * Estado del store de wishlist
 */
interface WishlistState {
  // Datos
  items: WishlistItem[];
  
  // Estado de UI
  isLoading: boolean;
  
  // Acciones
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeItem: (productId: string) => void;
  toggleItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  getItemCount: () => number;
  getItems: () => WishlistItem[];
}

/**
 * Store de wishlist con Zustand + persistencia en localStorage
 */
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      items: [],
      isLoading: false,
      
      // Agregar item a la wishlist
      addItem: (item) => {
        const { items } = get();
        
        // Verificar si ya está en la wishlist
        const exists = items.some((i) => i.productId === item.productId);
        
        if (exists) {
          toast.info('Este producto ya está en tu lista de deseos');
          return;
        }
        
        const newItem: WishlistItem = {
          ...item,
          addedAt: Date.now(),
        };
        
        set({ items: [...items, newItem] });
        toast.success('Agregado a tu lista de deseos');
      },
      
      // Remover item de la wishlist
      removeItem: (productId) => {
        const { items } = get();
        const newItems = items.filter((i) => i.productId !== productId);
        set({ items: newItems });
        toast.success('Eliminado de tu lista de deseos');
      },
      
      // Toggle (agregar o remover)
      toggleItem: (item) => {
        const { items, addItem, removeItem } = get();
        const exists = items.some((i) => i.productId === item.productId);
        
        if (exists) {
          removeItem(item.productId);
        } else {
          addItem(item);
        }
      },
      
      // Vaciar wishlist
      clearWishlist: () => {
        set({ items: [] });
        toast.success('Lista de deseos vaciada');
      },
      
      // Verificar si un producto está en la wishlist
      isInWishlist: (productId) => {
        const { items } = get();
        return items.some((i) => i.productId === productId);
      },
      
      // Obtener cantidad de items
      getItemCount: () => {
        const { items } = get();
        return items.length;
      },
      
      // Obtener todos los items
      getItems: () => {
        const { items } = get();
        return items;
      },
    }),
    {
      name: 'importmania_wishlist',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);

/**
 * Hook selector para obtener datos de la wishlist
 */
export const useWishlist = () => {
  const items = useWishlistStore((state) => state.items);
  const isLoading = useWishlistStore((state) => state.isLoading);
  const addItem = useWishlistStore((state) => state.addItem);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const getItemCount = useWishlistStore((state) => state.getItemCount);
  
  return {
    items,
    isLoading,
    addItem,
    removeItem,
    toggleItem,
    clearWishlist,
    isInWishlist,
    itemCount: getItemCount(),
  };
};

export default useWishlistStore;
