
import { supabase } from '@/integrations/supabase/client';
import type { Client, ClientFormData } from '../types';

// Map DB row to typed Client based on your 'clientes' schema
function mapDbToClient(row: any): Client {
  return {
    id: row.id,
    first_name: row.nombre,
    last_name: "",
    email: row.email ?? "",
    phone: null,
    document_id: "", // Not in schema
    document_type: "",
    address: "",
    created_at: row.created_at ?? '',
    updated_at: row.created_at ?? '',
    status: 'ACTIVE',
  };
}

// Only nombre + email + promotor_id + creado_por + created_at
function mapClientFormToDb(data: ClientFormData) {
  return {
    nombre: data.first_name,
    email: data.email,
    promotor_id: data.promotor_id || "", // Needs adaption on UI
    creado_por: data.creado_por || "",
  };
}

export const clientService = {
  getAll: async (): Promise<Client[]> => {
    const { data, error } = await supabase.from('clientes').select('*');
    if (error) throw error;
    return (data ?? []).map(mapDbToClient);
  },
  getById: async (id: string): Promise<Client | null> => {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data ? mapDbToClient(data) : null;
  },
  create: async (data: ClientFormData): Promise<Client> => {
    const dbData = mapClientFormToDb(data);
    const { data: created, error } = await supabase
      .from('clientes')
      .insert([dbData])
      .select()
      .single();
    if (error) throw error;
    return mapDbToClient(created);
  },
  update: async (id: string, data: Partial<ClientFormData>): Promise<Client> => {
    const dbData: any = {};
    if (data.first_name) dbData.nombre = data.first_name;
    if (data.email) dbData.email = data.email;
    const { data: updated, error } = await supabase
      .from('clientes')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapDbToClient(updated);
  },
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('clientes').delete().eq('id', id);
    if (error) throw error;
  }
};
