
import { supabase } from '@/integrations/supabase/client';
import { Payment, PaymentFormData } from '../types';

function mapPagoRow(row: any): Payment {
  return {
    id: row.id,
    policy_id: row.poliza_id,
    amount: Number(row.monto),
    payment_date: row.fecha_pago,
    method: row.metodo_pago || '',
    status: row.estado === "PAGADO" ? "COMPLETED" : row.estado === "PENDIENTE" ? "PENDING" : "FAILED",
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

function paymentFormToDb(data: PaymentFormData) {
  return {
    poliza_id: data.policy_id,
    monto: data.amount,
    fecha_pago: data.payment_date,
    metodo_pago: data.method as "EFECTIVO" | "TARJETA" | "TRANSFERENCIA",
    estado: data.status === "COMPLETED" ? "PAGADO" : data.status === "PENDING" ? "PENDIENTE" : "ANULADO"
  };
}

export const paymentService = {
  getAll: async (): Promise<Payment[]> => {
    const { data, error } = await supabase.from('pagos').select('*');
    if (error) throw error;
    return (data as any[]).map(mapPagoRow);
  },
  getById: async (id: string): Promise<Payment | null> => {
    const { data, error } = await supabase.from('pagos').select('*').eq('id', id).single();
    if (error) throw error;
    return mapPagoRow(data);
  },
  create: async (data: PaymentFormData): Promise<Payment> => {
    const insertData = paymentFormToDb(data);
    const { data: created, error } = await supabase.from('pagos').insert([insertData]).select().single();
    if (error) throw error;
    return mapPagoRow(created);
  },
  update: async (id: string, data: Partial<PaymentFormData>): Promise<Payment> => {
    const updateData = paymentFormToDb(data as PaymentFormData);
    const { data: updated, error } = await supabase.from('pagos').update(updateData).eq('id', id).select().single();
    if (error) throw error;
    return mapPagoRow(updated);
  },
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('pagos').delete().eq('id', id);
    if (error) throw error;
  }
};
