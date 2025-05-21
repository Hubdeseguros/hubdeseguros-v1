import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Shield, AlertCircle, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: number;
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
  change?: string;
  timeframe?: string;
  security?: boolean;
  alert?: boolean;
  privacyMsg?: string;
  badge?: ReactNode;
  children?: ReactNode;
  linkTo?: string;
}

const DashboardCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'blue',
  change,
  timeframe,
  security,
  alert,
  privacyMsg,
  badge,
  children, // Add type annotation for children
  linkTo
}: DashboardCardProps) => {
  const getBgColor = () => {
    switch (color) {
      case 'green':
        return 'bg-green-50';
      case 'amber':
        return 'bg-amber-50';
      case 'red':
        return 'bg-red-50';
      case 'purple':
        return 'bg-purple-50';
      default:
        return 'bg-blue-50';
    }
  };

  const getTextColor = () => {
    switch (color) {
      case 'green':
        return 'text-green-600';
      case 'amber':
        return 'text-amber-600';
      case 'red':
        return 'text-red-600';
      case 'purple':
        return 'text-purple-600';
      default:
        return 'text-blue-600';
    }
  };

  const getTrendColor = () => {
    if (trend === undefined) return '';
    return trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600';
  };

  return (
    <Card className={`${getBgColor()} p-6 rounded-lg relative shadow-md transition-shadow duration-200 hover:shadow-lg min-h-[120px]`}>
      {security && (
        <div className="absolute top-2 right-2 flex items-center gap-1 text-green-600" aria-label="Seguro">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4l7 4v4c0 5-3.5 9-7 9s-7-4-7-9V8l7-4z" />
          </svg>
          <span className="text-xs font-semibold">Seguro</span>
        </div>
      )}
      {alert && (
        <div className="absolute top-2 left-2 bg-red-100 text-red-700 px-2 py-1 rounded flex items-center gap-1" aria-label="Alerta">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-bold">Alerta</span>
        </div>
      )}
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-muted">
              {icon}
            </div>
          )}
          <div>
            <p className="text-sm font-medium leading-none text-muted-foreground">
              {title}
            </p>
            <p className="text-2xl font-bold tracking-tight">
              {value}
            </p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
        {trend !== undefined && (
          <div className="flex items-baseline">
            <p className="text-2xl font-bold tracking-tight">
              {value}
            </p>
            <p
              className={`ml-2 flex items-baseline text-sm font-medium ${
                trend > 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {trend > 0 ? '+' : ''}
              {trend}%
            </p>
          </div>
        )}
        {change && (
          <p className="text-sm text-muted-foreground">
            {change}
          </p>
        )}
        {timeframe && (
          <p className="text-sm text-muted-foreground">
            {timeframe}
          </p>
        )}
        {security && (
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">Protegido</span>
          </div>
        )}
        {alert && (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">Alerta</span>
          </div>
        )}
        {privacyMsg && (
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">{privacyMsg}</span>
          </div>
        )}
        {badge && (
          <div className="mt-2 flex items-center gap-2">
            {badge}
          </div>
        )}
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
        {linkTo && (
          <Link to={linkTo} className="mt-4">
            <Button variant="outline" className="w-full justify-start gap-2">
              <ArrowRight className="h-4 w-4" />
              Ver más
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
};

export default DashboardCard;
