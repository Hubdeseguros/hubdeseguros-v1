import { EmptyState } from "@/components/common/EmptyState";
import { Shield } from "lucide-react";

export default function PolizasVacio() {
  return (
    <EmptyState
      icon={<Shield />}
      title="No hay pólizas registradas"
      description="Todavía no has emitido ninguna póliza. Las pólizas protegen a tus clientes y son el principal producto de tu aseguradora. Crea tu primera póliza para comenzar a operar."
      actionLabel="Nueva Póliza"
      onAction={() => {/* lógica para crear póliza */}}
    />
  );
} 