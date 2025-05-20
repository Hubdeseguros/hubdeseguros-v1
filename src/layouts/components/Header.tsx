import React, { useState, useReducer, useCallback, useMemo, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  Mail, 
  Search, 
  Check, 
  AlertCircle, 
  BellRing, 
  Bell, 
  Settings, 
  HelpCircle, 
  LogOut,
  Shield,
  User as UserIcon
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Breadcrumb, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import { UserRole, type User } from '@/types/auth';
import ErrorBoundary from '@/components/ErrorBoundary';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

interface BreadcrumbItem {
  label: string;
  path: string;
}

type NotificationType = 'info' | 'warning' | 'success' | 'error';

interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  type: NotificationType;
}

type NotificationsState = {
  notifications: Notification[];
  unreadCount: number;
};

type NotificationsAction =
  | { type: 'MARK_AS_READ'; id: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'SET_NOTIFICATIONS'; notifications: Notification[] };

// Reducer para manejar el estado de notificaciones
const notificationsReducer = (
  state: NotificationsState,
  action: NotificationsAction
): NotificationsState => {
  switch (action.type) {
    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.id 
            ? { ...notification, read: true } 
            : notification
        ),
        unreadCount: state.notifications.filter(n => !n.read && n.id !== action.id).length
      };
    case 'MARK_ALL_AS_READ':
      return {
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
      };
    case 'SET_NOTIFICATIONS':
      return {
        notifications: action.notifications,
        unreadCount: action.notifications.filter(n => !n.read).length
      };
    default:
      return state;
  }
};

const defaultNotifications: Notification[] = [
  {
    id: '1',
    title: 'Nuevo mensaje',
    message: 'Tienes un nuevo mensaje del equipo de soporte',
    date: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
    type: 'info'
  },
  {
    id: '2',
    title: 'Pago recibido',
    message: 'Se ha registrado el pago de la póliza #12345',
    date: new Date(Date.now() - 1000 * 60 * 60),
    read: false,
    type: 'success'
  },
  {
    id: '3',
    title: 'Recordatorio',
    message: 'La póliza #54321 vence en 15 días',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
    type: 'warning'
  }
];

