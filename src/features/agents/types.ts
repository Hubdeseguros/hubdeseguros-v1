export type AgentStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

export interface Agent {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  license_number: string;
  created_at: string;    // ISO8601
  updated_at: string;    // ISO8601
  status: AgentStatus;
}

export type AgentFormData = Omit<Agent, 'id' | 'created_at' | 'updated_at'>; 