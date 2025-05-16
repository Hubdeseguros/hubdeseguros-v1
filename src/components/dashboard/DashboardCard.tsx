import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: number;
  color?: "blue" | "green" | "amber" | "red" | "purple";
  change?: string;
  timeframe?: string;
  security?: boolean;
  alert?: boolean;
  privacyMsg?: string;
  badge?: ReactNode;
}

const DashboardCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = "blue",
  change,
  timeframe,
  security,
  alert,
  privacyMsg,
  badge,
}: DashboardCardProps) => {
  const getBgColor = () => {
    switch (color) {
      case "green":
        return "bg-green-50";
      case "amber":
        return "bg-amber-50";
      case "red":
        return "bg-red-50";
      case "purple":
        return "bg-purple-50";
      default:
        return "bg-blue-50";
    }
  };

  const getTextColor = () => {
    switch (color) {
      case "green":
        return "text-green-600";
      case "amber":
        return "text-amber-600";
      case "red":
        return "text-red-600";
      case "purple":
        return "text-purple-600";
      default:
        return "text-blue-600";
    }
  };

  const getTrendColor = () => {
    if (trend === undefined) return "";
    return trend > 0
      ? "text-green-600"
      : trend < 0
        ? "text-red-600"
        : "text-gray-600";
  };

  return (
    <Card
      className={`${getBgColor()} p-6 rounded-lg relative shadow-md transition-shadow duration-200 hover:shadow-lg min-h-[120px]`}
    >
      {security && (
        <div
          className="absolute top-2 right-2 flex items-center gap-1 text-green-600"
          aria-label="Seguro"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4l7 4v4c0 5-3.5 9-7 9s-7-4-7-9V8l7-4z"
            />
          </svg>
          <span className="text-xs font-semibold">Seguro</span>
        </div>
      )}
      {alert && (
        <div
          className="absolute top-2 left-2 bg-red-100 text-red-700 px-2 py-1 rounded flex items-center gap-1"
          aria-label="Alerta"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-xs font-bold">Alerta</span>
        </div>
      )}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
          <div className="flex items-center gap-2 min-h-[32px]">
            <p className={`text-3xl font-bold ${getTextColor()} mt-1`}>
              {value}
            </p>
            {badge || <span className="inline-block w-8 h-4" />}
          </div>
          {(subtitle || change) && (
            <p className="text-gray-600 text-xs mt-1">{subtitle || change}</p>
          )}
          {timeframe && (
            <p className="text-gray-500 text-xs mt-1">{timeframe}</p>
          )}
          {trend !== undefined && (
            <div className={`flex items-center mt-2 ${getTrendColor()}`}>
              {trend > 0 ? (
                <svg
                  className="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              ) : trend < 0 ? (
                <svg
                  className="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              ) : null}
              <span className="text-xs font-medium">
                {trend > 0 ? "+" : ""}
                {trend}% vs. mes anterior
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-2 rounded-full ${getBgColor()} ${getTextColor()}`}>
            {icon}
          </div>
        )}
      </div>
      {privacyMsg && (
        <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 0v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {privacyMsg}
        </div>
      )}
    </Card>
  );
};

export default DashboardCard;
