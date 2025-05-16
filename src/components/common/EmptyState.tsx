import React from "react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => (
  <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-md border border-gray-200">
    {icon && <div className="mb-4 text-blue-600 text-5xl">{icon}</div>}
    <h2 className="text-2xl font-bold mb-2 text-blue-900">{title}</h2>
    <p className="text-gray-600 mb-6 text-center max-w-md">{description}</p>
    {actionLabel && onAction && (
      <button
        className="px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
        onClick={onAction}
      >
        {actionLabel}
      </button>
    )}
  </div>
); 