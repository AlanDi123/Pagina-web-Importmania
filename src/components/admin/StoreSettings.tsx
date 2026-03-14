'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { toast } from 'react-hot-toast';

interface StoreSettingsProps {
  config?: Record<string, unknown>;
}

export function StoreSettings({ config = {} }: StoreSettingsProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState({
    // General
    store_name: (config.store_name as string) || 'iMPORTMANIA',
    store_slogan: (config.store_slogan as string) || 'Productos importados de calidad',
    contact_email: (config.contact_email as string) || 'hola@importmania.com.ar',
    contact_phone: (config.contact_phone as string) || '+54 11 1234-5678',
    store_address: (config.store_address as string) || 'Av. Corrientes 1234, CABA',
    store_hours: (config.store_hours as string) || 'Lun a Vie 9:00 - 18:00',
    logo: (config.logo as string) || '',
    favicon: (config.favicon as string) || '',

    // Redes
    instagram_url: (config.instagram_url as string) || '',
    facebook_url: (config.facebook_url as string) || '',
    tiktok_url: (config.tiktok_url as string) || '',
    whatsapp_number: (config.whatsapp_number as string) || '541112345678',

    // MercadoPago
    mp_access_token: (config.mp_access_token as string) || '',
    mp_public_key: (config.mp_public_key as string) || '',
    mp_webhook_secret: (config.mp_webhook_secret as string) || '',

    // Transferencia
    bank_cbu: (config.bank_cbu as string) || '',
    bank_alias: (config.bank_alias as string) || '',
    bank_holder: (config.bank_holder as string) || '',
    bank_cuit: (config.bank_cuit as string) || '',
    bank_name: (config.bank_name as string) || '',
    transfer_discount_percent: (config.transfer_discount_percent as number) || 10,

    // SEO
    seo_title: (config.seo_title as string) || '',
    seo_description: (config.seo_description as string) || '',
    ga_id: (config.ga_id as string) || '',
    fb_pixel_id: (config.fb_pixel_id as string) || '',
    tiktok_pixel_id: (config.tiktok_pixel_id as string) || '',

    // Email
    resend_api_key: (config.resend_api_key as string) || '',
    email_from: (config.email_from as string) || '',

    // Referidos
    referrals_enabled: (config.referrals_enabled as boolean) || false,
    referral_reward_type: (config.referral_reward_type as string) || 'PERCENTAGE',
    referral_reward_value: (config.referral_reward_value as number) || 10,

    // Promo Bar
    promo_bar_text: (config.promo_bar_text as string) || '',
    promo_bar_enabled: (config.promo_bar_enabled as boolean) || false,
  });

  const [logoImages, setLogoImages] = useState<Array<{ url: string; alt?: string; isMain: boolean }>>(
    settings.logo ? [{ url: settings.logo, alt: 'Logo', isMain: true }] : []
  );

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const response = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...settings,
          logo: logoImages[0]?.url || settings.logo,
        }),
      });

      if (!response.ok) throw new Error('Error al guardar');

      toast.success('Configuración guardada');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: string, value: unknown) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="social">Redes</TabsTrigger>
          <TabsTrigger value="payments">Pagos</TabsTrigger>
          <TabsTrigger value="seo">SEO & Analytics</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="referrals">Referidos</TabsTrigger>
          <TabsTrigger value="promo">Promo Bar</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información de la tienda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="store_name">Nombre</Label>
                <Input
                  id="store_name"
                  value={settings.store_name}
                  onChange={(e) => updateSetting('store_name', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="store_slogan">Slogan</Label>
                <Input
                  id="store_slogan"
                  value={settings.store_slogan}
                  onChange={(e) => updateSetting('store_slogan', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Logo</Label>
                <ImageUploader
                  images={logoImages}
                  onChange={setLogoImages}
                  bucket="store"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact_email">Email de contacto</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => updateSetting('contact_email', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact_phone">Teléfono</Label>
                <Input
                  id="contact_phone"
                  value={settings.contact_phone}
                  onChange={(e) => updateSetting('contact_phone', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="store_address">Dirección</Label>
                <Input
                  id="store_address"
                  value={settings.store_address}
                  onChange={(e) => updateSetting('store_address', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="store_hours">Horarios</Label>
                <Input
                  id="store_hours"
                  value={settings.store_hours}
                  onChange={(e) => updateSetting('store_hours', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Redes */}
        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Redes sociales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="instagram_url">Instagram URL</Label>
                <Input
                  id="instagram_url"
                  value={settings.instagram_url}
                  onChange={(e) => updateSetting('instagram_url', e.target.value)}
                  placeholder="https://instagram.com/importmania"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="facebook_url">Facebook URL</Label>
                <Input
                  id="facebook_url"
                  value={settings.facebook_url}
                  onChange={(e) => updateSetting('facebook_url', e.target.value)}
                  placeholder="https://facebook.com/importmania"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tiktok_url">TikTok URL</Label>
                <Input
                  id="tiktok_url"
                  value={settings.tiktok_url}
                  onChange={(e) => updateSetting('tiktok_url', e.target.value)}
                  placeholder="https://tiktok.com/@importmania"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="whatsapp_number">WhatsApp</Label>
                <Input
                  id="whatsapp_number"
                  value={settings.whatsapp_number}
                  onChange={(e) => updateSetting('whatsapp_number', e.target.value)}
                  placeholder="541112345678"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pagos */}
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>MercadoPago</CardTitle>
              <CardDescription>Configuración para Checkout Pro</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="mp_access_token">Access Token</Label>
                <Input
                  id="mp_access_token"
                  type="password"
                  value={settings.mp_access_token}
                  onChange={(e) => updateSetting('mp_access_token', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mp_public_key">Public Key</Label>
                <Input
                  id="mp_public_key"
                  value={settings.mp_public_key}
                  onChange={(e) => updateSetting('mp_public_key', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mp_webhook_secret">Webhook Secret</Label>
                <Input
                  id="mp_webhook_secret"
                  type="password"
                  value={settings.mp_webhook_secret}
                  onChange={(e) => updateSetting('mp_webhook_secret', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transferencia bancaria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="bank_name">Banco</Label>
                <Input
                  id="bank_name"
                  value={settings.bank_name}
                  onChange={(e) => updateSetting('bank_name', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bank_cbu">CBU</Label>
                <Input
                  id="bank_cbu"
                  value={settings.bank_cbu}
                  onChange={(e) => updateSetting('bank_cbu', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bank_alias">Alias</Label>
                <Input
                  id="bank_alias"
                  value={settings.bank_alias}
                  onChange={(e) => updateSetting('bank_alias', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bank_holder">Titular</Label>
                <Input
                  id="bank_holder"
                  value={settings.bank_holder}
                  onChange={(e) => updateSetting('bank_holder', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bank_cuit">CUIT</Label>
                <Input
                  id="bank_cuit"
                  value={settings.bank_cuit}
                  onChange={(e) => updateSetting('bank_cuit', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="transfer_discount_percent">Descuento (%)</Label>
                <Input
                  id="transfer_discount_percent"
                  type="number"
                  value={settings.transfer_discount_percent}
                  onChange={(e) =>
                    updateSetting('transfer_discount_percent', Number(e.target.value))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="seo_title">Título por defecto</Label>
                <Input
                  id="seo_title"
                  value={settings.seo_title}
                  onChange={(e) => updateSetting('seo_title', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="seo_description">Meta descripción</Label>
                <Textarea
                  id="seo_description"
                  value={settings.seo_description}
                  onChange={(e) => updateSetting('seo_description', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="ga_id">Google Analytics ID</Label>
                <Input
                  id="ga_id"
                  value={settings.ga_id}
                  onChange={(e) => updateSetting('ga_id', e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fb_pixel_id">Facebook Pixel ID</Label>
                <Input
                  id="fb_pixel_id"
                  value={settings.fb_pixel_id}
                  onChange={(e) => updateSetting('fb_pixel_id', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tiktok_pixel_id">TikTok Pixel ID</Label>
                <Input
                  id="tiktok_pixel_id"
                  value={settings.tiktok_pixel_id}
                  onChange={(e) => updateSetting('tiktok_pixel_id', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="resend_api_key">Resend API Key</Label>
                <Input
                  id="resend_api_key"
                  type="password"
                  value={settings.resend_api_key}
                  onChange={(e) => updateSetting('resend_api_key', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email_from">Email remitente</Label>
                <Input
                  id="email_from"
                  value={settings.email_from}
                  onChange={(e) => updateSetting('email_from', e.target.value)}
                  placeholder="iMPORTMANIA &lt;hola@importmania.com.ar&gt;"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Referidos */}
        <TabsContent value="referrals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Programa de referidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.referrals_enabled}
                  onCheckedChange={(checked) =>
                    updateSetting('referrals_enabled', checked)
                  }
                />
                <Label>Habilitar programa</Label>
              </div>
              <div className="grid gap-2">
                <Label>Tipo de recompensa</Label>
                <select
                  value={settings.referral_reward_type}
                  onChange={(e) =>
                    updateSetting('referral_reward_type', e.target.value)
                  }
                  className="w-full rounded-md border bg-background px-3 py-2"
                >
                  <option value="PERCENTAGE">Porcentaje</option>
                  <option value="FIXED_AMOUNT">Monto fijo</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Valor de recompensa</Label>
                <Input
                  type="number"
                  value={settings.referral_reward_value}
                  onChange={(e) =>
                    updateSetting('referral_reward_value', Number(e.target.value))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Promo Bar */}
        <TabsContent value="promo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Barra promocional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.promo_bar_enabled}
                  onCheckedChange={(checked) =>
                    updateSetting('promo_bar_enabled', checked)
                  }
                />
                <Label>Mostrar barra</Label>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="promo_bar_text">Texto</Label>
                <Input
                  id="promo_bar_text"
                  value={settings.promo_bar_text}
                  onChange={(e) => updateSetting('promo_bar_text', e.target.value)}
                  placeholder="¡Envío gratis en compras mayores a $50.000!"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? 'Guardando...' : 'Guardar configuración'}
      </Button>
    </div>
  );
}

export default StoreSettings;
