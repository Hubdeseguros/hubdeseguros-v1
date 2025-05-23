
export type UserRole = 'CLIENTE' | 'AGENTE' | 'AGENCIA' | 'ADMIN';

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
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
