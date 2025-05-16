export interface ClientAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ClientContact {
  type: 'email' | 'phone' | 'mobile' | 'other';
  value: string;
  isPrimary: boolean;
}

export interface ClientDocument {
  type: 'CC' | 'NIT' | 'CE' | 'PASSPORT' | 'OTHER';
  number: string;
  expirationDate?: string;
}

export type ClientStatusValue = 'ACTIVE' | 'INACTIVE' | 'POTENTIAL' | 'IN_PROCESS' | 'REJECTED';

export interface ClientStatus {
  id: string;
  name: 'Activo' | 'Inactivo' | 'Potencial' | 'En proceso' | 'Rechazado';
  color: string;
  value: ClientStatusValue;
}

export interface ClientCategory {
  id: string;
  name: string;
  color: string;
}

export interface ClientPolicy {
  id: string;
  policyNumber: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
}

export interface Client {
  id: string;
  document_type: DocumentType;
  document_number: string;
  first_name: string;
  last_name: string;
  business_name?: string;
  birth_date?: string;
  gender?: 'M' | 'F' | 'OTRO';
  email: string;
  phone: string;
  mobile: string;
  address: ClientAddress;
  contacts: ClientContact[];
  documents: ClientDocument[];
  status: ClientStatus | ClientStatusValue;
  categories: ClientCategory[];
  policies: ClientPolicy[];
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  is_business: boolean;
}

export type DocumentType = 'DNI' | 'PASAPORTE' | 'RUC';

export interface ClientFormData {
  documentType: DocumentType;
  documentNumber: string;
  firstName: string;
  lastName: string;
  businessName?: string;
  birthDate?: string;
  gender?: 'M' | 'F' | 'OTRO';
  email: string;
  phone: string;
  mobile: string;
  address: Omit<ClientAddress, 'id'>;
  isBusiness: boolean;
}

export interface DateRange {
  from: string;
  to: string;
}

export interface ClientFilters {
  search?: string;
  documentNumber?: string;
  status?: string[];
  categories?: string[];
  createdAt?: DateRange;
  birthDate?: DateRange;
  policyExpiration?: DateRange;
  agentId?: string;
  isBusiness?: boolean;
  page?: number;
  pageSize?: number;
}

export interface ColumnVisibility {
  [key: string]: boolean;
}
