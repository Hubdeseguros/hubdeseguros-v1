import { DollarSign } from "lucide-react";
import EmptyTableCard from "@/components/common/EmptyTableCard";

export default function PagosVacio() {
  return (
    <EmptyTableCard
      icon={<DollarSign className="w-16 h-16 text-amber-400" />}
      title="Sin pagos registrados"
      description="Aún no has registrado ningún pago. Lleva el control de los cobros y mantén tus cuentas al día."
      actionLabel="Registrar pago"
      onAction={() => {/* lógica para abrir modal/formulario */}}
      bgColor="bg-amber-50"
      borderColor="border-amber-200"
    />
  );
} 