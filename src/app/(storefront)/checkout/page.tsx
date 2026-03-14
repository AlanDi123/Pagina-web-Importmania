'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/stores/cartStore';
import { formatARS } from '@/lib/formatters';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { PromoBar } from '@/components/storefront/PromoBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'react-hot-toast';
import { ShoppingBag, Truck, CreditCard, CheckCircle } from 'lucide-react';
import Link from 'next/link';

type Step = 'address' | 'shipping' | 'payment' | 'review';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { getCart, clearCart } = useCartStore();
  const cart = getCart();

  const [currentStep, setCurrentStep] = useState<Step>('address');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [address, setAddress] = useState({
    street: '',
    number: '',
    floor: '',
    apartment: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
    notes: '',
  });

  const [shippingMethod, setShippingMethod] = useState('HOME_DELIVERY');
  const [paymentMethod, setPaymentMethod] = useState('MERCADOPAGO');
  const [couponCode, setCouponCode] = useState('');

  const { subtotal, total, items } = cart;

  // Redirect si no hay sesión o carrito vacío
  useEffect(() => {
    if (!session) {
      router.push('/login?redirect=/checkout');
    }
    if (items.length === 0) {
      router.push('/carrito');
    }
  }, [session, items.length, router]);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addressId: null,
          shippingMethod,
          paymentMethod,
          couponCode: couponCode || undefined,
          notes: address.notes,
          address: shippingMethod !== 'PICKUP' ? address : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear pedido');
      }

      // Si es MercadoPago, redirigir al checkout
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        // Éxito directo
        clearCart();
        router.push(`/checkout/success?order=${data.orderNumber}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al procesar pedido');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 'address', label: 'Dirección', icon: Truck },
    { id: 'shipping', label: 'Envío', icon: ShoppingBag },
    { id: 'payment', label: 'Pago', icon: CreditCard },
    { id: 'review', label: 'Confirmar', icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  if (!session || items.length === 0) {
    return null;
  }

  return (
    <>
      <PromoBar enabled={false} />
      <Header logo="" categories={[]} />

      <main className="py-8">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

          {/* Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      index <= currentStepIndex
                        ? 'border-brand-primary bg-brand-primary text-white'
                        : 'border-muted-foreground text-muted-foreground'
                    }`}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      index <= currentStepIndex
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                  </span>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-0.5 mx-4 ${
                        index < currentStepIndex
                          ? 'bg-brand-primary'
                          : 'bg-muted-foreground'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulario */}
            <div className="lg:col-span-2">
              {currentStep === 'address' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Dirección de envío</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-3">
                        <Label htmlFor="street">Calle</Label>
                        <Input
                          id="street"
                          value={address.street}
                          onChange={(e) =>
                            setAddress({ ...address, street: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="number">Número</Label>
                        <Input
                          id="number"
                          value={address.number}
                          onChange={(e) =>
                            setAddress({ ...address, number: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="floor">Piso</Label>
                        <Input
                          id="floor"
                          value={address.floor}
                          onChange={(e) =>
                            setAddress({ ...address, floor: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="apartment">Depto</Label>
                        <Input
                          id="apartment"
                          value={address.apartment}
                          onChange={(e) =>
                            setAddress({ ...address, apartment: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Ciudad</Label>
                        <Input
                          id="city"
                          value={address.city}
                          onChange={(e) =>
                            setAddress({ ...address, city: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="province">Provincia</Label>
                        <Input
                          id="province"
                          value={address.province}
                          onChange={(e) =>
                            setAddress({ ...address, province: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="postalCode">Código postal</Label>
                        <Input
                          id="postalCode"
                          value={address.postalCode}
                          onChange={(e) =>
                            setAddress({ ...address, postalCode: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          value={address.phone}
                          onChange={(e) =>
                            setAddress({ ...address, phone: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="notes">Notas (opcional)</Label>
                      <Textarea
                        id="notes"
                        value={address.notes}
                        onChange={(e) =>
                          setAddress({ ...address, notes: e.target.value })
                        }
                        rows={3}
                      />
                    </div>
                    <Button
                      onClick={() => setCurrentStep('shipping')}
                      className="w-full"
                    >
                      Continuar
                    </Button>
                  </CardContent>
                </Card>
              )}

              {currentStep === 'shipping' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Método de envío</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup
                      value={shippingMethod}
                      onValueChange={setShippingMethod}
                    >
                      <div className="flex items-center space-x-2 border p-4 rounded-lg">
                        <RadioGroupItem value="HOME_DELIVERY" id="home" />
                        <Label htmlFor="home" className="flex-1 cursor-pointer">
                          <p className="font-medium">Envío a domicilio</p>
                          <p className="text-sm text-muted-foreground">
                            2-3 días hábiles
                          </p>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-4 rounded-lg">
                        <RadioGroupItem value="PICKUP" id="pickup" />
                        <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                          <p className="font-medium">Retiro en persona</p>
                          <p className="text-sm text-muted-foreground">
                            Av. Corrientes 1234, CABA
                          </p>
                        </Label>
                      </div>
                    </RadioGroup>
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep('address')}
                      >
                        Volver
                      </Button>
                      <Button
                        onClick={() => setCurrentStep('payment')}
                        className="flex-1"
                      >
                        Continuar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 'payment' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Método de pago</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                    >
                      <div className="flex items-center space-x-2 border p-4 rounded-lg">
                        <RadioGroupItem value="MERCADOPAGO" id="mp" />
                        <Label htmlFor="mp" className="flex-1 cursor-pointer">
                          <p className="font-medium">MercadoPago</p>
                          <p className="text-sm text-muted-foreground">
                            Tarjetas, débito, efectivo
                          </p>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-4 rounded-lg">
                        <RadioGroupItem value="TRANSFER" id="transfer" />
                        <Label htmlFor="transfer" className="flex-1 cursor-pointer">
                          <p className="font-medium">Transferencia bancaria</p>
                          <p className="text-sm text-muted-foreground">
                            10% de descuento
                          </p>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-4 rounded-lg">
                        <RadioGroupItem value="CASH" id="cash" />
                        <Label htmlFor="cash" className="flex-1 cursor-pointer">
                          <p className="font-medium">Efectivo</p>
                          <p className="text-sm text-muted-foreground">
                            Solo con retiro en persona
                          </p>
                        </Label>
                      </div>
                    </RadioGroup>
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep('shipping')}
                      >
                        Volver
                      </Button>
                      <Button
                        onClick={() => setCurrentStep('review')}
                        className="flex-1"
                      >
                        Continuar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 'review' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Confirmar pedido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Dirección</h4>
                      <p className="text-sm text-muted-foreground">
                        {address.street} {address.number}
                        {address.floor && `, Piso ${address.floor}`}
                        {address.apartment && `, Dpto ${address.apartment}`}
                        <br />
                        {address.city}, {address.province}
                        <br />
                        {address.postalCode}
                      </p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-medium">Envío</h4>
                      <p className="text-sm text-muted-foreground">
                        {shippingMethod === 'HOME_DELIVERY'
                          ? 'Envío a domicilio'
                          : 'Retiro en persona'}
                      </p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-medium">Pago</h4>
                      <p className="text-sm text-muted-foreground">
                        {paymentMethod === 'MERCADOPAGO'
                          ? 'MercadoPago'
                          : paymentMethod === 'TRANSFER'
                          ? 'Transferencia bancaria'
                          : 'Efectivo'}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep('payment')}
                      >
                        Volver
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        {isSubmitting ? 'Procesando...' : 'Confirmar pedido'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Resumen */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Resumen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span>{formatARS(item.subtotal)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatARS(subtotal)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-brand-primary">{formatARS(total)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer categories={[]} socialLinks={{}} contactInfo={{}} />
    </>
  );
}

export default CheckoutPage;
