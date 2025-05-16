import { AlertTriangle } from "lucide-react";
import EmptyTableCard from "@/components/common/EmptyTableCard";

export default function SiniestrosVacio() {
  return (
    <EmptyTableCard
      icon={<AlertTriangle className="w-16 h-16 text-red-400" />}
      title="No hay siniestros reportados"
      description="Aquí aparecerán los siniestros reportados por tus clientes. Haz seguimiento y gestiona cada caso fácilmente."
      actionLabel="Reportar siniestro"
      onAction={() => {
        /* lógica para abrir modal/formulario */
      }}
      bgColor="bg-red-50"
      borderColor="border-red-200"
    />
  );
}
