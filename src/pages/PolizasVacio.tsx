import { FileText } from "lucide-react";
import EmptyTableCard from "@/components/common/EmptyTableCard";

export default function PolizasVacio() {
  return (
    <EmptyTableCard
      icon={<FileText className="w-16 h-16 text-green-400" />}
      title="No hay pólizas registradas"
      description="Registra tu primera póliza y comienza a proteger a tus clientes. Lleva el control de renovaciones y vencimientos."
      actionLabel="Agregar póliza"
      onAction={() => {
        /* lógica para abrir modal/formulario */
      }}
      bgColor="bg-green-50"
      borderColor="border-green-200"
    />
  );
}
