export type Permission = {
  id: string;
  name: string;
  description: string;
  module: string;
};

export type RolePermissions = {
  [key: string]: Permission[];
};

export const validatePermission = (userPermissions: Permission[], requiredPermission: string): boolean => {
  return userPermissions.some(permission => permission.id === requiredPermission);
};

export const validateRolePermission = (rolePermissions: RolePermissions, roleName: string, requiredPermission: string): boolean => {
  const rolePerms = rolePermissions[roleName.toLowerCase()];
  return rolePerms?.some(permission => permission.id === requiredPermission) ?? false;
};
