
export type ClientStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  document_id?: string;
  document_type?: string;
  address?: string;
  created_at: string;
  updated_at?: string;
  status: ClientStatus;
  promotor_id?: string;
  creado_por?: string;
}

// Only nombre, email, promotor_id for the DB schema
export type ClientFormData = {
  first_name: string;
  email: string;
  promotor_id?: string;
  creado_por?: string;
};
