import { supabase } from '../lib/supabase';
import { UserRole } from '../types/auth';

export const authService = {
  async register(name: string, email: string, password: string) {
    try {
      // 1. Crear usuario en Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (authError) throw authError;

      const userId = authData.user?.id;

      if (!userId) {
        throw new Error('No se pudo obtener el ID del usuario');
      }

      // 2. Crear registro en la tabla users
      const { error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: userId,
            email,
            first_name: name.split(' ')[0],
            last_name: name.split(' ').slice(1).join(' '),
            active: true,
          },
        ]);

      if (userError) throw userError;

      // 3. Asignar rol de admin
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([
          {
            user_id: userId,
            role_id: (await supabase
              .from('roles')
              .select('id')
              .eq('name', 'admin')
              .single())?.data?.id,
          },
        ]);

      if (roleError) throw roleError;

      // 4. Crear agencia por defecto
      const agencyName = `${name}'s Agencia`;
      const { error: agencyError } = await supabase
        .from('agencies')
        .insert([
          {
            name: agencyName,
            created_by: userId,
          },
        ]);

      if (agencyError) throw agencyError;

      // 5. Crear relación de administrador (como propio admin)
      const { error: adminRelationError } = await supabase
        .from('users_admin')
        .insert([
          {
            user_id: userId,
            admin_id: userId,
          },
        ]);

      if (adminRelationError) throw adminRelationError;

      return { success: true };
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },

  async createAgency(name: string, adminId: string) {
    try {
      // Verificar si el usuario es admin
      const { data: adminData, error: adminError } = await supabase
        .from('user_roles')
        .select('role_id')
        .eq('user_id', adminId)
        .eq('role_id', (await supabase
          .from('roles')
          .select('id')
          .eq('name', 'admin')
          .single())?.data?.id);

      if (adminError) throw adminError;
      if (!adminData?.length) {
        throw new Error('No tienes permisos para crear una agencia');
      }

      // Verificar si ya tiene 3 agencias
      const { count: agencyCount } = await supabase
        .from('agencies')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', adminId);

      if (agencyCount >= 3) {
        throw new Error('Ya has alcanzado el límite máximo de 3 agencias');
      }

      // Crear la agencia
      const { error: agencyError } = await supabase
        .from('agencies')
        .insert([
          {
            name,
            created_by: adminId,
          },
        ]);

      if (agencyError) throw agencyError;

      return { success: true };
    } catch (error) {
      console.error('Error al crear agencia:', error);
      throw error;
    }
  },

  async upgradeToAdmin(userId: string, currentAdminId: string) {
    try {
      // Verificar si el usuario actual es admin
      const { data: adminData, error: adminError } = await supabase
        .from('user_roles')
        .select('role_id')
        .eq('user_id', currentAdminId)
        .eq('role_id', (await supabase
          .from('roles')
          .select('id')
          .eq('name', 'admin')
          .single())?.data?.id);

      if (adminError) throw adminError;
      if (!adminData?.length) {
        throw new Error('No tienes permisos para crear administradores');
      }

      // Verificar límite de admins por cuenta
      const { count: adminCount } = await supabase
        .from('users_admin')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', (await supabase
          .from('users_admin')
          .select('user_id')
          .eq('admin_id', currentAdminId)
          .single())?.data?.user_id);

      if (adminCount >= 3) {
        throw new Error('Ya has alcanzado el límite máximo de 3 administradores');
      }

      // Asignar rol de admin
      const { error: roleError } = await supabase
        .from('users_agency')
        .insert([
          {
            user_id: userId,
            role_id: (await supabase
              .from('roles')
              .select('id')
              .eq('name', 'admin')
              .single())?.data?.id,
          },
        ]);

      if (roleError) throw roleError;

      // Crear relación de administrador
      const { error: adminRelationError } = await supabase
        .from('users_admin')
        .insert([
          {
            user_id: (await supabase
              .from('users_admin')
              .select('user_id')
              .eq('admin_id', currentAdminId)
              .single())?.data?.user_id,
            admin_id: currentAdminId,
          },
        ]);

      if (adminRelationError) throw adminRelationError;

      return { success: true };
    } catch (error) {
      console.error('Error al actualizar a admin:', error);
      throw error;
    }
  },
};
