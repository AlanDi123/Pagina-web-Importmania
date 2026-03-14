/**
 * Utilidades para analytics y tracking
 * Google Analytics 4, Facebook Pixel, TikTok Pixel
 */

import { ANALYTICS_EVENTS } from '@/lib/constants';

/**
 * Verifica si los analytics están habilitados
 */
export function isAnalyticsEnabled(): boolean {
  return !!process.env.NEXT_PUBLIC_GA_ID;
}

/**
 * Verifica si Facebook Pixel está configurado
 */
export function isFacebookPixelEnabled(): boolean {
  return !!process.env.NEXT_PUBLIC_FB_PIXEL_ID;
}

/**
 * Verifica si TikTok Pixel está configurado
 */
export function isTikTokPixelEnabled(): boolean {
  return !!process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
}

/**
 * Envía evento de pageview a Google Analytics
 */
export function trackPageView(url: string, title?: string) {
  if (!isAnalyticsEnabled()) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).gtag?.('config', process.env.NEXT_PUBLIC_GA_ID!, {
    page_path: url,
    page_title: title,
  });
}

/**
 * Envía evento custom a Google Analytics
 */
export function trackGAEvent(
  eventName: string,
  eventParams?: Record<string, unknown>
) {
  if (!isAnalyticsEnabled()) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).gtag?.('event', eventName, eventParams);
}

/**
 * Envía evento a Facebook Pixel
 */
export function trackFacebookEvent(
  eventName: string,
  eventData?: Record<string, unknown>
) {
  if (!isFacebookPixelEnabled()) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).fbq?.('track', eventName, eventData);
}

/**
 * Envía evento a TikTok Pixel
 */
export function trackTikTokEvent(
  eventName: string,
  eventData?: Record<string, unknown>
) {
  if (!isTikTokPixelEnabled()) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).ttq?.track(eventName, eventData);
}

/**
 * Trackea evento de vista de producto
 */
export function trackViewItem(product: {
  id: string;
  name: string;
  price: number;
  category?: string;
  quantity?: number;
}) {
  const eventData = {
    currency: 'ARS',
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        item_category: product.category,
        quantity: product.quantity || 1,
      },
    ],
  };

  trackGAEvent(ANALYTICS_EVENTS.VIEW_ITEM, eventData);
  trackFacebookEvent('ViewContent', eventData);
  trackTikTokEvent('ViewContent', eventData);
}

/**
 * Trackea evento de agregar al carrito
 */
export function trackAddToCart(product: {
  id: string;
  name: string;
  price: number;
  category?: string;
  quantity: number;
}) {
  const eventData = {
    currency: 'ARS',
    value: product.price * product.quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        item_category: product.category,
        quantity: product.quantity,
      },
    ],
  };

  trackGAEvent(ANALYTICS_EVENTS.ADD_TO_CART, eventData);
  trackFacebookEvent('AddToCart', eventData);
  trackTikTokEvent('AddToCart', eventData);
}

/**
 * Trackea evento de remover del carrito
 */
export function trackRemoveFromCart(product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) {
  const eventData = {
    currency: 'ARS',
    value: product.price * product.quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: product.quantity,
      },
    ],
  };

  trackGAEvent(ANALYTICS_EVENTS.REMOVE_FROM_CART, eventData);
  trackFacebookEvent('RemoveFromCart', eventData);
}

/**
 * Trackea evento de inicio de checkout
 */
export function trackBeginCheckout(cart: {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  coupon?: string;
}) {
  const eventData = {
    currency: 'ARS',
    value: cart.total,
    coupon: cart.coupon,
    items: cart.items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  };

  trackGAEvent(ANALYTICS_EVENTS.BEGIN_CHECKOUT, eventData);
  trackFacebookEvent('InitiateCheckout', eventData);
  trackTikTokEvent('InitiateCheckout', eventData);
}

/**
 * Trackea evento de agregar información de pago
 */
export function trackAddPaymentInfo(paymentMethod: string) {
  const eventData = {
    currency: 'ARS',
    payment_type: paymentMethod,
  };

  trackGAEvent(ANALYTICS_EVENTS.ADD_PAYMENT_INFO, eventData);
  trackFacebookEvent('AddPaymentInfo', eventData);
}

/**
 * Trackea evento de agregar información de envío
 */
export function trackAddShippingInfo(shippingData: {
  shipping_tier: string;
  value: number;
}) {
  const eventData = {
    currency: 'ARS',
    value: shippingData.value,
    shipping_tier: shippingData.shipping_tier,
  };

  trackGAEvent(ANALYTICS_EVENTS.ADD_SHIPPING_INFO, eventData);
  trackFacebookEvent('AddShippingInfo', eventData);
}

/**
 * Trackea evento de compra completada
 */
export function trackPurchase(order: {
  orderNumber: string;
  total: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  shipping?: number;
  tax?: number;
  coupon?: string;
}) {
  const eventData = {
    transaction_id: order.orderNumber,
    currency: 'ARS',
    value: order.total,
    shipping: order.shipping,
    tax: order.tax,
    coupon: order.coupon,
    items: order.items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  };

  trackGAEvent(ANALYTICS_EVENTS.PURCHASE, eventData);
  trackFacebookEvent('Purchase', eventData);
  trackTikTokEvent('CompletePayment', eventData);
}

