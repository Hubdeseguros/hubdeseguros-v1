import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthUser } from '@/types/role.types';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar la sesión actual
    const checkSession = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error al obtener la sesión:', error);
          return;
        }
        
        if (session?.user) {
          const userData: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            user_metadata: {
              ...(session.user.user_metadata as any),
              roles: (session.user.user_metadata as any)?.roles || [],
              must_change_password: (session.user.user_metadata as any)?.must_change_password || false,
            },
          };
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userData: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            user_metadata: {
              ...(session.user.user_metadata as any),
              roles: (session.user.user_metadata as any)?.roles || [],
              must_change_password: (session.user.user_metadata as any)?.must_change_password || false,
            },
          };
          setUser(userData);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error al cerrar sesión:', error);
      }
      setUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const value = {
    user,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
