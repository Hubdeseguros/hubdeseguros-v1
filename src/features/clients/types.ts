
export type ClientStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  document_id: string;
  document_type: string;
  address?: string | null;
  created_at: string;    // ISO8601
  updated_at: string;    // ISO8601
  status: ClientStatus;
}

// Data para formularios (omitiendo campos autogenerados por el sistema)
export type ClientFormData = Omit<Client, 'id' | 'created_at' | 'updated_at'>;
