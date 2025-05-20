import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
  };
}

export interface AuthResponse {
  success: boolean;
  user?: User | null;
  error?: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Error al iniciar sesión:', error);
        return { 
          success: false, 
          error: error.message
        };
      }

      if (!data?.user) {
        return { 
          success: false, 
          error: 'No se pudo obtener la información del usuario' 
        };
      }

      return { 
        success: true, 
        user: data.user as User
      };
    } catch (error) {
      console.error('Error en inicio de sesión:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al iniciar sesión'
      };
    }
  },
  
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        console.error('Error al registrar:', error);
        return { 
          success: false, 
          error: error.message
        };
      }

      return { 
        success: true, 
        user: data.user as User
      };
    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al registrar el usuario'
      };
    }
  },
  
  async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al cerrar sesión'
      };
    }
  },
  
  async getCurrentUser(): Promise<{ success: boolean; user?: User | null; error?: string }> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      return { 
        success: true, 
        user: user as User | null 
      };
    } catch (error) {
      console.error('Error al obtener el usuario actual:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido al obtener el usuario'
      };
    }
  },
  
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error al solicitar cambio de contraseña:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al solicitar cambio de contraseña'
      };
    }
  },
  
  async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al actualizar la contraseña'
      };
    }
  }
};
