import { useState, useEffect } from 'react';
import { Permission, RolePermissions, validatePermission } from '@/types/permissions';

interface User {
  id: string;
  role: string;
  permissions: Permission[];
  rolePermissions: RolePermissions;
}

interface AuthContext {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

export const useAuth = (): AuthContext => {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  // Simular carga de usuario (en producción esto vendría de una API)
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return {
    user,
    isAuthenticated,
    login,
    logout,
  };
};
