import { supabase } from '../lib/supabase';
import { UserRole } from '../types/auth';

export const authService = {
  async register(name: string, email: string, password: string) {
    try {
      console.log('Registrando usuario con:', { name, email });
      console.log('Usando URL de Supabase:', import.meta.env.VITE_SUPABASE_URL);
      
      // Verificar que las variables de entorno estén definidas
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        throw new Error('Faltan variables de entorno de Supabase');
      }
      
      // 1. Crear usuario en Supabase - Usando un enfoque más directo
      let userId;
      
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'X-Client-Info': 'supabase-js/2.x'
          },
          body: JSON.stringify({
            email,
            password,
            data: { name }
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error de registro:', errorData);
          
          // Si el usuario ya existe, intentamos iniciar sesión
          if (errorData.error_code === 'user_already_exists') {
            console.log('Usuario ya registrado, intentando iniciar sesión...');
            
            // Intentar iniciar sesión
            const loginResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/token?grant_type=password`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                'X-Client-Info': 'supabase-js/2.x'
              },
              body: JSON.stringify({
                email,
                password
              })
            });
            
            if (!loginResponse.ok) {
              const loginErrorData = await loginResponse.json();
              console.error('Error al iniciar sesión:', loginErrorData);
              throw new Error(`Error al iniciar sesión: ${loginErrorData.error_description || loginErrorData.msg || loginResponse.statusText}`);
            }
            
            const loginData = await loginResponse.json();
            console.log('Inicio de sesión exitoso:', loginData);
            
            // Obtener el ID del usuario
            const userResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/user`, {
              headers: {
                'Authorization': `Bearer ${loginData.access_token}`,
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
              }
            });
            
            if (!userResponse.ok) {
              const userErrorData = await userResponse.json();
              console.error('Error al obtener usuario:', userErrorData);
              throw new Error(`Error al obtener usuario: ${userErrorData.message || userResponse.statusText}`);
            }
            
            const userData = await userResponse.json();
            userId = userData.id;
            
            if (!userId) {
              throw new Error('No se pudo obtener el ID del usuario');
            }
            
            console.log('ID de usuario obtenido:', userId);
            return { success: true, userId, message: 'Usuario ya registrado, inicio de sesión exitoso' };
          } else {
            throw new Error(`Error de autenticación: ${errorData.msg || errorData.message || response.statusText}`);
          }
        }
        
        const data = await response.json();
        console.log('Respuesta de registro:', data);
        
        userId = data.user.id;
        
        if (!userId) {
          throw new Error('No se pudo obtener el ID del usuario');
        }
      } catch (error) {
        console.error('Error en autenticación:', error);
        throw error;
      }

      // 2. Crear registro en la tabla users
      try {
        // Usar fetch directamente para evitar problemas de esquema
        const userResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/usuarios`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            id: userId,
            email,
            nombre: name.split(' ')[0],
            apellido: name.split(' ').slice(1).join(' '),
            activo: true,
          })
        });
        
        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          console.error('Error al crear usuario:', errorData);
          throw new Error(`Error al crear usuario: ${errorData.message || userResponse.statusText}`);
        }
        
        console.log('Usuario creado correctamente');
      } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
      }

      // 3. Asignar rol de admin
      try {
        // Obtener el ID del rol admin
        const rolesResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/roles?name=eq.admin&select=id`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          }
        });
        
        if (!rolesResponse.ok) {
          const errorData = await rolesResponse.json();
          console.error('Error al obtener rol admin:', errorData);
          throw new Error(`Error al obtener rol admin: ${errorData.message || rolesResponse.statusText}`);
        }
        
        const roles = await rolesResponse.json();
        console.log('Roles obtenidos:', roles);
        
        if (!roles || roles.length === 0) {
          throw new Error('No se encontró el rol admin');
        }
        
        const adminRoleId = roles[0].id;
        
        // Asignar rol admin al usuario
        const roleResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/usuario_roles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            usuario_id: userId,
            rol_id: adminRoleId
          })
        });
        
        if (!roleResponse.ok) {
          const errorData = await roleResponse.json();
          console.error('Error al asignar rol admin:', errorData);
          throw new Error(`Error al asignar rol admin: ${errorData.message || roleResponse.statusText}`);
        }
        
        console.log('Rol admin asignado correctamente');
      } catch (error) {
        console.error('Error al asignar rol admin:', error);
        throw error;
      }

      // 4. Crear agencia por defecto
      try {
        const agencyName = `${name}'s Agencia`;
        
        // Crear agencia
        const agencyResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/agencias`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            nombre: agencyName,
            creado_por: userId
          })
        });
        
        if (!agencyResponse.ok) {
          const errorData = await agencyResponse.json();
          console.error('Error al crear agencia:', errorData);
          throw new Error(`Error al crear agencia: ${errorData.message || agencyResponse.statusText}`);
        }
        
        const agencyData = await agencyResponse.json();
        console.log('Agencia creada:', agencyData);
        
        if (!agencyData || agencyData.length === 0) {
          throw new Error('No se pudo crear la agencia');
        }
        
        const agencyId = agencyData[0].id;
        console.log('Agencia creada correctamente con ID:', agencyId);
        
        return agencyId;
      } catch (error) {
        console.error('Error al crear agencia:', error);
        throw error;
      }

      // 5. Crear relación de administrador (como propio admin)
      try {
        // Crear relación de administrador
        const adminRelationResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/usuarios_admin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            usuario_id: userId,
            admin_id: userId
          })
        });
        
        if (!adminRelationResponse.ok) {
          const errorData = await adminRelationResponse.json();
          console.error('Error al crear relación de administrador:', errorData);
          throw new Error(`Error al crear relación de administrador: ${errorData.message || adminRelationResponse.statusText}`);
        }
        
        console.log('Relación de administrador creada correctamente');
        
        return { success: true };
      } catch (error) {
        console.error('Error al crear relación de administrador:', error);
        throw error;
      }
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
