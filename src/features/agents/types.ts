
export interface Agent {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  license_number?: string | null;
  created_at: string;
  updated_at?: string;
  status?: string | null;
}

export type AgentFormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  license_number?: string | null;
  status?: string | null;
};
