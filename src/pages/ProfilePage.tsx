import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth'; // <-- make sure this is from useAuth.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { InputWithIcon } from '@/components/ui/input-with-icon';
import { 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Briefcase,
  Calendar,
  AlertTriangle,
  Trash2,
  X,
  Check,
  Edit2,
  Globe as GlobeIcon,
  FileText
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
  company: z.string().min(2, {
    message: 'El nombre de la empresa debe tener al menos 2 caracteres.',
  }).optional(),
  position: z.string().min(2, {
    message: 'El cargo debe tener al menos 2 caracteres.',
  }).optional(),
  address: z.string().min(5, {
    message: 'La dirección debe tener al menos 5 caracteres.',
  }).optional(),
  bio: z.string().max(500, {
    message: 'La biografía no puede tener más de 500 caracteres.',
  }).optional(),
  website: z.string().url({
    message: 'Por favor ingresa una URL válida.',
  }).optional().or(z.literal('')),
  documentType: z.string().optional(),
  documentNumber: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      company: user?.company || '',
      position: user?.position || '',
      address: user?.address || '',
      bio: user?.bio || '',
      website: user?.website || '',
      documentType: user?.documentType || '',
      documentNumber: user?.documentNumber || '',
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
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo actualizar el perfil. Por favor, inténtalo de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    form.reset();
    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      // Add account deletion logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      await logout();
      navigate('/login');
      toast({
        title: 'Cuenta eliminada',
        description: 'Tu cuenta ha sido eliminada correctamente.',
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar la cuenta. Por favor, inténtalo de nuevo.',
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Perfil de Usuario</h2>
          <p className="text-muted-foreground">
            Gestiona la información de tu perfil y preferencias de cuenta.
          </p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Edit2 className="mr-2 h-4 w-4" />
            Editar perfil
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del perfil</CardTitle>
          <CardDescription>
            Actualiza tu información personal y preferencias de cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="space-y-8">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>
                        {user?.name?.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button type="button" variant="outline">
                        Cambiar foto
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-6 md:col-span-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Información personal</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre completo</FormLabel>
                            <FormControl>
                              <InputWithIcon
                                placeholder="Tu nombre"
                                value={field.value}
                                onChange={field.onChange}
                                disabled={!isEditing || isLoading}
                                icon={<User className="h-4 w-4 text-muted-foreground" />}
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
                              <InputWithIcon
                                type="email"
                                placeholder="correo@ejemplo.com"
                                value={field.value}
                                onChange={field.onChange}
                                disabled={!isEditing || isLoading}
                                icon={<Mail className="h-4 w-4 text-muted-foreground" />}
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
                              <InputWithIcon
                                type="tel"
                                placeholder="+1 234 567 890"
                                value={field.value}
                                onChange={field.onChange}
                                disabled={!isEditing || isLoading}
                                icon={<Phone className="h-4 w-4 text-muted-foreground" />}
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
                            <FormLabel>Compañía</FormLabel>
                            <FormControl>
                              <InputWithIcon
                                placeholder="Nombre de la compañía"
                                value={field.value}
                                onChange={field.onChange}
                                disabled={!isEditing || isLoading}
                                icon={<Building className="h-4 w-4 text-muted-foreground" />}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Información profesional</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cargo</FormLabel>
                            <FormControl>
                              <InputWithIcon
                                placeholder="Tu cargo o posición"
                                value={field.value}
                                onChange={field.onChange}
                                disabled={!isEditing || isLoading}
                                icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Información de contacto</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dirección</FormLabel>
                            <FormControl>
                              <InputWithIcon
                                placeholder="Tu dirección"
                                value={field.value}
                                onChange={field.onChange}
                                disabled={!isEditing || isLoading}
                                icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sitio Web</FormLabel>
                            <FormControl>
                              <InputWithIcon
                                placeholder="https://tu-sitio.com"
                                value={field.value}
                                onChange={field.onChange}
                                disabled={!isEditing || isLoading}
                                icon={<GlobeIcon className="h-4 w-4 text-muted-foreground" />}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Biografía</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Cuéntanos sobre ti..."
                                className="min-h-[100px]"
                                value={field.value}
                                onChange={field.onChange}
                                disabled={!isEditing || isLoading}
                              />
                            </FormControl>
                            <FormDescription>
                              Una breve descripción sobre ti y tu experiencia.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="documentType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo de Documento</FormLabel>
                              <FormControl>
                                <InputWithIcon
                                  placeholder="Ej: Cédula, Pasaporte"
                                  value={field.value}
                                  onChange={field.onChange}
                                  disabled={!isEditing || isLoading}
                                  icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="documentNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número de Documento</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Número de documento"
                                  value={field.value}
                                  onChange={field.onChange}
                                  disabled={!isEditing || isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={isLoading}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Guardar cambios
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Zona de Peligro</CardTitle>
          <CardDescription>
            Acciones que no se pueden deshacer. Ten cuidado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
            <div>
              <h4 className="font-medium text-destructive">Eliminar cuenta</h4>
              <p className="text-sm text-muted-foreground">
                Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, ten en cuenta que esta acción es permanente.
              </p>
            </div>
            <Button 
              variant="destructive" 
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
              className="whitespace-nowrap"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar cuenta
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <AlertDialogTitle>¿Estás seguro de eliminar tu cuenta?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-2">
              Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta y todos los datos asociados.
              <span className="mt-2 block font-medium">
                ¿Estás seguro de que quieres continuar?
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAccount} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : 'Sí, eliminar cuenta'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
