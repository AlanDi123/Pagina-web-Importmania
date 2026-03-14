'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ShippingZoneWithRates, ShippingMethod } from '@/types/shipping';
import { toast } from 'react-hot-toast';
import { Plus, X, Edit, Trash2 } from 'lucide-react';

const ARGENTINA_PROVINCES = [
  'Buenos Aires',
  'Ciudad Autónoma de Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
];

const SHIPPING_METHODS: { value: ShippingMethod; label: string }[] = [
  { value: 'HOME_DELIVERY', label: 'Envío a domicilio' },
  { value: 'ANDREANI', label: 'Andreani' },
  { value: 'OCA', label: 'OCA' },
  { value: 'CORREO_ARGENTINO', label: 'Correo Argentino' },
  { value: 'PICKUP', label: 'Retiro en persona' },
];

interface ShippingZoneManagerProps {
  zones?: ShippingZoneWithRates[];
}

interface ShippingRateFormData {
  method: ShippingMethod;
  name: string;
  price: number;
  freeAbove?: number | null;
  estimatedDays: string;
  maxWeight?: number | null;
  isActive: boolean;
}

export function ShippingZoneManager({ zones = [] }: ShippingZoneManagerProps) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [isZoneDialogOpen, setIsZoneDialogOpen] = useState(false);
  const [isRateDialogOpen, setIsRateDialogOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<ShippingRateFormData | null>(null);

  const [zoneForm, setZoneForm] = useState({
    name: '',
    provinces: [] as string[],
    postalCodes: [] as string[],
    isActive: true,
  });

  const [rateForm, setRateForm] = useState<ShippingRateFormData>({
    method: 'HOME_DELIVERY',
    name: '',
    price: 0,
    freeAbove: null,
    estimatedDays: '',
    maxWeight: null,
    isActive: true,
  });

  const handleCreateZone = async () => {
    try {
      const response = await fetch('/api/envios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(zoneForm),
      });

      if (!response.ok) throw new Error('Error al crear zona');

      toast.success('Zona creada');
      setZoneForm({ name: '', provinces: [], postalCodes: [], isActive: true });
      setIsZoneDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al crear zona');
    }
  };

  const handleAddRate = async () => {
    try {
      const response = await fetch(`/api/envios/rates?zoneId=${selectedZone}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rateForm),
      });

      if (!response.ok) throw new Error('Error al agregar tarifa');

      toast.success('Tarifa agregada');
      setRateForm({
        method: 'HOME_DELIVERY',
        name: '',
        price: 0,
        freeAbove: null,
        estimatedDays: '',
        maxWeight: null,
        isActive: true,
      });
      setIsRateDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al agregar tarifa');
    }
  };

  const handleProvinceToggle = (province: string) => {
    setZoneForm((prev) => ({
      ...prev,
      provinces: prev.provinces.includes(province)
        ? prev.provinces.filter((p) => p !== province)
        : [...prev.provinces, province],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Zonas de envío</h2>
          <p className="text-muted-foreground">
            Configurá las zonas y tarifas de envío para tu tienda
          </p>
        </div>
        <Dialog open={isZoneDialogOpen} onOpenChange={setIsZoneDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva zona
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva zona de envío</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="zoneName">Nombre</Label>
                <Input
                  id="zoneName"
                  value={zoneForm.name}
                  onChange={(e) =>
                    setZoneForm({ ...zoneForm, name: e.target.value })
                  }
                  placeholder="Ej: AMBA, Interior, Patagonia"
                />
              </div>
              <div className="grid gap-2">
                <Label>Provincias</Label>
                <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto border rounded p-2">
                  {ARGENTINA_PROVINCES.map((province) => (
                    <label
                      key={province}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={zoneForm.provinces.includes(province)}
                        onChange={() => handleProvinceToggle(province)}
                      />
                      <span>{province}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {zoneForm.provinces.length} provincias seleccionadas
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={zoneForm.isActive}
                  onCheckedChange={(checked) =>
                    setZoneForm({ ...zoneForm, isActive: checked })
                  }
                />
                <Label>Activa</Label>
              </div>
              <Button onClick={handleCreateZone}>Crear zona</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Zonas */}
      <Accordion type="single" collapsible value={selectedZone || undefined} onValueChange={setSelectedZone}>
        {zones.map((zone) => (
          <AccordionItem key={zone.id} value={zone.id}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-medium">{zone.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {zone.provinces.join(', ')}
                  </p>
                </div>
                <Badge variant={zone.isActive ? 'default' : 'secondary'}>
                  {zone.isActive ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {/* Tarifas */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Tarifas</h4>
                  <Dialog open={isRateDialogOpen} onOpenChange={(open) => {
                    setIsRateDialogOpen(open);
                    if (!open) setEditingRate(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar tarifa
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingRate ? 'Editar tarifa' : 'Nueva tarifa'}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label>Método de envío</Label>
                          <Select
                            value={rateForm.method}
                            onValueChange={(value) =>
                              setRateForm({ ...rateForm, method: value as ShippingMethod })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {SHIPPING_METHODS.map((method) => (
                                <SelectItem key={method.value} value={method.value}>
                                  {method.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="rateName">Nombre</Label>
                          <Input
                            id="rateName"
                            value={rateForm.name}
                            onChange={(e) =>
                              setRateForm({ ...rateForm, name: e.target.value })
                            }
                            placeholder="Ej: Envío Estándar"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="ratePrice">Precio ($)</Label>
                          <Input
                            id="ratePrice"
                            type="number"
                            value={rateForm.price}
                            onChange={(e) =>
                              setRateForm({ ...rateForm, price: Number(e.target.value) })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="freeAbove">Envío gratis desde ($)</Label>
                          <Input
                            id="freeAbove"
                            type="number"
                            value={rateForm.freeAbove || ''}
                            onChange={(e) =>
                              setRateForm({
                                ...rateForm,
                                freeAbove: e.target.value ? Number(e.target.value) : null,
                              })
                            }
                            placeholder="Opcional"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="estimatedDays">Tiempo estimado</Label>
                          <Input
                            id="estimatedDays"
                            value={rateForm.estimatedDays}
                            onChange={(e) =>
                              setRateForm({ ...rateForm, estimatedDays: e.target.value })
                            }
                            placeholder="Ej: 2-3 días hábiles"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={rateForm.isActive}
                            onCheckedChange={(checked) =>
                              setRateForm({ ...rateForm, isActive: checked })
                            }
                          />
                          <Label>Activa</Label>
                        </div>
                        <Button onClick={handleAddRate}>
                          {editingRate ? 'Actualizar' : 'Agregar'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Método</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Envío gratis desde</TableHead>
                      <TableHead>Tiempo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {zone.rates.map((rate) => (
                      <TableRow key={rate.id}>
                        <TableCell>
                          {SHIPPING_METHODS.find((m) => m.value === rate.method)?.label}
                        </TableCell>
                        <TableCell>{rate.name}</TableCell>
                        <TableCell>${rate.price.toNumber()}</TableCell>
                        <TableCell>
                          {rate.freeAbove ? `$${rate.freeAbove.toNumber()}` : '-'}
                        </TableCell>
                        <TableCell>{rate.estimatedDays}</TableCell>
                        <TableCell>
                          <Badge variant={rate.isActive ? 'default' : 'secondary'}>
                            {rate.isActive ? 'Activa' : 'Inactiva'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingRate({
                                method: rate.method,
                                name: rate.name,
                                price: rate.price.toNumber(),
                                freeAbove: rate.freeAbove?.toNumber() || null,
                                estimatedDays: rate.estimatedDays,
                                maxWeight: rate.maxWeight?.toNumber() || null,
                                isActive: rate.isActive,
                              });
                              setIsRateDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Retiro en persona */}
      <Card>
        <CardHeader>
          <CardTitle>Retiro en persona</CardTitle>
          <CardDescription>
            Configurá la dirección y horarios para retiro en tienda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="pickupAddress">Dirección</Label>
            <Input id="pickupAddress" placeholder="Av. Corrientes 1234, CABA" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="pickupCity">Ciudad</Label>
              <Input id="pickupCity" placeholder="CABA" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pickupPostalCode">Código postal</Label>
              <Input id="pickupPostalCode" placeholder="1043" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pickupHours">Horarios de atención</Label>
            <Input id="pickupHours" placeholder="Lun a Vie 9:00 - 18:00" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pickupPhone">Teléfono</Label>
            <Input id="pickupPhone" placeholder="+54 11 1234-5678" />
          </div>
          <Button>Guardar configuración</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default ShippingZoneManager;
