import React, { useState, useReducer, useCallback, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
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
  Info
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

// Importamos solo UserRole del auth para compatibilidad
import { UserRole, User } from '../../types/auth';

// Definimos un tipo para los permisos como string
type Permission = string;

// Función auxiliar para verificar permisos
const hasPermission = (user: User | null | undefined, permission: Permission): boolean => {
  if (!user || !user.permissions) return false;
  
  // Verificamos si el usuario tiene el permiso específico
  return user.permissions.some(perm => 
    // Comparamos el permiso como string para evitar problemas de tipos
    typeof perm === 'string' ? perm === permission : perm.toString() === permission
  );
};

type HeaderProps = {
  className?: string;
};

type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  date: Date;
  link?: string;
}

type NotificationsState = {
  notifications: Notification[];
  unreadCount: number;
};

type NotificationsAction =
  | { type: 'MARK_AS_READ'; id: string }
  | { type: 'MARK_ALL_AS_READ' };

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
  
  // Estado para notificaciones
  const [notificationsState, dispatchNotifications] = useReducer(notificationsReducer, {
    notifications: defaultNotifications,
    unreadCount: defaultNotifications.filter(n => !n.read).length
  });
  
  // Estado para la búsqueda
  const [searchValue, setSearchValue] = useState('');
  
  // Estado para mostrar menús desplegables
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Obtener rutas de migas de pan
  const getBreadcrumbs = useCallback((): BreadcrumbItemType[] => {
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItemType[] = [{ label: 'Inicio', path: '/' }];
    
    let currentPath = '';
    paths.forEach(path => {
      currentPath += `/${path}`;
      const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
      breadcrumbs.push({ label, path: currentPath });
    });
    
    return breadcrumbs;
  }, [location.pathname]);
  
  const breadcrumbs = useMemo(() => getBreadcrumbs(), [getBreadcrumbs]);
  
  // Manejadores de eventos
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de búsqueda
    console.log('Búsqueda:', searchValue);
  }, [searchValue]);
  
  const handleNotificationRead = useCallback((id: string) => {
    dispatchNotifications({ type: 'MARK_AS_READ', id });
    // Aquí puedes implementar una llamada a la API para actualizar el estado de la notificación
  }, []);
  
  const handleMarkAllAsRead = useCallback(() => {
    dispatchNotifications({ type: 'MARK_ALL_AS_READ' });
    // Aquí puedes implementar una llamada a la API para actualizar el estado de todas las notificaciones
  }, []);
  
  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);
  
  // Opciones del menú de usuario
  const userMenuItems = useMemo((): UserMenuItem[] => [
    {
      icon: <UserIcon size={16} />,
      label: 'Mi Perfil',
      onClick: () => navigate('/profile'),
    },
    {
      icon: <Settings size={16} />,
      label: 'Configuración',
      onClick: () => navigate('/settings'),
      permission: 'settings.view',
      dividerAfter: true
    },
    {
      icon: <Shield size={16} />,
      label: 'Administración',
      onClick: () => navigate('/admin'),
      permission: 'admin.access'
    },
    {
      icon: <LogOut size={16} />,
      label: 'Cerrar Sesión',
      onClick: handleLogout,
      dividerAfter: true
    }
  ], [navigate, handleLogout]);
  
  // Filtrar opciones del menú según permisos del usuario
  const filteredUserMenuItems = useMemo(() => 
    userMenuItems.filter(item => 
      !item.permission || (user && hasPermission(user, item.permission))
    ),
  [userMenuItems, user]);
  
  // Renderizado del componente
  return (
    <ErrorBoundary>
      <header className={cn("w-full bg-white border-b border-gray-200 z-50", className)}>
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo y breadcrumbs */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="font-bold text-xl text-primary">
              HubDeSeguros
            </Link>
            
            <Breadcrumb className="hidden md:flex">
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.path}>
                    {index < breadcrumbs.length - 1 ? (
                      <>
                        <BreadcrumbItem>
                          <BreadcrumbLink asChild>
                            <Link to={crumb.path}>{crumb.label}</Link>
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                      </>
                    ) : (
                      <BreadcrumbItem>
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      </BreadcrumbItem>
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          {/* Búsqueda, notificaciones y menú de usuario */}
          <div className="flex items-center space-x-2">
            {/* Búsqueda */}
            <form onSubmit={handleSearch} className="relative hidden md:block mr-2">
              <Input
                type="search"
                placeholder="Buscar..."
                className="w-[200px] lg:w-[300px] h-9 pl-8"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </form>
            
            {/* Notificaciones */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <BellRing className="h-5 w-5" />
                  {notificationsState.unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {notificationsState.unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[380px]">
                <DropdownMenuLabel className="flex justify-between items-center">
                  <span>Notificaciones</span>
                  {notificationsState.unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      className="text-xs h-8"
                    >
                      Marcar todas como leídas
                    </Button>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notificationsState.notifications.length === 0 ? (
                  <div className="px-2 py-4 text-center text-muted-foreground">
                    No tienes notificaciones
                  </div>
                ) : (
                  <div className="max-h-[300px] overflow-auto">
                    {notificationsState.notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className={cn(
                          "flex flex-col items-start p-3 cursor-default",
                          !notification.read && "bg-muted/50"
                        )}
                        onClick={() => handleNotificationRead(notification.id)}
                      >
                        <div className="flex w-full justify-between items-start">
                          <div className="flex items-center">
                            {notification.type === 'success' && <Check className="h-4 w-4 mr-2 text-green-500" />}
                            {notification.type === 'warning' && <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />}
                            {notification.type === 'error' && <AlertCircle className="h-4 w-4 mr-2 text-red-500" />}
                            {notification.type === 'info' && <Info className="h-4 w-4 mr-2 text-blue-500" />}
                            <span className="font-medium">{notification.title}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(notification.date)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      </DropdownMenuItem>
                    ))}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Menú de usuario */}
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
                    <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {filteredUserMenuItems.map((item, index) => (
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