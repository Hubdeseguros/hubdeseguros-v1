import { supabase } from '@/integrations/supabase/client';
import type { Client, ClientFormData } from '../types';

// Map database row to typed Client
function mapDbToClient(row: {
  id: string;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  numero_documento?: string;
  tipo_documento?: string;
  direccion?: string;
  created_at?: string;
  updated_at?: string;
  estado?: boolean;
}): Client {
  return {
    id: row.id,
    first_name: row.nombre,
    last_name: row.apellido,
    email: row.email ?? '',
    phone: row.telefono ?? null,
    document_id: row.numero_documento,
    document_type: row.tipo_documento,
    address: row.direccion ?? null,
    created_at: row.created_at ?? '',
    updated_at: row.updated_at ?? '',
    status: row.estado === true ? 'ACTIVE' : row.estado === false ? 'INACTIVE' : 'PENDING',
  };
}

// Map local data for creation/update to database fields
function mapClientFormToDb(data: ClientFormData) {
  return {
    nombre: data.first_name,
    apellido: data.last_name,
    email: data.email,
    telefono: data.phone,
    numero_documento: data.document_id,
    tipo_documento: data.document_type as "DNI" | "PASAPORTE" | "RUC",
    direccion: data.address,
    estado: data.status === 'ACTIVE' ? true : data.status === 'INACTIVE' ? false : null,
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
    const dbData = mapClientFormToDb({
      first_name: data.first_name ?? '',
      last_name: data.last_name ?? '',
      email: data.email ?? '',
      phone: data.phone ?? null,
      document_id: data.document_id ?? '',
      document_type: data.document_type as "DNI" | "PASAPORTE" | "RUC" ?? 'DNI',
      address: data.address ?? null,
      status: data.status ?? 'PENDING',
    });
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
