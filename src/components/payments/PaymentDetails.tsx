import React from "react";
import { Payment } from "@/features/payments/types";

interface Props {
  payment: Payment;
}

const PaymentDetails: React.FC<Props> = ({ payment }) => (
  <div className="p-4 bg-white rounded shadow">
    <h2 className="text-xl font-bold mb-2">
      Pago de Póliza: {payment.policy_id}
    </h2>
    <div className="text-gray-700">Monto: {payment.amount}</div>
    <div className="text-gray-700">Fecha: {payment.payment_date}</div>
    <div className="text-gray-700">Método: {payment.method}</div>
    <div className="text-gray-700">Estado: {payment.status}</div>
    <div className="text-gray-500 text-xs mt-2">
      Creado: {payment.created_at}
    </div>
    <div className="text-gray-500 text-xs">
      Actualizado: {payment.updated_at}
    </div>
  </div>
);

export default PaymentDetails;
