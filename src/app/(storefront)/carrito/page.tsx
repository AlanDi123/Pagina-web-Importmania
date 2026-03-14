'use client';

import { useState } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { formatARS } from '@/lib/formatters';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { PromoBar } from '@/components/storefront/PromoBar';
import { CouponInput } from '@/components/storefront/CouponInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { AppliedCoupon } from '@/types/coupon';

export default function CarritoPage() {
  const {
    items,
    coupon,
    getCart,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const cart = getCart();
  const { subtotal, totalDiscount, total } = cart;

  const handleClearCart = () => {
    if (isConfirmingClear) {
      clearCart();
      setIsConfirmingClear(false);
    } else {
      setIsConfirmingClear(true);
      setTimeout(() => setIsConfirmingClear(false), 3000);
    }
  };

  return (
    <>
      <PromoBar enabled={false} />
      <Header logo="" categories={[]} />

      <main className="py-8 min-h-[60vh]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8">Tu Carrito</h1>

          {items.length === 0 ? (
            /* Carrito vacío */
            <div className="text-center py-16">
              <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-semibold mb-2">Tu carrito está vacío</h2>
              <p className="text-muted-foreground mb-6">
                Parece que aún no agregaste ningún producto.
              </p>
              <Button asChild size="lg">
                <Link href="/productos">Explorar productos</Link>
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 border rounded-lg bg-card"
                  >
                    {/* Imagen */}
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                      {item.mainImage ? (
                        <Image
                          src={item.mainImage}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Detalles */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/productos/${item.slug}`}
                        className="font-medium hover:underline line-clamp-2"
                      >
                        {item.name}
                      </Link>

                      {item.variantName && (
                        <p className="text-sm text-muted-foreground">
                          {item.variantName}
                        </p>
                      )}

                      <p className="text-brand-primary font-semibold mt-1">
                        {formatARS(item.price)}
                      </p>

                      {/* Selector de cantidad */}
                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, Math.max(1, item.quantity - 1))
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-10 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))
                          }
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 ml-auto text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="font-semibold">{formatARS(item.subtotal)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumen */}
              <div className="space-y-6">
                <div className="p-6 border rounded-lg bg-card sticky top-24">
                  <h2 className="text-lg font-semibold mb-4">Resumen</h2>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatARS(subtotal)}</span>
                    </div>

                    {totalDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Descuento</span>
                        <span>-{formatARS(totalDiscount)}</span>
                      </div>
                    )}

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-brand-primary">{formatARS(total)}</span>
                    </div>
                  </div>

                  {/* Cupón */}
                  <div className="mt-6 space-y-3">
                    <CouponInput
                      cartTotal={subtotal}
                      appliedCoupon={coupon}
                      onCouponApply={applyCoupon}
                      onCouponRemove={removeCoupon}
                    />
                  </div>

                  <Separator className="my-6" />

                  {/* Botones */}
                  <div className="space-y-3">
                    <Button className="w-full" size="lg" asChild>
                      <Link href="/checkout">Ir a pagar</Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleClearCart}
                    >
                      {isConfirmingClear ? '¿Seguro?' : 'Vaciar carrito'}
                    </Button>
                    <Button variant="ghost" className="w-full" asChild>
                      <Link href="/productos">Seguir comprando</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer
        categories={[]}
        socialLinks={{}}
        contactInfo={{}}
      />
    </>
  );
}

export default CarritoPage;
