import React, { useState } from "react";
import { PaymentFormData } from "@/features/payments/types";

interface Props {
  initialData?: PaymentFormData;
  onSubmit: (data: PaymentFormData) => void;
  loading?: boolean;
}

const PaymentForm: React.FC<Props> = ({ initialData, onSubmit, loading }) => {
  const [form, setForm] = useState<PaymentFormData>(
    initialData || {
      policy_id: "",
      amount: 0,
      payment_date: "",
      method: "",
      status: "PENDING",
    },
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Poliza ID</label>
        <input
          name="policy_id"
          value={form.policy_id}
          onChange={handleChange}
          className="input"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Monto</label>
        <input
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          className="input"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Fecha de pago</label>
        <input
          name="payment_date"
          type="date"
          value={form.payment_date}
          onChange={handleChange}
          className="input"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Método</label>
        <input
          name="method"
          value={form.method}
          onChange={handleChange}
          className="input"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Estado</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="input"
        >
          <option value="PENDING">Pendiente</option>
          <option value="COMPLETED">Completado</option>
          <option value="FAILED">Fallido</option>
        </select>
      </div>
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
};

export default PaymentForm;
