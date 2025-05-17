
import { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole, UserLevel } from '../types/auth';
import { handleLogin, handleLogout, handleUpdateProfile } from './auth/authUtils';

// Eliminar la importación de mockUsers ya que no se usa directamente
// y se maneja a través de las funciones de autenticación

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  error: string | null;
}

// Datos de usuarios de prueba
const mockUsers = [
  { 
    id: '1', 
    name: 'Cliente Demo', 
    email: 'cliente@demo.com', 
    password: 'password', 
    role: 'CLIENTE' as UserRole,
    level: 'BASICO' as UserLevel,
    phone: '+57 123 456 7890',
    company: 'Empresa del Cliente',
    position: 'Gerente',
    address: 'Calle 123 #45-67, Bogotá',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cliente',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: '2', 
    name: 'Agente Demo', 
    email: 'agente@demo.com', 
    password: 'password', 
    role: 'AGENTE' as UserRole,
    level: 'INTERMEDIO' as UserLevel,
    phone: '+57 123 456 7891',
    company: 'Aseguradora XYZ',
    position: 'Agente de Seguros',
    address: 'Carrera 45 #26-85, Medellín',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Agente',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: '3', 
    name: 'Agencia Demo', 
    email: 'agencia@demo.com', 
    password: 'password', 
    role: 'AGENCIA' as UserRole,
    level: 'AVANZADO' as UserLevel,
    phone: '+57 123 456 7892',
    company: 'Agencia de Seguros Ejemplo',
    position: 'Gerente de Agencia',
    address: 'Avenida 68 #12-45, Cali',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Agencia',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: '4', 
    name: 'Admin Demo', 
    email: 'admin@demo.com', 
    password: 'password', 
    role: 'ADMIN' as UserRole,
    level: 'AVANZADO' as UserLevel,
    phone: '+57 123 456 7893',
    company: 'Hub de Seguros',
    position: 'Administrador del Sistema',
    address: 'Calle 100 #8-60, Bogotá',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    createdAt: new Date(),
    updatedAt: new Date()
  },
];

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('hubseguros_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = !!user;

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await handleLogin(email, password, navigate);
      if (result) {
        const savedUser = localStorage.getItem('hubseguros_user');
        setUser(savedUser ? JSON.parse(savedUser) : null);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoading(true);
    try {
      handleLogout(navigate);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await handleUpdateProfile(data);
      if (result) {
        const savedUser = localStorage.getItem('hubseguros_user');
        setUser(savedUser ? JSON.parse(savedUser) : null);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      login, 
      logout, 
      updateProfile,
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
