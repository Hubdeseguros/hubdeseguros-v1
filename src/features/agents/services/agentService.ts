import { supabase } from '@/integrations/supabase/client';
import { Agent, AgentFormData } from '../types';

export const agentService = {
  getAll: async (): Promise<Agent[]> => {
    const { data, error } = await supabase.from('agents').select('*');
    if (error) throw error;
    return data as Agent[];
  },
  getById: async (id: string): Promise<Agent | null> => {
    const { data, error } = await supabase.from('agents').select('*').eq('id', id).single();
    if (error) throw error;
    return data as Agent;
  },
  create: async (data: AgentFormData): Promise<Agent> => {
    const { data: created, error } = await supabase.from('agents').insert([data]).select().single();
    if (error) throw error;
    return created as Agent;
  },
  update: async (id: string, data: Partial<AgentFormData>): Promise<Agent> => {
    const { data: updated, error } = await supabase.from('agents').update(data).eq('id', id).select().single();
    if (error) throw error;
    return updated as Agent;
  },
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('agents').delete().eq('id', id);
    if (error) throw error;
  }
}; 