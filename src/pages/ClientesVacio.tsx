import { UserPlus } from "lucide-react";
import EmptyTableCard from "@/components/common/EmptyTableCard";

export default function ClientesVacio() {
  return (
    <EmptyTableCard
      icon={<UserPlus className="w-16 h-16 text-blue-400" />}
      title="¡Aún no tienes clientes!"
      description="Agrega tu primer cliente y comienza a construir tu cartera. Gestiona fácilmente sus pólizas y siniestros desde aquí."
      actionLabel="Agregar cliente"
      onAction={() => {
        /* lógica para abrir modal/formulario */
      }}
      bgColor="bg-blue-50"
      borderColor="border-blue-200"
    />
  );
}
