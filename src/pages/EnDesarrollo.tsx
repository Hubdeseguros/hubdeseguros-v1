import { FileText } from "lucide-react";
import EmptyTableCard from "@/components/common/EmptyTableCard";

export default function EnDesarrollo() {
  return (
    <EmptyTableCard
      icon={<FileText className="w-16 h-16 text-gray-400" />}
      title="Página en desarrollo"
      description="Esta sección estará disponible próximamente. ¡Gracias por tu paciencia!"
      actionLabel="Volver"
      onAction={() => window.history.back()}
      bgColor="bg-gray-50"
      borderColor="border-gray-200"
    />
  );
}
