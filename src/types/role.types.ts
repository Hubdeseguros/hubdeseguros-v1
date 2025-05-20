export type UserRole = 'ADMIN' | 'AGENCIA' | 'PROMOTER' | 'CLIENT';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  document_type?: string;
  document_number?: string;
  role: UserRole;
  agencia_id?: string;
  promoter_id?: string;
  created_at: string;
  updated_at: string;
  must_change_password?: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  user_metadata: {
    name: string;
    phone?: string;
    document_type?: string;
    document_number?: string;
    roles: UserRole[];
    must_change_password?: boolean;
    agencia_id?: string;
  };
}
