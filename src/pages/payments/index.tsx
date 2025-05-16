import React from "react";
import { usePayments } from "@/hooks/usePayments";
import PaymentList from "@/components/payments/PaymentList";
import PaymentForm from "@/components/payments/PaymentForm";
import PaymentDetails from "@/components/payments/PaymentDetails";

export default function PaymentsPage() {
  const { data: payments, loading, error, createPayment } = usePayments();
  const [selected, setSelected] = React.useState<string | null>(null);

  const selectedPayment = payments.find((p) => p.id === selected);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Pagos</h1>
      {error && <div className="text-red-500">{error.message}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <PaymentList
            payments={payments}
            onSelect={(p) => setSelected(p.id)}
          />
        </div>
        <div>
          <h2 className="font-semibold mb-2">Nuevo Pago</h2>
          <PaymentForm onSubmit={createPayment} loading={loading} />
          {selectedPayment && (
            <>
              <h2 className="font-semibold mt-6 mb-2">Detalles</h2>
              <PaymentDetails payment={selectedPayment} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
