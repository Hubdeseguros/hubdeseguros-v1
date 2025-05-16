import { supabase } from '@/integrations/supabase/client';
import { Client, ClientFormData } from '../types';

export const clientService = {
  getAll: async (): Promise<Client[]> => {
    const { data, error } = await supabase.from('clients').select('*');
    if (error) throw error;
    return data as Client[];
  },
  getById: async (id: string): Promise<Client | null> => {
    const { data, error } = await supabase.from('clients').select('*').eq('id', id).single();
    if (error) throw error;
    return data as Client;
  },
  create: async (data: ClientFormData): Promise<Client> => {
    const { data: created, error } = await supabase.from('clients').insert([data]).select().single();
    if (error) throw error;
    return created as Client;
  },
  update: async (id: string, data: Partial<ClientFormData>): Promise<Client> => {
    const { data: updated, error } = await supabase.from('clients').update(data).eq('id', id).select().single();
    if (error) throw error;
    return updated as Client;
  },
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) throw error;
  }
}; 