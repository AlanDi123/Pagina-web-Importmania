'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { Coupon, CouponType } from '@prisma/client';
import { toast } from 'react-hot-toast';

const couponSchema = z.object({
  code: z.string().min(1, 'El código es requerido').toUpperCase(),
  description: z.string().optional(),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING']),
  value: z.coerce.number().positive('El valor debe ser mayor a 0'),
  minPurchase: z.coerce.number().positive().optional().nullable(),
  maxDiscount: z.coerce.number().positive().optional().nullable(),
  usageLimit: z.coerce.number().int().positive().optional().nullable(),
  perUserLimit: z.coerce.number().int().positive().default(1),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  isActive: z.boolean().default(true),
  applicableCategories: z.array(z.string()).default([]),
  applicableProducts: z.array(z.string()).default([]),
});

type CouponFormData = z.infer<typeof couponSchema>;

interface CouponFormProps {
  coupon?: Coupon;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CouponFormData) => void;
}

export function CouponForm({
  coupon,
  open,
  onOpenChange,
  onSave,
}: CouponFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: coupon?.code || '',
      description: coupon?.description || '',
      type: coupon?.type || 'PERCENTAGE',
      value: coupon?.value.toNumber() || 0,
      minPurchase: coupon?.minPurchase?.toNumber() || null,
      maxDiscount: coupon?.maxDiscount?.toNumber() || null,
      usageLimit: coupon?.usageLimit || null,
      perUserLimit: coupon?.perUserLimit || 1,
      startDate: coupon?.startDate || null,
      endDate: coupon?.endDate || null,
      isActive: coupon?.isActive ?? true,
      applicableCategories: [],
      applicableProducts: [],
    },
  });

  const type = watch('type');

  const onSubmit = async (data: CouponFormData) => {
    setIsSubmitting(true);

    try {
      onSave(data);
      toast.success(coupon ? 'Cupón actualizado' : 'Cupón creado');
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{coupon ? 'Editar cupón' : 'Nuevo cupón'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4">
            {/* Código */}
            <div className="grid gap-2">
              <Label htmlFor="code">Código</Label>
              <Input
                id="code"
                {...register('code')}
                className="uppercase"
                placeholder="Ej: DESCUENTO10"
              />
              {errors.code && (
                <p className="text-sm text-destructive">{errors.code.message}</p>
              )}
            </div>

            {/* Descripción */}
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                {...register('description')}
                rows={2}
              />
            </div>

            {/* Tipo y Valor */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={type}
                  onValueChange={(value) =>
                    setValue('type', value as CouponType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Porcentaje (%)</SelectItem>
                    <SelectItem value="FIXED_AMOUNT">Monto fijo ($)</SelectItem>
                    <SelectItem value="FREE_SHIPPING">Envío gratis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="value">
                  Valor {type === 'PERCENTAGE' && '(%)'}
                </Label>
                <Input
                  id="value"
                  type="number"
                  step={type === 'PERCENTAGE' ? '1' : '0.01'}
                  {...register('value')}
                />
                {errors.value && (
                  <p className="text-sm text-destructive">{errors.value.message}</p>
                )}
              </div>
            </div>

            {/* Compra mínima y Descuento máximo */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="minPurchase">Compra mínima ($)</Label>
                <Input
                  id="minPurchase"
                  type="number"
                  step="0.01"
                  {...register('minPurchase')}
                />
              </div>
              {type === 'PERCENTAGE' && (
                <div className="grid gap-2">
                  <Label htmlFor="maxDiscount">Descuento máximo ($)</Label>
                  <Input
                    id="maxDiscount"
                    type="number"
                    step="0.01"
                    {...register('maxDiscount')}
                  />
                </div>
              )}
            </div>

            {/* Límites de uso */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="usageLimit">Límite total de usos</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  {...register('usageLimit')}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="perUserLimit">Límite por usuario</Label>
                <Input
                  id="perUserLimit"
                  type="number"
                  {...register('perUserLimit')}
                />
              </div>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Fecha de inicio</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'justify-start text-left font-normal',
                        !watch('startDate') && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {watch('startDate') ? (
                        format(watch('startDate'), 'PPP', { locale: es })
                      ) : (
                        <span>Seleccionar</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={watch('startDate') || undefined}
                      onSelect={(date) => setValue('startDate', date || null)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label>Fecha de fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'justify-start text-left font-normal',
                        !watch('endDate') && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {watch('endDate') ? (
                        format(watch('endDate'), 'PPP', { locale: es })
                      ) : (
                        <span>Seleccionar</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={watch('endDate') || undefined}
                      onSelect={(date) => setValue('endDate', date || null)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Activo */}
            <div className="flex items-center space-x-2">
              <Switch id="isActive" {...register('isActive')} />
              <Label htmlFor="isActive">Activo</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CouponForm;
