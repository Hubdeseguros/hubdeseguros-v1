import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { validateRolePermission, Permission, RolePermissions } from '@/types/permissions';

interface RouteConfig {
  path: string;
  roles: string[];
  permissions: string[];
}

interface User {
  id: string;
  role: string;
  permissions: Permission[];
  rolePermissions: RolePermissions;
}

export const routesConfig: RouteConfig[] = [
  // Rutas principales
  {
    path: '/dashboard',
    roles: ['admin', 'manager', 'user'],
    permissions: ['dashboard.view']
  },
  {
    path: '/clientes',
    roles: ['admin', 'manager', 'user'],
    permissions: ['clientes.view']
  },
  {
    path: '/clientes/listado',
    roles: ['admin', 'manager', 'user'],
    permissions: ['clientes.list']
  },
  {
    path: '/clientes/crm',
    roles: ['admin', 'manager'],
    permissions: ['crm.view']
  },
  // ... (otras rutas)
];

export function useRoutes() {
  const { user } = useAuth();
  const [authorizedRoutes, setAuthorizedRoutes] = useState<string[]>([]);

  const getAuthorizedRoutes = (role: string): string[] => {
    return routesConfig
      .filter(route => 
        route.roles.includes(role.toLowerCase()) &&
        (route.permissions.length === 0 ||
         route.permissions.some(permission => 
           validateRolePermission(user.rolePermissions, role, permission)
         ))
      )
      .map(route => route.path);
  };

  useEffect(() => {
    if (!user?.role) return;
    setAuthorizedRoutes(getAuthorizedRoutes(user.role));
  }, [user?.role]);

  return {
    authorizedRoutes,
    getAuthorizedRoutes
  };
}
