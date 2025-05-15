import { EmptyState } from "@/components/common/EmptyState";
import { AlertCircle } from "lucide-react";

export default function SiniestrosVacio() {
  return (
    <EmptyState
      icon={<AlertCircle />}
      title="Sin siniestros reportados"
      description="No se han reportado siniestros aún. Aquí podrás gestionar y dar seguimiento a los reclamos de tus asegurados cuando ocurran eventos cubiertos por sus pólizas."
      actionLabel="Reportar Siniestro"
      onAction={() => {/* lógica para reportar siniestro */}}
    />
  );
} 