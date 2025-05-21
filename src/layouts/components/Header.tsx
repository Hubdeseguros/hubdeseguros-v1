import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Search, Check, AlertCircle, BellRing, Bell } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { UserRole } from '@/types/auth';
import ErrorBoundary from '@/components/ErrorBoundary';

interface HeaderProps {
  className?: string;
}

interface Breadcrumb {
  label: string;
  path: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

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

// Componente UserMenu
const UserMenu: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Avatar>
            <AvatarImage src={user?.avatar || '/logo.png'} />
            <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => navigate('/perfil')}>Mi Perfil</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/configuracion')}>Configuración</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/ayuda')}>Ayuda</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/logout')}>Cerrar Sesión</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [pageTitle, setPageTitle] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);

  const unreadCount = notifications?.filter?.(n => !n.read)?.length || 0;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const getNotificationIcon = (type: Notification['type']) => {
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
  };

  const formatTimeAgo = useCallback((date: Date) => {
    try {
      if (!date) return 'hace unos segundos';
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
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'hace unos segundos';
    }
  }, []);

  // Cerrar notificaciones al hacer clic fuera
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

  useEffect(() => {
    try {
      const pathSegments = location.pathname.split('/').filter(Boolean);
      const newBreadcrumbs: Breadcrumb[] = [];
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
      <header className={`h-16 bg-white border-b border-gray-200 ${className}`}>
        <div className="flex h-full items-center justify-between px-6">
          {/* Breadcrumbs */}
          <div className="flex flex-col">
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumbs?.map?.((breadcrumb, index) => (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href={breadcrumb.path}>
                      {breadcrumb.label}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              ))}
            </Breadcrumb>
            <h1 className="text-xl font-bold text-hubseguros-dark mt-1">
              {pageTitle || 'Sin título'}
            </h1>
          </div>

          {/* Barra de búsqueda y acciones */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar..."
                className="w-64 pl-9 rounded-full bg-gray-50"
              />
            </div>
            
            <Separator orientation="vertical" className="h-8" />
            
            <div className="relative" ref={notificationsRef}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </Button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                  <div className="flex items-center justify-between p-3 border-b border-gray-200">
                    <h3 className="font-medium text-gray-900">Notificaciones</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800"
                      onClick={markAllAsRead}
                    >
                      Marcar todo como leído
                    </Button>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications?.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {notifications?.map?.((notification) => (
                          <div 
                            key={notification.id}
                            className={`p-3 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start gap-2">
                              <div className="mt-0.5">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                    {notification.title}
                                  </h4>
                                  <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                                    {formatTimeAgo(notification.date)}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {notification.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No hay notificaciones
                      </div>
                    )}
                  </div>
                  
                  <div className="p-2 border-t border-gray-200 text-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs text-blue-600 hover:text-blue-800"
                      onClick={() => {
                        navigate('/notificaciones');
                        setShowNotifications(false);
                      }}
                    >
                      Ver todas las notificaciones
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <Button variant="ghost" size="icon" className="relative">
              <Mail size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
            
            <Separator orientation="vertical" className="h-8" />
            
            <UserMenu />
          </div>
        </div>
      </header>
    </ErrorBoundary>
  );
};


export default Header;
