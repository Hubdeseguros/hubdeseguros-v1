import React, { useState, useReducer, useCallback, useMemo, useEffect } from 'react';

// Declaración de tipos para elementos JSX personalizados
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'div': React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      'span': React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
      'p': React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
      'header': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'form': React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
    }
  }

  interface Window {
    HubDeSeguros: {
      handleError: (error: Error) => void;
    };
  }
}

import { useLocation, useNavigate, Link } from 'react-router-dom';
import type { User } from '@/types/auth';
import { useAuth } from '@/hooks/useAuth';
import type { Permission } from '@/types/permissions';
import { 
  Search,
  Check,
  AlertCircle,
  BellRing,
  Settings,
  HelpCircle,
  LogOut,
  Shield,
  User as UserIcon,
  Users,
  UserPlus,
  Building2,
  DollarSign,
  Info,
  GroupIcon
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import ErrorBoundary from '../../components/ErrorBoundary';

import { UserRole } from '@/types/permissions';

// Importamos solo UserRole del auth para compatibilidad
// Definimos un tipo para los ítems del menú
type MenuItem = {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  dividerAfter?: boolean;
};

// Función auxiliar para verificar permisos
const hasPermission = (user: User | null | undefined, permission: string): boolean => {
  if (!user || !user.permissions) return false;
  
  // Verificar si el usuario está autenticado
  if (!user) {
    return false;
  }
  
  // Verificar si el usuario tiene el permiso directo
  const hasDirectPermission = user.permissions.some(perm => 
    typeof perm === 'string' ? perm === permission : perm.id === permission
  );
  
  // Verificar si el usuario tiene el permiso a través del rol
  const hasRolePermission = user.rolePermissions?.some(perm => 
    typeof perm === 'string' ? perm === permission : perm.id === permission
  );
  
  return hasDirectPermission || hasRolePermission;
};

// Definimos los tipos de notificaciones
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  date: Date;
  link?: string;
}

type HeaderProps = {
  className?: string;
};

type NotificationsState = {
  notifications: Notification[];
  unreadCount: number;
};

type NotificationsAction =
  | { type: 'MARK_AS_READ'; id: string }
  | { type: 'MARK_ALL_AS_READ' };

// Función para obtener el título del rol
const getRoleTitle = (role: UserRole): string => {
  switch (role) {
    case 'ADMIN':
      return 'Administrador';

    case 'PROMOTOR':
      return 'Promotor';
    case 'ASISTENTE':
      return 'Asistente';
    case 'CLIENTE':
      return 'Cliente';
    case 'AGENCIA':
      return 'Agencia';
    default:
      return 'Usuario';
  }
};

// Función para obtener el icono del rol
const getRoleIcon = (role: UserRole): React.ReactNode => {
  switch (role) {
    case 'ADMIN':
      return <Shield className="w-4 h-4" />;
    case 'AGENCIA':
      return <GroupIcon className="w-4 h-4" />;
    case 'PROMOTOR':
      return <UserPlus className="w-4 h-4" />;
    case 'ASISTENTE':
      return <Building2 className="w-4 h-4" />;
    case 'CLIENTE':
      return <UserIcon className="w-4 h-4" />;
    default:
      return <UserIcon className="w-4 h-4" />;
  }
};

const notificationsReducer = (state: NotificationsState, action: NotificationsAction): NotificationsState => {
  switch (action.type) {
    case 'MARK_AS_READ':
      const updatedNotifications = state.notifications.map(notification =>
        notification.id === action.id ? { ...notification, read: true } : notification
      );
      return {
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter(n => !n.read).length
      };
    case 'MARK_ALL_AS_READ':
      return {
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
      };
    default:
      return state;
  }
};

// Notificaciones de ejemplo
const defaultNotifications: Notification[] = [
  {
    id: '1',
    title: 'Nueva póliza creada',
    message: 'Se ha creado una nueva póliza para el cliente Juan Pérez',
    type: 'success',
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 30) // 30 minutos atrás
  },
  {
    id: '2',
    title: 'Recordatorio de vencimiento',
    message: 'La póliza #12345 vencerá en 7 días',
    type: 'warning',
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 horas atrás
  },
  {
    id: '3',
    title: 'Pago recibido',
    message: 'Se ha registrado un pago por $250.000 para la póliza #54321',
    type: 'info',
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 día atrás
  },
  {
    id: '4',
    title: 'Error en procesamiento',
    message: 'Hubo un error al procesar el pago de la póliza #98765',
    type: 'error',
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 horas atrás
  }
];

