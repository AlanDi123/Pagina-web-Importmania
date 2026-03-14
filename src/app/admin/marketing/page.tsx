import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Send, BarChart3, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Marketing',
  description: 'Herramientas de marketing',
};

export default function MarketingAdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Marketing</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Newsletter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Enviar Newsletter
            </CardTitle>
            <CardDescription>
              Enviá un email a todos los suscriptores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="subject">Asunto</Label>
              <Input id="subject" placeholder="Novedades de la semana" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Contenido</Label>
              <Textarea
                id="content"
                rows={6}
                placeholder="Escribí el contenido del newsletter..."
              />
            </div>
            <Button className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Enviar newsletter
            </Button>
          </CardContent>
        </Card>

        {/* Carritos abandonados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Carritos Abandonados
            </CardTitle>
            <CardDescription>
              Recordatorios automáticos a usuarios con carritos sin completar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No hay carritos abandonados pendientes
              </p>
              <Button variant="outline">
                Ver historial
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics
            </CardTitle>
            <CardDescription>
              Accedé a las plataformas de analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" asChild>
                <a
                  href="https://analytics.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Analytics
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a
                  href="https://business.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook Business
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a
                  href="https://ads.tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TikTok Ads
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
