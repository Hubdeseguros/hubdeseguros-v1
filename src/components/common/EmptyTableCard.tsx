import { ReactNode } from "react";

interface EmptyTableCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  bgColor?: string;
  borderColor?: string;
}

/**
 * EmptyTableCard
 * Componente visual reutilizable para mostrar estados vacíos en tablas o páginas.
 * - icon: Icono visual representativo del contexto.
 * - title: Título principal del estado vacío.
 * - description: Descripción o mensaje adicional.
 * - actionLabel: Texto del botón de acción (opcional).
 * - onAction: Función a ejecutar al hacer click en el botón (opcional).
 * - bgColor, borderColor: Personalización visual por contexto (opcional).
 */
const EmptyTableCard = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  bgColor = "bg-blue-50",
  borderColor = "border-blue-200",
}: EmptyTableCardProps) => (
  <div
    className={`flex flex-col items-center justify-center py-16 rounded-xl shadow-md border ${bgColor} ${borderColor} max-w-lg mx-auto my-12 min-h-[320px] transition-shadow`}
    role="status"
    aria-live="polite"
  >
    <div className="mb-4 min-h-[64px] flex items-center justify-center">
      {icon}
    </div>
    <h2 className="text-xl font-bold mb-2 text-blue-900 text-center">
      {title}
    </h2>
    <p className="text-gray-600 mb-6 text-center">{description}</p>
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition font-semibold shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
        tabIndex={0}
        aria-label={actionLabel}
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyTableCard;
