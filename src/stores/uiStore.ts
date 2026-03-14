import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Tema de la aplicación
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Estado del store de UI
 */
interface UIState {
  // Tema
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  
  // Mobile menu
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  
  // Search
  isSearchOpen: boolean;
  toggleSearch: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Recently viewed
  recentlyViewed: Array<{
    productId: string;
    name: string;
    slug: string;
    price: number;
    mainImage: string | null;
    viewedAt: number;
  }>;
  addRecentlyViewed: (product: {
    productId: string;
    name: string;
    slug: string;
    price: number;
    mainImage: string | null;
  }) => void;
  clearRecentlyViewed: () => void;
  
  // Cookie consent
  cookieConsent: {
    accepted: boolean;
    preferences: {
      necessary: boolean;
      analytics: boolean;
      marketing: boolean;
    };
  };
  acceptCookies: (preferences?: { analytics?: boolean; marketing?: boolean }) => void;
  
  // Promo bar
  isPromoBarDismissed: boolean;
  dismissPromoBar: () => void;
  
  // Loading states
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  
  // Global error
  error: string | null;
  setError: (error: string | null) => void;
}

/**
 * Store de UI con Zustand + persistencia
 */
export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Tema
      theme: 'system',
      setTheme: (theme) => {
        set({ theme });
        
        // Aplicar clase al documento
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        
        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
          root.classList.add(systemTheme);
        } else {
          root.classList.add(theme);
        }
        
        localStorage.setItem('importmania_theme', theme);
      },
      toggleTheme: () => {
        const { theme } = get();
        const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },
      
      // Mobile menu
      isMobileMenuOpen: false,
      toggleMobileMenu: () => {
        set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }));
      },
      openMobileMenu: () => {
        set({ isMobileMenuOpen: true });
      },
      closeMobileMenu: () => {
        set({ isMobileMenuOpen: false });
      },
      
      // Search
      isSearchOpen: false,
      toggleSearch: () => {
        set((state) => ({ isSearchOpen: !state.isSearchOpen }));
      },
      openSearch: () => {
        set({ isSearchOpen: true });
      },
      closeSearch: () => {
        set({ isSearchOpen: false });
      },
      searchQuery: '',
      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },
      
      // Recently viewed
      recentlyViewed: [],
      addRecentlyViewed: (product) => {
        const { recentlyViewed } = get();
        
        // Remover si ya existe
        const filtered = recentlyViewed.filter(
          (item) => item.productId !== product.productId
        );
        
        // Agregar al principio
        const newRecentlyViewed = [
          {
            ...product,
            viewedAt: Date.now(),
          },
          ...filtered,
        ].slice(0, 10); // Máximo 10 productos
        
        set({ recentlyViewed: newRecentlyViewed });
      },
      clearRecentlyViewed: () => {
        set({ recentlyViewed: [] });
      },
      
      // Cookie consent
      cookieConsent: {
        accepted: false,
        preferences: {
          necessary: true,
          analytics: false,
          marketing: false,
        },
      },
      acceptCookies: (preferences) => {
        set({
          cookieConsent: {
            accepted: true,
            preferences: {
              necessary: true,
              analytics: preferences?.analytics || false,
              marketing: preferences?.marketing || false,
            },
          },
        });
      },
      
      // Promo bar
      isPromoBarDismissed: false,
      dismissPromoBar: () => {
        set({ isPromoBarDismissed: true });
        localStorage.setItem('importmania_promo_bar_dismissed', 'true');
      },
      
      // Loading states
      isLoading: false,
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
      
      // Global error
      error: null,
      setError: (error) => {
        set({ error });
      },
    }),
    {
      name: 'importmania_ui',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        cookieConsent: state.cookieConsent,
        isPromoBarDismissed: state.isPromoBarDismissed,
        recentlyViewed: state.recentlyViewed,
      }),
    }
  )
);

/**
 * Hook selector para obtener datos de UI
 */
export const useUI = () => {
  const theme = useUIStore((state) => state.theme);
  const setTheme = useUIStore((state) => state.setTheme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);
  const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);
  const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu);
  const isSearchOpen = useUIStore((state) => state.isSearchOpen);
  const toggleSearch = useUIStore((state) => state.toggleSearch);
  const searchQuery = useUIStore((state) => state.searchQuery);
  const setSearchQuery = useUIStore((state) => state.setSearchQuery);
  const recentlyViewed = useUIStore((state) => state.recentlyViewed);
  const addRecentlyViewed = useUIStore((state) => state.addRecentlyViewed);
  const cookieConsent = useUIStore((state) => state.cookieConsent);
  const acceptCookies = useUIStore((state) => state.acceptCookies);
  const isPromoBarDismissed = useUIStore((state) => state.isPromoBarDismissed);
  const dismissPromoBar = useUIStore((state) => state.dismissPromoBar);
  const isLoading = useUIStore((state) => state.isLoading);
  const setLoading = useUIStore((state) => state.setLoading);
  const error = useUIStore((state) => state.error);
  const setError = useUIStore((state) => state.setError);
  
  return {
    theme,
    setTheme,
    toggleTheme,
    isMobileMenuOpen,
    toggleMobileMenu,
    isSearchOpen,
    toggleSearch,
    searchQuery,
    setSearchQuery,
    recentlyViewed,
    addRecentlyViewed,
    cookieConsent,
    acceptCookies,
    isPromoBarDismissed,
    dismissPromoBar,
    isLoading,
    setLoading,
    error,
    setError,
  };
};

/**
 * Inicializar tema desde localStorage o sistema
 */
export function initializeTheme() {
  if (typeof window === 'undefined') return;
  
  const savedTheme = localStorage.getItem('importmania_theme') as Theme | null;
  const theme = savedTheme || 'system';
  
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    root.classList.add(systemTheme);
    
    // Escuchar cambios del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (useUIStore.getState().theme === 'system') {
        root.classList.remove('light', 'dark');
        root.classList.add(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  } else {
    root.classList.add(theme);
  }
}

export default useUIStore;
