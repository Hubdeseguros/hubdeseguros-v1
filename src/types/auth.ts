import { Permission, RolePermissions } from '@/types/permissions';

export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'PROMOTOR' | 'ASISTENTE' | 'CLIENTE';

export type UserLevel = 'BASICO' | 'INTERMEDIO' | 'AVANZADO';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  level?: UserLevel;
  avatar?: string;
  phone?: string;
  company?: string;
  position?: string;
  address?: string;
  bio?: string;
  website?: string;
  documentType?: string;
  documentNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
  permissions: Permission[];
  rolePermissions?: Permission[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
