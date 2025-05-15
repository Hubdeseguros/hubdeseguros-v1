import { EmptyState } from "@/components/common/EmptyState";
import { ShoppingCart } from "lucide-react";

export default function VentasVacio() {
  return (
    <EmptyState
      icon={<ShoppingCart />}
      title="No hay ventas registradas"
      description="Aún no has realizado ninguna venta. Las ventas representan nuevas oportunidades y crecimiento para tu aseguradora. Registra tu primera venta para comenzar a medir tu desempeño."
      actionLabel="Registrar Venta"
      onAction={() => {/* lógica para registrar venta */}}
    />
  );
} 