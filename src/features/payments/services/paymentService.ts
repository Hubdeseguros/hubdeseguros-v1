
import { supabase } from '@/integrations/supabase/client';
import { Payment, PaymentFormData } from '../types';

// Helper conversion for payment status and method
interface PaymentRow {
  id: string;
  poliza_id: string;
  monto: string | number;
  fecha_pago: string;
  metodo_pago?: string;
  estado: string;
  created_at: string;
  updated_at: string;
}

function mapPagoRow(row: PaymentRow): Payment {
  return {
    id: row.id,
    policy_id: row.poliza_id,
    amount: Number(row.monto),
    payment_date: row.fecha_pago,
    method: row.metodo_pago || '',
    status: row.estado === "PAGADO"
      ? "COMPLETED"
      : row.estado === "PENDIENTE"
      ? "PENDING"
      : "FAILED",
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

// Explicitly type conversion for insert/update
function paymentFormToDb(data: PaymentFormData) {
  // Only allow valid status/method according to db type
  let estado: "PENDIENTE" | "PAGADO" | "ANULADO";
  if (data.status === "COMPLETED") estado = "PAGADO";
  else if (data.status === "PENDING") estado = "PENDIENTE";
  else estado = "ANULADO";

  let metodo_pago: "EFECTIVO" | "TARJETA" | "TRANSFERENCIA" = "EFECTIVO";
  if (data.method === "TARJETA" || data.method === "TRANSFERENCIA") {
    metodo_pago = data.method;
  }

  return {
    poliza_id: data.policy_id,
    monto: data.amount,
    fecha_pago: data.payment_date,
    metodo_pago,
    estado,
  };
}

export const paymentService = {
  getAll: async (): Promise<Payment[]> => {
    const { data, error } = await supabase.from('pagos').select('*');
    if (error) throw error;
    return (data as any[]).map(mapPagoRow);
  },
  getById: async (id: string): Promise<Payment | null> => {
    const { data, error } = await supabase.from('pagos').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return mapPagoRow(data);
  },
  create: async (data: PaymentFormData): Promise<Payment> => {
    const insertData = paymentFormToDb(data);
    const { data: created, error } = await supabase.from('pagos').insert(insertData).select().maybeSingle();
    if (error) throw error;
    if (!created) throw new Error("No payment created");
    return mapPagoRow(created);
  },
  update: async (id: string, data: Partial<PaymentFormData>): Promise<Payment> => {
    const updateData = paymentFormToDb(data as PaymentFormData);
    const { data: updated, error } = await supabase.from('pagos').update(updateData).eq('id', id).select().maybeSingle();
    if (error) throw error;
    if (!updated) throw new Error("No payment updated");
    return mapPagoRow(updated);
  },
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('pagos').delete().eq('id', id);
    if (error) throw error;
  }
};

