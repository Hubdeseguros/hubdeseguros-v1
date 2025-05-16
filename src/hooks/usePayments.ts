import { useState, useEffect } from "react";
import { Payment, PaymentFormData } from "@/features/payments/types";
import { paymentService } from "@/features/payments/services/paymentService";

export const usePayments = () => {
  const [data, setData] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const payments = await paymentService.getAll();
      setData(payments);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (payment: PaymentFormData) => {
    setLoading(true);
    setError(null);
    try {
      await paymentService.create(payment);
      await fetchPayments();
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return {
    data,
    loading,
    error,
    fetchPayments,
    createPayment,
  };
};
