import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

// Tipos
interface UserData {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
  } | null;
}

type User = UserData | null;

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Crear el contexto
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => {},
  logout: async () => {}
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

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar sesión al cargar
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        if (data?.session?.user?.email) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email,
            user_metadata: data.session.user.user_metadata || null
          });
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
          setUser({
            id: session.user.id,
            email: session.user.email,
            user_metadata: session.user.user_metadata || null
          });
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
        setUser({
          id: data.user.id,
          email: data.user.email,
          user_metadata: data.user.user_metadata || null
        });
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

  // Valor del contexto
  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
