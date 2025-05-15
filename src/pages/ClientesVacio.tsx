import { EmptyState } from "@/components/common/EmptyState";
import { Users } from "lucide-react";

export default function ClientesVacio() {
  return (
    <EmptyState
      icon={<Users />}
      title="No hay clientes registrados"
      description="Aún no has agregado ningún cliente a tu cartera. Los clientes son el corazón de tu aseguradora. Comienza a registrar nuevos clientes para gestionar sus pólizas y siniestros."
      actionLabel="Agregar Cliente"
      onAction={() => {/* lógica para abrir modal o redirigir a formulario */}}
    />
  );
} 