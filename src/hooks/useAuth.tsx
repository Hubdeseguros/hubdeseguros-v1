
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User, UserRole } from '@/types/auth';

// Context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>; // Make sure login takes two arguments
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>; // Ensure updateProfile exists
}

// Crear el contexto
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
});

// Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

// Maps the Supabase user/session object to the full User type
function mapSupabaseUserToUser(supabaseUser: any): User {
  if (!supabaseUser) return null as any;

  // User metadata (where extra values are stored)
  const meta = supabaseUser.user_metadata || {};

  return {
    id: supabaseUser.id,
    name: meta.name ?? '',
    email: supabaseUser.email,
    role: meta.role as UserRole ?? 'CLIENTE',
    level: meta.level ?? undefined,
    avatar: meta.avatar ?? undefined,
    phone: meta.phone ?? undefined,
    company: meta.company ?? undefined,
    position: meta.position ?? undefined,
    address: meta.address ?? undefined,
    bio: meta.bio ?? undefined,
    website: meta.website ?? undefined,
    documentType: meta.documentType ?? undefined,
    documentNumber: meta.documentNumber ?? undefined,
    createdAt: supabaseUser.created_at ? new Date(supabaseUser.created_at) : undefined,
    updatedAt: supabaseUser.updated_at ? new Date(supabaseUser.updated_at) : undefined,
    permissions: meta.permissions ?? [], // ADD DEFAULT
    rolePermissions: meta.rolePermissions ?? {}, // ADD DEFAULT
  };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar sesión al cargar y poblar user completo
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        if (data?.session?.user?.email) {
          setUser(mapSupabaseUserToUser(data.session.user));
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error al verificar sesión:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user?.email) {
          setUser(mapSupabaseUserToUser(session.user));
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Iniciar sesión
  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (authError) throw authError;
      
      if (data.user?.email) {
        setUser(mapSupabaseUserToUser(data.user));
      } else {
        throw new Error('El usuario no tiene un email válido');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error de autenticación';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar perfil
  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No hay usuario autenticado');
    setIsLoading(true);
    setError(null);

    try {
      // Write updates to user_metadata (Supabase)
      // NOTE: Not all providers/fields may be writable everywhere!
      const { data, error } = await supabase.auth.updateUser({
        data: {
          ...updates
        }
      });

      if (error) throw error;

      // On success, update local state.
      const updatedUser = {
        ...user,
        ...updates
      };
      setUser(updatedUser as User);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error actualizando perfil';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