interface BreadcrumbItemType {
  label: string;
  path: string;
}

// Función para formatear fechas de notificaciones
const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `hace ${interval} año${interval === 1 ? '' : 's'}`;
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `hace ${interval} mes${interval === 1 ? '' : 'es'}`;
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `hace ${interval} día${interval === 1 ? '' : 's'}`;
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `hace ${interval} hora${interval === 1 ? '' : 's'}`;
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `hace ${interval} minuto${interval === 1 ? '' : 's'}`;
  
  return 'hace unos segundos';
};

// Opciones del menú de usuario basadas en roles
interface UserMenuItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  permission?: Permission;
  dividerAfter?: boolean;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = user?.role;

  const isAgencia = userRole === 'AGENCIA';
  const isAdmin = userRole === 'ADMIN';

  // Estado para el menú de notificaciones
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [state, dispatch] = useReducer(notificationsReducer, {
    notifications: defaultNotifications,
    unreadCount: defaultNotifications.filter(n => !n.read).length
  });

  // Función para marcar una notificación como leída
  const handleNotificationRead = useCallback((id: string) => {
    dispatch({ type: 'MARK_AS_READ', id });
  }, []);

  // Función para marcar todas las notificaciones como leídas
  const handleMarkAllAsRead = useCallback(() => {
    dispatch({ type: 'MARK_ALL_AS_READ' });
  }, []);

  // Función para obtener el icono de notificación
  const getNotificationIcon = useCallback((type: Notification['type']): React.ReactNode => {
    switch (type) {
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  }, []);

  // Menú de usuario
  const userMenuItems: MenuItem[] = useMemo(() => {
    const items: MenuItem[] = [
      {
        label: 'Mi perfil',
        onClick: () => navigate('/profile'),
        icon: <UserIcon className="w-4 h-4" />
      },
      {
        label: 'Ajustes',
        onClick: () => navigate('/settings'),
        icon: <Settings className="w-4 h-4" />
      },
      {
        label: 'Ayuda',
        onClick: () => navigate('/help'),
        icon: <HelpCircle className="w-4 h-4" />
      },
      {
        label: 'Cerrar sesión',
        onClick: () => logout(),
        icon: <LogOut className="w-4 h-4" />
      }
    ];

    // Filtrar menú según rol
    return items.filter(item => {
      // Aquí podríamos agregar lógica específica por rol
      // Por ahora mostramos todo para todos los roles
      return true;
    });
  }, [navigate, logout]);

  return (
    <ErrorBoundary>
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm',
        className
      )}>
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">HubDeSeguros</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notificaciones */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label="Abrir menú de notificaciones"
                >
                  <BellRing className="h-5 w-5" />
                  {state.unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      aria-label={`${state.unreadCount} notificaciones no leídas`}
                    >
                      {state.unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Notificaciones</p>
                    <p className="text-xs text-muted-foreground">
                      {state.unreadCount} no leídas
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-auto">
                  {state.notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      onClick={() => handleNotificationRead(notification.id)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        {getNotificationIcon(notification.type)}
                        <div className="flex flex-col space-y-1">
                          <span className="font-medium">{notification.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(notification.date)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleMarkAllAsRead}>
                  <span>Marcar todo como leído</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Usuario */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    {user?.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name || 'Usuario'} />
                    ) : (
                      <AvatarFallback>
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name || 'Usuario'}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email || ''}
                    </p>
                    <div className="flex items-center space-x-2">
                      {userRole === 'AGENCIA' ? (
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-5 w-5 text-blue-500" />
                          <span>Agencia</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {getRoleTitle(user?.role || 'CLIENTE')}
                        </span>
                      )}
                      {getRoleIcon(user?.role || 'CLIENTE')}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {userMenuItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <DropdownMenuItem
                      onClick={item.onClick}
                      className="cursor-pointer"
                    >
                      <span className="mr-2">{item.icon}</span>
                      <span>{item.label}</span>
                    </DropdownMenuItem>
                    {item.dividerAfter && <DropdownMenuSeparator />}
                  </React.Fragment>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </ErrorBoundary>
  );
};

export default Header;