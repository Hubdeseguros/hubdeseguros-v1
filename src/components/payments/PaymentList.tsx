import React from "react";
import { Payment } from "@/features/payments/types";
import PaymentEmpty from "./PaymentEmpty";

interface Props {
  payments: Payment[];
  onSelect: (payment: Payment) => void;
}

const PaymentList: React.FC<Props> = ({ payments, onSelect }) => {
  if (!payments.length) return <PaymentEmpty />;
  return (
    <ul className="divide-y divide-gray-200">
      {payments.map((payment) => (
        <li
          key={payment.id}
          className="p-4 hover:bg-gray-50 cursor-pointer"
          onClick={() => onSelect(payment)}
        >
          <div className="font-semibold">Poliza: {payment.policy_id}</div>
          <div className="text-sm text-gray-500">
            Monto: {payment.amount} | Fecha: {payment.payment_date}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default PaymentList;