// Componente UserMenu con manejo de roles
const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener el rol actual de la ruta
  const getCurrentRolePath = useCallback(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    return pathSegments[0] || 'usuario';
  }, [location.pathname]);

  const currentRolePath = getCurrentRolePath();
  
  // Función para navegar a una ruta específica dentro del rol actual
  const navigateTo = useCallback((path: string) => {
    navigate(`/${currentRolePath}${path}`);
  }, [currentRolePath, navigate]);

  // Función para manejar el cierre de sesión
  const handleLogout = useCallback(() => {
    logout();
    navigate('/auth/login');
  }, [logout, navigate]);

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          aria-label="Menú de usuario"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={user.avatar || '/placeholder.svg'} 
              alt={user.name || 'Usuario'}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56" 
        align="end" 
        sideOffset={8}
        aria-label="Opciones de usuario"
      >
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium truncate" aria-label={`Usuario: ${user.name}`}>
            {user.name}
          </p>
          <p className="text-xs text-muted-foreground truncate" aria-label={`Correo: ${user.email}`}>
            {user.email}
          </p>
        </div>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => navigateTo('/perfil')}
          aria-label="Ver perfil"
        >
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Mi Perfil</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => navigateTo('/configuracion')}
          aria-label="Configuración"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Configuración</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => navigateTo('/ayuda')}
          aria-label="Ayuda y soporte"
        >
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Ayuda y Soporte</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleLogout}
          className="text-destructive focus:text-destructive"
          aria-label="Cerrar sesión"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [pageTitle, setPageTitle] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  // Estado inicial de notificaciones
  const [notificationsState, dispatchNotifications] = useReducer(
    notificationsReducer,
    {
      notifications: defaultNotifications,
      unreadCount: defaultNotifications.filter(n => !n.read).length
    }
  );

  const { notifications, unreadCount } = notificationsState;

  // Función para marcar una notificación como leída
  const markAsRead = useCallback((id: string) => {
    dispatchNotifications({ type: 'MARK_AS_READ', id });
  }, []);

  // Función para marcar todas las notificaciones como leídas
  // Funciones auxiliares para manejo de notificaciones
  const markAllAsRead = useCallback(() => {
    dispatchNotifications({ type: 'MARK_ALL_AS_READ' });
  }, []);

  const getNotificationIcon = useCallback((type: NotificationType) => {
    switch (type) {
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <BellRing className="h-4 w-4 text-blue-500" />;
    }
  }, []);

  const formatTimeAgo = useCallback((date: Date) => {
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
  }, []);

  // Manejo de clic fuera para notificaciones
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Actualizar breadcrumbs basado en la ruta
  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const newBreadcrumbs: BreadcrumbItem[] = [];
    let currentPath = '';

    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      currentPath += `/${segment}`;
      
      // Formatear el label basado en el segmento
      let label = '';
      if (i === 0) {
        // Primero, el rol
        switch (segment) {
          case 'usuario':
            label = 'Cliente';
            break;
          case 'agente':
            label = 'Agente';
            break;
          case 'agencia':
            label = 'Agencia';
            break;
          case 'admin':
            label = 'Administrador';
            break;
          default:
            label = segment.charAt(0).toUpperCase() + segment.slice(1);
        }
      } else {
        // Resto de segmentos
        label = segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }

      newBreadcrumbs.push({ label, path: currentPath });
    }

    // Establecer el título de la página como el último segmento
    if (pathSegments.length > 0) {
      setPageTitle(
        pathSegments[pathSegments.length - 1]
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      );
    }

    setBreadcrumbs(newBreadcrumbs);
  }, [location.pathname]);

  useEffect(() => {
    try {
      const pathSegments = location.pathname.split('/').filter(Boolean);
      const newBreadcrumbs: BreadcrumbItem[] = [];
      let currentPath = '';

      if (pathSegments.length > 0) {
        // Primera parte (usuario, agente, agencia)
        const roleSegment = pathSegments[0];
        currentPath = `/${roleSegment}`;
        let roleLabel = '';

        switch (roleSegment) {
          case 'usuario':
            roleLabel = 'Cliente';
            break;
          case 'agente':
            roleLabel = 'Agente';
            break;
          case 'agencia':
            roleLabel = 'Agencia';
            break;
          default:
            roleLabel = roleSegment.charAt(0).toUpperCase() + roleSegment.slice(1);
        }

        newBreadcrumbs.push({ 
          label: roleLabel, 
          path: `/${roleSegment}/dashboard` 
        });

        // Secciones adicionales
        for (let i = 1; i < pathSegments.length; i++) {
          const segment = pathSegments[i];
          currentPath += `/${segment}`;
          
          // Formateamos el label para el breadcrumb
          let label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
          
          // Especial para dashboard
          if (segment === 'dashboard') {
            label = 'Dashboard';
          }

          newBreadcrumbs.push({ 
            label: label, 
            path: currentPath 
          });
        }

        // Actualizamos el título de la página
        const lastSegment = pathSegments[pathSegments.length - 1];
        const title = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, ' ');
        setPageTitle(title);
      }

      setBreadcrumbs(newBreadcrumbs);
    } catch (error) {
      console.error('Error generando breadcrumbs:', error);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <ErrorBoundary>
      <header className={`flex items-center justify-between p-4 ${className}`}>
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <span className="font-semibold">HubSeguros</span>
          </Link>

          {/* Búsqueda */}
          <div className="flex-1 max-w-2xl">
            <Input placeholder="Buscar..." className="w-full" />
          </div>

          {/* Breadcrumb */}
          <BreadcrumbList className="flex-1">
            {breadcrumbs.map((breadcrumb, index) => (
              <Breadcrumb key={index}>
                <BreadcrumbLink href={breadcrumb.path}>
                  {breadcrumb.label}
                </BreadcrumbLink>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </Breadcrumb>
            ))}
          </BreadcrumbList>
        </div>

        <div className="flex items-center gap-4">
          {/* Notificaciones */}
          <div ref={notificationsRef} className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Ver notificaciones"
            >
              <BellRing className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
            {showNotifications && (
              <div 
                className="absolute right-0 mt-2 w-80 bg-white border rounded-md shadow-lg p-4"
                role="menu"
                aria-label="Notificaciones"
              >
                <h3 className="font-semibold mb-2">Notificaciones</h3>
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No hay notificaciones
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-md cursor-pointer transition-colors ${
                          notification.read ? '' : 'bg-blue-50 hover:bg-blue-100'
                        }`}
                        onClick={() => {
                          markAsRead(notification.id);
                        }}
                        role="menuitem"
                        aria-label={`Notificación: ${notification.title}`}
                      >
                        <div className="flex items-start gap-3">
                          {getNotificationIcon(notification.type)}
                          <div>
                            <h4 className="font-medium">{notification.title}</h4>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatTimeAgo(notification.date)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Menú de usuario */}
          <UserMenu />
        </div>
      </header>
    </ErrorBoundary>
  );
};

export default Header;
