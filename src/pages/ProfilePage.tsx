import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, User, Mail, Phone, Building, MapPin } from 'lucide-react';

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
  email: z.string().email({
    message: 'Por favor ingresa un correo electrónico válido.',
  }),
  phone: z.string().min(8, {
    message: 'El teléfono debe tener al menos 8 dígitos.',
  }),
  company: z.string().optional(),
  position: z.string().optional(),
  address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      company: user?.company || '',
      position: user?.position || '',
      address: user?.address || '',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsLoading(true);
      await updateProfile(data);
      toast({
        title: 'Perfil actualizado',
        description: 'Tus datos se han actualizado correctamente.',
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el perfil. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const userInitials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Gestiona la información de tu cuenta y configura tus preferencias.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>
                Actualiza tu información personal y de contacto.
              </CardDescription>
            </div>
            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Editar perfil
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="space-y-8 w-full md:w-1/3">
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <Avatar className="h-32 w-32">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="text-3xl">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                      <p className="text-sm text-muted-foreground">{user?.role}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 w-full md:w-2/3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre completo</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Tu nombre"
                              {...field}
                              disabled={!isEditing || isLoading}
                              prefix={<User className="h-4 w-4 text-muted-foreground" />}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo electrónico</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="correo@ejemplo.com"
                              {...field}
                              disabled={!isEditing || isLoading}
                              prefix={<Mail className="h-4 w-4 text-muted-foreground" />}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+1 234 567 890"
                              {...field}
                              disabled={!isEditing || isLoading}
                              prefix={<Phone className="h-4 w-4 text-muted-foreground" />}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Empresa</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nombre de la empresa"
                              {...field}
                              disabled={!isEditing || isLoading}
                              prefix={<Building className="h-4 w-4 text-muted-foreground" />}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cargo</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Tu cargo"
                              {...field}
                              disabled={!isEditing || isLoading}
                              prefix={<User className="h-4 w-4 text-muted-foreground" />}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dirección</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Tu dirección"
                              {...field}
                              disabled={!isEditing || isLoading}
                              prefix={<MapPin className="h-4 w-4 text-muted-foreground" />}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {isEditing && (
                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          form.reset();
                          setIsEditing(false);
                        }}
                        disabled={isLoading}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Guardar cambios
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
