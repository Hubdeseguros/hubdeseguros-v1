import { EmptyState } from "@/components/common/EmptyState";
import { CreditCard } from "lucide-react";

export default function PagosVacio() {
  return (
    <EmptyState
      icon={<CreditCard />}
      title="No hay pagos registrados"
      description="Todavía no se han registrado pagos. Aquí podrás ver y gestionar los pagos realizados por tus clientes para mantener sus pólizas activas."
      actionLabel="Registrar Pago"
      onAction={() => {/* lógica para registrar pago */}}
    />
  );
} 