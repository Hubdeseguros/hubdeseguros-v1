import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Bell, Lock, Shield, UserCog, CreditCard, Globe } from 'lucide-react';

type SettingsSection = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  roles: string[];
  component: React.ReactNode;
};

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weeklyReport: false,
  });

  const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveNotifications = async () => {
    try {
      setIsLoading(true);
      // Here you would typically make an API call to save the notification preferences
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Preferencias guardadas',
        description: 'Tus preferencias de notificación se han actualizado correctamente.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron guardar las preferencias. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const settingsSections: SettingsSection[] = [
    {
      id: 'notifications',
      title: 'Notificaciones',
      description: 'Configura cómo y cuándo recibir notificaciones',
      icon: <Bell className="h-5 w-5" />,
      roles: ['ADMIN', 'AGENTE', 'CLIENTE'],
      component: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Preferencias de notificación</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div>
                  <Label htmlFor="email-notifications">Notificaciones por correo</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibir notificaciones importantes por correo electrónico
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.email}
                  onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between space-x-2">
                <div>
                  <Label htmlFor="push-notifications">Notificaciones push</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibir notificaciones en el navegador
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notifications.push}
                  onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between space-x-2">
                <div>
                  <Label htmlFor="weekly-report">Informe semanal</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibir un resumen semanal de actividad
                  </p>
                </div>
                <Switch
                  id="weekly-report"
                  checked={notifications.weeklyReport}
                  onCheckedChange={(checked) =>
                    handleNotificationChange('weeklyReport', checked)
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveNotifications} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar preferencias
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: 'security',
      title: 'Seguridad',
      description: 'Administra tu contraseña y seguridad de la cuenta',
      icon: <Lock className="h-5 w-5" />,
      roles: ['ADMIN', 'AGENTE', 'CLIENTE'],
      component: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Cambiar contraseña</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Contraseña actual</Label>
                <Input id="current-password" type="password" className="max-w-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva contraseña</Label>
                <Input id="new-password" type="password" className="max-w-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
                <Input id="confirm-password" type="password" className="max-w-sm" />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Actualizar contraseña
            </Button>
          </div>
        </div>
      ),
    },
    ...(user?.role === 'ADMIN' || user?.role === 'AGENCIA'
      ? [
          {
            id: 'appearance',
            title: 'Apariencia',
            description: 'Personaliza la apariencia de la aplicación',
            icon: <Globe className="h-5 w-5" />,
            roles: ['ADMIN', 'AGENTE'],
            component: (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Tema</h3>
                  <p className="text-sm text-muted-foreground">
                    Personaliza cómo se ve la aplicación en tu dispositivo.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-blue-500" />
                    <span>Tema claro</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-gray-800" />
                    <span>Tema oscuro</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                    <span>Usar la configuración del sistema</span>
                  </div>
                </div>
              </div>
            ),
          },
        ]
      : []),
    ...(user?.role === 'ADMIN'
      ? [
          {
            id: 'admin',
            title: 'Administración',
            description: 'Configuraciones avanzadas del sistema',
            icon: <Shield className="h-5 w-5" />,
            roles: ['ADMIN'],
            component: (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Configuración del sistema</h3>
                  <p className="text-sm text-muted-foreground">
                    Configuraciones avanzadas del sistema. Ten cuidado con los cambios que realices.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="maintenance">Modo mantenimiento</Label>
                      <p className="text-sm text-muted-foreground">
                        El modo mantenimiento deshabilita el acceso al público general
                      </p>
                    </div>
                    <Switch id="maintenance" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="analytics">Recopilar análisis</Label>
                      <p className="text-sm text-muted-foreground">
                        Ayúdanos a mejorar recopilando datos de uso anónimos
                      </p>
                    </div>
                    <Switch id="analytics" defaultChecked />
                  </div>
                </div>
              </div>
            ),
          },
        ]
      : []),
  ];

  // Filter sections based on user role
  const filteredSections = settingsSections.filter((section) =>
    section.roles.includes(user?.role || 'CLIENTE')
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">
          Personaliza la configuración de tu cuenta y preferencias.
        </p>
      </div>

      <Tabs defaultValue={filteredSections[0]?.id} className="space-y-6">
        <div className="space-between flex flex-col md:flex-row">
          <TabsList className="grid w-full md:grid-cols-2 lg:w-1/3">
            {filteredSections.map((section) => (
              <TabsTrigger key={section.id} value={section.id} className="justify-start">
                <span className="mr-2">{section.icon}</span>
                {section.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {filteredSections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>{section.component}</CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
