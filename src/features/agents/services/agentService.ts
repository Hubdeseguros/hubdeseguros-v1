import { supabase } from '@/integrations/supabase/client';
/**
 * We will treat "Agent" as "Promotor" based on the current DB schema.
 * The fields are: id, nombre, email, agencia_id, creado_por, created_at.
 */
export interface Agent {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  license_number?: string | null; // Not in DB, left for compatibility
  status?: string | null; // Not in DB, left for compatibility
  created_at: string;
  updated_at?: string;
}
export type AgentFormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  license_number?: string | null;
  status?: string | null;
};

// Map DB row to FE type
function mapDbToAgent(row: any): Agent {
  return {
    id: row.id,
    first_name: row.nombre,
    last_name: "",
    email: row.email ?? "",
    phone: null,
    license_number: null,
    status: null,
    created_at: row.created_at ?? "",
    updated_at: row.created_at ?? "",
  };
}

export const agentService = {
  getAll: async (): Promise<Agent[]> => {
    const { data, error } = await supabase.from('promotores').select('*');
    if (error) throw error;
    return (data ?? []).map(mapDbToAgent);
  },
  getById: async (id: string): Promise<Agent | null> => {
    const { data, error } = await supabase
      .from('promotores')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data ? mapDbToAgent(data) : null;
  },
  create: async (form: AgentFormData & { agencia_id?: string }) => {
    // For demo, we'll use a placeholder agencia_id if not present
    const dbData = {
      nombre: form.first_name,
      email: form.email,
      agencia_id: form.agencia_id || '00000000-0000-0000-0000-000000000000'
    };
    const { data: created, error } = await supabase
      .from('promotores')
      .insert([dbData])
      .select()
      .single();
    if (error) throw error;
    return mapDbToAgent(created);
  },
  update: async (id: string, form: Partial<AgentFormData>) => {
    const dbData: any = {};
    if (form.first_name) dbData.nombre = form.first_name;
    if (form.email) dbData.email = form.email;
    const { data: updated, error } = await supabase
      .from('promotores')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapDbToAgent(updated);
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('promotores').delete().eq('id', id);
    if (error) throw error;
  },
};
