export type UserRole = 'ADMIN' | 'AGENCIA' | 'PROMOTOR' | 'ASISTENTE' | 'CLIENTE';

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

// Roles predefinidos
export const ROLES: Record<UserRole, Role> = {
  ADMIN: {
    id: 'admin',
    name: 'Administrador',
    description: 'Tiene acceso completo al sistema',
    permissions: [
      { 
        id: 'system.all', 
        name: 'Todos los permisos', 
        description: 'Acceso completo al sistema', 
        module: 'system', 
        level: 'admin' 
      }
    ],
    level: 'admin'
  },
  AGENCIA: {
    id: 'agencia',
    name: 'Agencia',
    description: 'Gestiona promotores y clientes asignados',
    permissions: [
      { 
        id: 'promotors.manage', 
        name: 'Gestionar promotores', 
        description: 'Crear, editar y eliminar promotores asignados', 
        module: 'promotors', 
        level: 'edit' 
      },
      { 
        id: 'clientes.agencia', 
        name: 'Gestionar clientes', 
        description: 'Administrar clientes asignados a la agencia', 
        module: 'clientes', 
        level: 'edit' 
      },
      { 
        id: 'reportes.agencia', 
        name: 'Ver reportes', 
        description: 'Acceso a reportes de la agencia', 
        module: 'reportes', 
        level: 'view' 
      },
      { 
        id: 'clients.manage', 
        name: 'Gestionar clientes', 
        description: 'Crear, editar y eliminar clientes', 
        module: 'clients', 
        level: 'edit' 
      },
      { 
        id: 'reports.view', 
        name: 'Ver reportes', 
        description: 'Acceso a todos los reportes del sistema', 
        module: 'reports', 
        level: 'view' 
      }
    ],
    level: 'advanced'
  },
  PROMOTOR: {
    id: 'promotor',
    name: 'Promotor',
    description: 'Gestiona clientes y pólizas',
    permissions: [
      { 
        id: 'clients.view', 
        name: 'Ver clientes', 
        description: 'Ver información de clientes asignados', 
        module: 'clients', 
        level: 'view' 
      },
      { 
        id: 'policies.manage', 
        name: 'Gestionar pólizas', 
        description: 'Crear, editar y gestionar pólizas de clientes', 
        module: 'policies', 
        level: 'edit' 
      },
      { 
        id: 'collections.view', 
        name: 'Ver cobranzas', 
        description: 'Ver estado de cobranzas de pólizas', 
        module: 'collections', 
        level: 'view' 
      }
    ],
    level: 'advanced'
  },
  ASISTENTE: {
    id: 'asistente',
    name: 'Asistente',
    description: 'Soporte administrativo',
    permissions: [
      { 
        id: 'policies.view', 
        name: 'Ver pólizas', 
        description: 'Ver información de pólizas', 
        module: 'policies', 
        level: 'view' 
      },
      { 
        id: 'collections.manage', 
        name: 'Gestionar cobranzas', 
        description: 'Administrar cobranzas y pagos', 
        module: 'collections', 
        level: 'edit' 
      },
      { 
        id: 'documents.manage', 
        name: 'Gestionar documentos', 
        description: 'Administrar documentos del sistema', 
        module: 'documents', 
        level: 'edit' 
      }
    ],
    level: 'basic'
  },
  CLIENTE: {
    id: 'cliente',
    name: 'Cliente',
    description: 'Acceso a información personal',
    permissions: [
      { 
        id: 'profile.view', 
        name: 'Ver perfil', 
        description: 'Ver y editar información personal', 
        module: 'profile', 
        level: 'view' 
      },
      { 
        id: 'policies.view', 
        name: 'Ver pólizas', 
        description: 'Ver información de pólizas propias', 
        module: 'policies', 
        level: 'view' 
      },
      { 
        id: 'payments.view', 
        name: 'Ver pagos', 
        description: 'Ver pagos realizados', 
        module: 'payments', 
        level: 'view' 
      }
    ],
    level: 'basic'
  }
};

// Funciones de validación
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

// Función para obtener todos los permisos de un rol
export const getAllPermissions = (): Permission[] => {
  return Object.values(ROLES)
    .flatMap(role => role.permissions)
    .filter((permission, index, array) => 
      array.findIndex(p => p.id === permission.id) === index
    );
};
