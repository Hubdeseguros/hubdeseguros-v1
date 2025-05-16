import { supabase } from '@/integrations/supabase/client';
import { Payment, PaymentFormData } from '../types';

export const paymentService = {
  getAll: async (): Promise<Payment[]> => {
    const { data, error } = await supabase.from('payments').select('*');
    if (error) throw error;
    return data as Payment[];
  },
  getById: async (id: string): Promise<Payment | null> => {
    const { data, error } = await supabase.from('payments').select('*').eq('id', id).single();
    if (error) throw error;
    return data as Payment;
  },
  create: async (data: PaymentFormData): Promise<Payment> => {
    const { data: created, error } = await supabase.from('payments').insert([data]).select().single();
    if (error) throw error;
    return created as Payment;
  },
  update: async (id: string, data: Partial<PaymentFormData>): Promise<Payment> => {
    const { data: updated, error } = await supabase.from('payments').update(data).eq('id', id).select().single();
    if (error) throw error;
    return updated as Payment;
  },
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('payments').delete().eq('id', id);
    if (error) throw error;
  }
}; 