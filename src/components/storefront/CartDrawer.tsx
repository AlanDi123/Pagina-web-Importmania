'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';
import { formatARS } from '@/lib/formatters';
import { ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react';

export function CartDrawer() {
  const {
    items,
    isOpen,
    isLoading,
    coupon,
    getCart,
    closeCart,
    removeItem,
    updateQuantity,
  } = useCartStore();

  const cart = getCart();
  const { total, subtotal, totalDiscount, remainingForFreeShipping, isFreeShipping } = cart;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Tu Carrito ({items.reduce((sum, item) => sum + item.quantity, 0)})
            </span>
            <Button variant="ghost" size="icon" onClick={closeCart}>
              <X className="h-5 w-5" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          /* Carrito vacío */
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Tu carrito está vacío</h3>
            <p className="text-muted-foreground mb-6">
              Parece que aún no agregaste ningún producto.
            </p>
            <Button asChild>
              <Link href="/productos">Explorar productos</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Items del carrito */}
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 bg-card rounded-lg p-3 border"
                  >
                    {/* Imagen */}
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                      {item.mainImage ? (
                        <Image
                          src={item.mainImage}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <ShoppingBag className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    {/* Detalles */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/productos/${item.slug}`}
                        className="font-medium hover:underline line-clamp-2"
                        onClick={closeCart}
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
                      <div className="flex items-center gap-2 mt-2">
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
                        <span className="w-8 text-center text-sm font-medium">
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
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer con totales */}
            <SheetFooter className="border-t pt-4 mt-auto">
              <div className="w-full space-y-3">
                {/* Cupón aplicado */}
                {coupon && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600">
                      Cupón: {coupon.code}
                    </span>
                    <span className="text-green-600 font-medium">
                      -{formatARS(coupon.discountAmount)}
                    </span>
                  </div>
                )}

                {/* Envío gratis */}
                {!isFreeShipping && remainingForFreeShipping > 0 && (
                  <p className="text-sm text-muted-foreground">
                    ¡Te faltan {formatARS(remainingForFreeShipping)} para envío gratis!
                  </p>
                )}
                {isFreeShipping && (
                  <p className="text-sm text-green-600 font-medium">
                    ¡Tenés envío gratis! 🎉
                  </p>
                )}

                <Separator />

                {/* Subtotal y Total */}
                <div className="space-y-2">
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
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-brand-primary">{formatARS(total)}</span>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button variant="outline" asChild>
                    <Link href="/carrito" onClick={closeCart}>
                      Ver carrito
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/checkout">Ir a pagar</Link>
                  </Button>
                </div>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default CartDrawer;
