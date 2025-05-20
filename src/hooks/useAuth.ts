import { useState, useEffect } from 'react';
import { Permission, Role, RolePermissions, validatePermission, validateRoleAccess, validateRolePermission, getRolePermissions } from '@/types/permissions';
import { User as UserType } from '@/types/auth';

interface User extends UserType {
  role: Role;
  permissions: Permission[];
  lastLogin: Date;
}

interface AuthContext {
  user: User | null;
  isAuthenticated: boolean;
  hasPermission: (permissionId: string, level?: 'view' | 'edit' | 'admin') => boolean;
  hasRoleAccess: (level?: 'basic' | 'advanced' | 'admin') => boolean;
  login: (userData: User) => void;
  logout: () => void;
  refresh: () => Promise<void>;
  error: Error | null;
}

export const useAuth = (): AuthContext => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const isAuthenticated = !!user;

  const login = (userData: User) => {
    try {
      const now = new Date();
      const updatedUser = {
        ...userData,
        lastLogin: now,
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const logout = () => {
    try {
      setUser(null);
      localStorage.removeItem('user');
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const hasPermission = (permissionId: string, level: 'view' | 'edit' | 'admin' = 'view') => {
    if (!user) return false;
    return validatePermission(user.permissions, permissionId, level);
  };

  const hasRoleAccess = (level: 'basic' | 'advanced' | 'admin' = 'basic') => {
    if (!user) return false;
    return validateRoleAccess(user.role, level);
  };

  const refresh = async () => {
    try {
      if (!user) return;
      
      // Simular refresco de token (en producción esto vendría de una API)
      const now = new Date();
      const updatedUser = {
        ...user,
        lastLogin: now,
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  // Simular carga de usuario (en producción esto vendría de una API)
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      }
    } catch (err) {
      setError(err as Error);
    }
  }, []);

  return {
    user,
    isAuthenticated,
    hasPermission,
    hasRoleAccess,
    login,
    logout,
    refresh,
    error,
  };
};
