import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { authService } from '@/services/auth';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/lib/supabase';

const AdminManagement = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateAdmin = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "No estás autenticado",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // 1. Registrar el nuevo usuario
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: 'temporal123', // Se puede cambiar después
        options: {
          data: {
            name,
          },
        },
      });

      if (authError) throw authError;

      const newUserId = authData.user?.id;

      if (!newUserId) {
        throw new Error('No se pudo obtener el ID del nuevo usuario');
      }

      // 2. Asignar el rol de admin
      const { success, error: upgradeError } = await authService.upgradeToAdmin(newUserId, user.id);

      if (!success) throw new Error('No se pudo asignar el rol de admin: ' + (upgradeError ?? ''));

      // 3. Crear agencia por defecto para el nuevo admin
      const agencyName = `${name}'s Agencia`;
      const { error: agencyError } = await supabase
        .from('agencies')
        .insert([
          {
            name: agencyName,
            created_by: newUserId,
          },
        ]);

      if (agencyError) throw agencyError;

      // 4. Crear relación de administrador (el nuevo admin es su propio admin)
      const { error: adminRelationError } = await supabase
        .from('users_admin')
        .insert([
          {
            user_id: newUserId,
            admin_id: newUserId,
          },
        ]);

      if (adminRelationError) throw adminRelationError;

      toast({
        title: "Éxito",
        description: "Nuevo administrador creado exitosamente",
      });

      // Redirigir al login para que el nuevo admin pueda cambiar su contraseña
      navigate('/login');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestión de Administradores</h1>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nombre completo</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre completo"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@ejemplo.com"
          />
        </div>

        <Button
          onClick={handleCreateAdmin}
          disabled={loading || !email || !name}
        >
          {loading ? 'Creando...' : 'Crear Administrador'}
        </Button>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">
          Nota: Se enviará una contraseña temporal al nuevo administrador. 
          Deberá cambiarla después de su primer inicio de sesión.
        </p>
      </div>
    </div>
  );
};

export default AdminManagement;