/**
 * Trackea evento de búsqueda
 */
export function trackSearch(searchTerm: string, resultsCount?: number) {
  const eventData = {
    search_term: searchTerm,
    num_results: resultsCount,
  };

  trackGAEvent(ANALYTICS_EVENTS.SEARCH, eventData);
  trackFacebookEvent('Search', eventData);
}

/**
 * Trackea evento de vista de lista de productos
 */
export function trackViewItemList(listName: string, products: Array<{
  id: string;
  name: string;
  price: number;
  category?: string;
  index: number;
}>) {
  const eventData = {
    item_list_name: listName,
    items: products.map((product) => ({
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      item_category: product.category,
      index: product.index,
    })),
  };

  trackGAEvent(ANALYTICS_EVENTS.VIEW_ITEM_LIST, eventData);
  trackFacebookEvent('ViewContent', eventData);
}

/**
 * Trackea evento de selección de producto
 */
export function trackSelectItem(product: {
  id: string;
  name: string;
  category?: string;
  listName?: string;
}) {
  const eventData = {
    item_id: product.id,
    item_name: product.name,
    item_category: product.category,
    item_list_name: product.listName,
  };

  trackGAEvent(ANALYTICS_EVENTS.SELECT_ITEM, eventData);
  trackFacebookEvent('ViewContent', eventData);
}

/**
 * Trackea evento de vista del carrito
 */
export function trackViewCart(cart: {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
}) {
  const eventData = {
    currency: 'ARS',
    value: cart.total,
    items: cart.items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  };

  trackGAEvent(ANALYTICS_EVENTS.VIEW_CART, eventData);
}

/**
 * Trackea evento de agregar a favoritos
 */
export function trackAddToWishlist(product: {
  id: string;
  name: string;
  price: number;
  category?: string;
}) {
  const eventData = {
    currency: 'ARS',
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        item_category: product.category,
      },
    ],
  };

  trackGAEvent(ANALYTICS_EVENTS.ADD_TO_WISHLIST, eventData);
  trackFacebookEvent('AddToWishlist', eventData);
}

/**
 * Trackea evento de registro
 */
export function trackSignUp(method: string = 'email') {
  const eventData = {
    method,
  };

  trackGAEvent(ANALYTICS_EVENTS.SIGN_UP, eventData);
  trackFacebookEvent('CompleteRegistration', eventData);
  trackTikTokEvent('CompleteRegistration', eventData);
}

/**
 * Trackea evento de login
 */
export function trackLogin(method: string = 'email') {
  const eventData = {
    method,
  };

  trackGAEvent(ANALYTICS_EVENTS.LOGIN, eventData);
  trackFacebookEvent('Login', eventData);
}

/**
 * Trackea evento de contacto
 */
export function trackContact(method: string = 'whatsapp') {
  const eventData = {
    method,
  };

  trackGAEvent(ANALYTICS_EVENTS.CONTACT, eventData);
  trackFacebookEvent('Contact', eventData);
}

/**
 * Inicializa los scripts de analytics
 * Se debe llamar en el layout principal
 */
export function initializeAnalytics() {
  if (typeof window === 'undefined') return;

  // Google Analytics
  if (isAnalyticsEnabled() && process.env.NEXT_PUBLIC_GA_ID) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
    document.head.appendChild(script);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).dataLayer = (window as any).dataLayer || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).gtag = function () {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).dataLayer.push(arguments);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).gtag('js', new Date());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID);
  }

  // Facebook Pixel
  if (isFacebookPixelEnabled() && process.env.NEXT_PUBLIC_FB_PIXEL_ID) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).fbq = function () {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).fbq.callMethod
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).fbq.callMethod.apply((window as any).fbq, arguments)
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).fbq.queue.push(arguments);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(window as any).fbq) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).fbq = { queue: [] };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).fbq.version = '2.0';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).fbq.queue = [];

    const fbScript = document.createElement('script');
    fbScript.async = true;
    fbScript.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(fbScript);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).fbq('init', process.env.NEXT_PUBLIC_FB_PIXEL_ID);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).fbq('track', 'PageView');
  }

  // TikTok Pixel
  if (isTikTokPixelEnabled() && process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).ttq = function () {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).ttq.queue.push(arguments);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).ttq.queue = [];

    const ttScript = document.createElement('script');
    ttScript.async = true;
    ttScript.src = 'https://analytics.tiktok.com/i18n/pixel/events.js';
    document.head.appendChild(ttScript);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).ttq.load(process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).ttq.track('PageView');
  }
}

export default {
  isAnalyticsEnabled,
  isFacebookPixelEnabled,
  isTikTokPixelEnabled,
  trackPageView,
  trackGAEvent,
  trackFacebookEvent,
  trackTikTokEvent,
  trackViewItem,
  trackAddToCart,
  trackRemoveFromCart,
  trackBeginCheckout,
  trackAddPaymentInfo,
  trackAddShippingInfo,
  trackPurchase,
  trackSearch,
  trackViewItemList,
  trackSelectItem,
  trackViewCart,
  trackAddToWishlist,
  trackSignUp,
  trackLogin,
  trackContact,
  initializeAnalytics,
};
