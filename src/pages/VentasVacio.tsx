import { ShoppingCart } from "lucide-react";
import EmptyTableCard from "@/components/common/EmptyTableCard";

export default function VentasVacio() {
  return (
    <EmptyTableCard
      icon={<ShoppingCart className="w-16 h-16 text-purple-400" />}
      title="Aún no tienes ventas"
      description="Registra tus ventas y haz seguimiento a tus comisiones y oportunidades de negocio."
      actionLabel="Registrar venta"
      onAction={() => {/* lógica para abrir modal/formulario */}}
      bgColor="bg-purple-50"
      borderColor="border-purple-200"
    />
  );
} 