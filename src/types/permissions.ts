export type Permission = {
  id: string;
  name: string;
  description: string;
  module: string;
  level: 'view' | 'edit' | 'admin';
};

export type Role = {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  level: 'basic' | 'advanced' | 'admin';
};

export type RolePermissions = {
  [key: string]: Permission[];
};

export const validatePermission = (userPermissions: Permission[], requiredPermission: string, requiredLevel: 'view' | 'edit' | 'admin' = 'view'): boolean => {
  return userPermissions.some(permission => 
    permission.id === requiredPermission && 
    (permission.level === requiredLevel || permission.level === 'admin')
  );
};

export const validateRolePermission = (rolePermissions: RolePermissions, roleName: string, requiredPermission: string, requiredLevel: 'view' | 'edit' | 'admin' = 'view'): boolean => {
  const rolePerms = rolePermissions[roleName.toLowerCase()];
  return rolePerms?.some(permission => 
    permission.id === requiredPermission && 
    (permission.level === requiredLevel || permission.level === 'admin')
  ) ?? false;
};

export const validateRoleAccess = (role: Role, requiredLevel: 'basic' | 'advanced' | 'admin' = 'basic'): boolean => {
  return role.level === requiredLevel || role.level === 'admin';
};

export const getRolePermissions = (role: Role): Permission[] => {
  return role.permissions;
};

export const hasPermissionOnModule = (userPermissions: Permission[], moduleName: string): boolean => {
  return userPermissions.some(permission => permission.module === moduleName);
};
