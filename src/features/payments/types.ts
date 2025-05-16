export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface Payment {
  id: string;
  policy_id: string;
  amount: number;
  payment_date: string; // ISO8601
  method: string;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

export type PaymentFormData = Omit<Payment, 'id' | 'created_at' | 'updated_at'>; 