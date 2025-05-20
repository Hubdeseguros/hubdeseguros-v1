import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { validateRolePermission, Permission } from '@/types/permissions';
import { useNotifications } from '@/hooks/useNotifications';
import { useRoutes } from '@/hooks/useRoutes';
import type { User } from '@/types/auth';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  BarChart2, 
  FileUser, 
  Users, 
  FileText, 
  DollarSign, 
  FilePieChart, 
  Home,
  BellRing
} from 'lucide-react';

type MenuIcon = React.ComponentType<{ size?: string | number; className?: string }>;

interface MenuItem {
  key: string;
  label: string;
  icon: MenuIcon;
  path: string;
  subMenu?: MenuItem[];
  permission?: Permission;
  module?: string;
  target?: string;
}

interface MenuSection {
  title?: string;
  items: MenuItem[];
  isDivider?: boolean;
}

interface SidebarProps {
  onToggleMobileMenu?: () => void;
}

const Sidebar = ({ onToggleMobileMenu }: SidebarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { state: sidebarState, toggleSidebar, open } = useSidebar();
  const collapsed = !open;
  const [activeKey, setActiveKey] = useState('');
  const [menuSections, setMenuSections] = useState<MenuSection[]>([]);
  const [openMenuItems, setOpenMenuItems] = useState<Record<string, boolean>>({});

  // Validar que el usuario exista y tenga rol
  if (!user || !user.role) {
    return <div className="text-red-500">Usuario no autorizado</div>;
  }

  // Obtener las rutas autorizadas para este rol
  const { getAuthorizedRoutes } = useRoutes();
  const authorizedRoutes = getAuthorizedRoutes(user.role);

  // Inicializar el sistema de notificaciones
  const { notifications: notificationsData, unreadCount: unreadNotificationsCount } = useNotifications();
  const { markAsRead } = useNotifications();

  // Cargar el menú basado en el rol del usuario
  useEffect(() => {
    if (user?.role) {
      const menuConfig = getMenuByRole(user.role);
      setMenuSections(menuConfig);
      // Reiniciar los estados de menú al cambiar de rol
      setActiveKey('');
      setOpenMenuItems({});
    }
  }, [user?.role]);

  // Memoizar el menú para mejorar el rendimiento
  const memoizedMenu = useMemo(() => {
    return getMenuByRole(user.role);
  }, [user.role]);

  // Función para obtener el menú basado en el rol
  const getMenuByRole = (role: string): MenuSection[] => {
    const roleRoute = role.toLowerCase();
    const baseMenu: MenuSection[] = [
      {
        title: "PRINCIPAL",
        items: [
          {
            key: 'inicio',
            label: 'Inicio',
            icon: Home,
            path: `/${roleRoute}/dashboard`,
            permission: 'dashboard.view',
            module: 'dashboard'
          },
          {
            key: 'clientes',
            label: 'Clientes',
            icon: Users,
            path: `/${roleRoute}/clientes`,
            permission: 'clientes.view',
            module: 'clientes'
          },
          {
            key: 'polizas',
            label: 'Pólizas',
            icon: FileText,
            path: `/${roleRoute}/polizas`,
            permission: 'polizas.view',
            module: 'polizas'
          },
          {
            key: 'cobranzas',
            label: 'Cobranzas',
            icon: DollarSign,
            path: `/${roleRoute}/cobranzas`,
            permission: 'cobranzas.view',
            module: 'cobranzas'
          }
        ]
      },
      {
        title: "REPORTES",
        items: [
          {
            key: 'reportes-venta',
            label: 'Reportes de Venta',
            icon: BarChart2,
            path: `/${roleRoute}/reportes/venta`,
            permission: 'reportes.venta',
            module: 'reportes'
          },
          {
            key: 'reportes-cobranza',
            label: 'Reportes de Cobranza',
            icon: FilePieChart,
            path: `/${roleRoute}/reportes/cobranza`,
            permission: 'reportes.cobranza',
            module: 'reportes'
          }
        ]
      },
      {
        isDivider: true,
        items: []
      },
      {
        title: "CONFIGURACIÓN",
        items: [
          {
            key: 'usuarios',
            label: 'Usuarios',
            icon: FileUser,
            path: `/${roleRoute}/usuarios`,
            permission: 'usuarios.manage',
            module: 'usuarios'
          },
          {
            key: 'roles',
            label: 'Roles',
            icon: ChevronLeft,
            path: `/${roleRoute}/roles`,
            permission: 'roles.manage',
            module: 'roles'
          }
        ]
      }
    ];

    // Filtrar menú basado en permisos y rutas autorizadas
    return baseMenu.map(section => {
      if (section.isDivider) return section;
      
      const filteredItems = section.items.filter(item => {
        // Verificar si la ruta está autorizada
        const isAuthorizedRoute = authorizedRoutes.includes(item.path);
        // Verificar si el usuario tiene el permiso necesario
        const hasPermission = validateRolePermission(user?.rolePermissions || {}, user?.role || '', item.permission || '');
        return isAuthorizedRoute && hasPermission;
      });

      return {
        ...section,
        items: filteredItems
      };
    }).filter(section => !section.isDivider || section.items.length > 0);
  };

  // Detectar la ruta activa y abrir los submenús correspondientes
  useEffect(() => {
    const path = location.pathname;
    const newOpenItems: Record<string, boolean> = {};
    let foundActiveKey = '';

    if (menuSections) {
      // Buscar coincidencias en los items principales y submenús
      menuSections.forEach(section => {
        section.items.forEach(item => {
          // Verificar si la ruta coincide con el item principal
          if (path === item.path || path.startsWith(item.path + '/')) {
            foundActiveKey = item.key;
            if (item.subMenu) {
              newOpenItems[item.key] = true;
            }
          }
          
          // Verificar si la ruta coincide con algún subitem
          if (item.subMenu) {
            item.subMenu.forEach(subItem => {
              if (path === subItem.path || path.startsWith(subItem.path + '/')) {
                foundActiveKey = subItem.key;
                newOpenItems[item.key] = true;
              }
            });
          }
        });
      });
    }

    // Actualizar el estado solo si hay cambios
    if (foundActiveKey !== activeKey) {
      setActiveKey(foundActiveKey);
    }
    
    setOpenMenuItems(prev => ({
      ...prev,
      ...newOpenItems
    }));
  }, [location.pathname, menuSections]);

  // Manejar clic en un item del menú
  const handleItemClick = (path: string, key: string, target?: string) => {
    try {
      setActiveKey(key);
      
      // Verificar si la ruta es válida
      if (!path.startsWith('/')) {
        console.error('Ruta inválida:', path);
        return;
      }

      // Si el ítem tiene un submenú, no navegamos, solo expandimos/colapsamos
      const menuItem = menuSections
        .flatMap(section => section.items)
        .find(item => item.key === key);
      
      if (menuItem?.subMenu) {
        // Si tiene submenú, no hacemos nada aquí (se maneja en toggleSubMenu)
        return;
      }
      
      // Cerrar el menú móvil si está abierto
      if (onToggleMobileMenu && window.innerWidth < 1024) {
        onToggleMobileMenu();
      }
      
      // Navegar a la ruta correspondiente
      if (target === '_blank') {
        window.open(path, '_blank');
      } else {
        navigate(path);
      }
    } catch (error) {
      console.error('Error al manejar clic en menú:', error);
    }
  };

  // Alternar la apertura/cierre de un submenú
  const toggleSubMenu = (key: string, event: React.MouseEvent) => {
    event.preventDefault();
    setOpenMenuItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Efecto para manejar el estado de los submenús cuando se colapsa la barra lateral
  useEffect(() => {
    if (collapsed) {
      // Cerrar todos los submenús al colapsar
      setOpenMenuItems({});
    }
  }, [collapsed]);

  // Función para renderizar un ítem del menú
  const renderMenuItem = (item: MenuItem, sectionIndex: number, itemIndex: number) => {
    const isActive = activeKey === item.key;
    const isOpen = openMenuItems[item.key] || false;
    const isSubItem = itemIndex > 0;

    return (
      <div key={item.key} className={`relative ${isSubItem ? 'pl-6' : ''}`}>
        <Button
          variant="ghost"
          size={collapsed ? 'icon' : 'default'}
          className={`w-full justify-start ${
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-foreground hover:bg-accent'
          }`}
          onClick={(e) => {
            if (item.subMenu) {
              toggleSubMenu(item.key, e);
            } else {
              handleItemClick(item.path, item.key, item.target);
            }
          }}
        >
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <item.icon className={`h-4 w-4 ${collapsed ? 'mr-0' : 'mr-2'}`} />
            {!collapsed && (
              <span className="truncate">
                {item.label}
                {item.module && (
                  <Badge variant="secondary" className="ml-2">
                    {item.module}
                  </Badge>
                )}
              </span>
            )}
          </div>
        </Button>
        {item.subMenu && isOpen && !collapsed && (
          <div className="pl-6">
            {item.subMenu.map((subItem, subIndex) =>
              renderMenuItem(subItem, sectionIndex, subIndex + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex h-full flex-col bg-sidebar text-sidebar-foreground ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
      {/* Header del sidebar */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <img src="/assets/logo.svg" alt="Hub de Seguros" className="h-8 w-8" />
          {!collapsed && <span className="text-lg font-semibold">Hub de Seguros</span>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="rounded-full"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {menuSections.map((section, sectionIndex) => (
          <div key={`section-${sectionIndex}`} className="mb-2">
            {section.isDivider ? (
              <Separator className="my-3 bg-[#2a3c5a]" />
            ) : (
              <>
                {!collapsed && section.title && (
                  <div className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {section.title}
                  </div>
                )}
                {section.items.map((item, itemIndex) =>
                  renderMenuItem(item, sectionIndex, itemIndex)
                )}
              </>
            )}
          </div>
        ))}
      </nav>

      <div className="border-t border-[#2a3c5a] p-4 space-y-2">
        {/* Notification Link */}
        <Button 
          variant="ghost" 
          size={collapsed ? 'icon' : 'default'}
          onClick={() => navigate(`/notifications`)}
        >
          <div className="flex items-center gap-3">
            <BellRing className="h-4 w-4" />
            {!collapsed && (
              <span className="flex items-center gap-2">
                <span>Notificaciones</span>
                {unreadNotificationsCount > 0 && (
                  <Badge variant="destructive" size="sm">
                    {unreadNotificationsCount}
                  </Badge>
                )}
              </span>
            )}
          </div>
        </Button>

        {/* Logout Button */}
        <Button 
          variant="ghost" 
          size={collapsed ? 'icon' : 'default'}
          onClick={logout}
        >
          <div className="flex items-center gap-3">
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Cerrar sesión</span>}
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

  // Función para obtener el menú basado en el rol
  const getMenuByRole = (role: string): MenuSection[] => {
    const roleRoute = role.toLowerCase();
    const baseMenu: MenuSection[] = [
      {
        title: "PRINCIPAL",
        items: [
          {
            key: 'inicio',
            label: 'Inicio',
            icon: Home,
            path: `/${roleRoute}/dashboard`,
            permission: 'dashboard.view',
            module: 'dashboard'
          },
          {
            key: 'clientes',
            label: 'Clientes',
            icon: Users,
            path: `/${roleRoute}/clientes`,
            permission: 'clientes.view',
            module: 'clientes'
          },
          {
            key: 'polizas',
            label: 'Pólizas',
            icon: FileText,
            path: `/${roleRoute}/polizas`,
            permission: 'polizas.view',
            module: 'polizas'
          },
          {
            key: 'cobranzas',
            label: 'Cobranzas',
            icon: DollarSign,
            path: `/${roleRoute}/cobranzas`,
            permission: 'cobranzas.view',
            module: 'cobranzas'
          }
        ]
      },
      {
        title: "REPORTES",
        items: [
          {
            key: 'reportes-venta',
            label: 'Reportes de Venta',
            icon: BarChart2,
            path: `/${roleRoute}/reportes/venta`,
            permission: 'reportes.venta',
            module: 'reportes'
          },
          {
            key: 'reportes-cobranza',
            label: 'Reportes de Cobranza',
            icon: FilePieChart,
            path: `/${roleRoute}/reportes/cobranza`,
            permission: 'reportes.cobranza',
            module: 'reportes'
          }
        ]
      },
      {
        isDivider: true,
        items: []
      },
      {
        title: "CONFIGURACIÓN",
        items: [
          {
            key: 'usuarios',
            label: 'Usuarios',
            icon: FileUser,
            path: `/${roleRoute}/usuarios`,
            permission: 'usuarios.manage',
            module: 'usuarios'
          },
          {
            key: 'roles',
            label: 'Roles',
            icon: Shield,
            path: `/${roleRoute}/roles`,
            permission: 'roles.manage',
            module: 'roles'
          }
        ]
      }
    ];

    // Filtrar menú basado en permisos y rutas autorizadas
    return baseMenu.map(section => {
      if (section.isDivider) return section;
      
      const filteredItems = section.items.filter(item => {
        // Verificar si la ruta está autorizada
        const isAuthorizedRoute = authorizedRoutes.includes(item.path);
        // Verificar si el usuario tiene el permiso necesario
        const hasPermission = validateRolePermission(user?.rolePermissions || {}, user?.role || '', item.permission || '');
        return isAuthorizedRoute && hasPermission;
      });

      return {
        ...section,
        items: filteredItems
      };
    }).filter(section => !section.isDivider || section.items.length > 0);
  };

  // Detectar la ruta activa y abrir los submenús correspondientes
  useEffect(() => {
    const path = location.pathname;
    const newOpenItems: Record<string, boolean> = {};
    let foundActiveKey = '';

    if (menuSections) {
      // Buscar coincidencias en los items principales y submenús
      menuSections.forEach(section => {
        section.items.forEach(item => {
          // Verificar si la ruta coincide con el item principal
          if (path === item.path || path.startsWith(item.path + '/')) {
            foundActiveKey = item.key;
            if (item.subMenu) {
              newOpenItems[item.key] = true;
            }
          }
          
          // Verificar si la ruta coincide con algún subitem
          if (item.subMenu) {
            item.subMenu.forEach(subItem => {
              if (path === subItem.path || path.startsWith(subItem.path + '/')) {
                foundActiveKey = subItem.key;
                newOpenItems[item.key] = true;
              }
            });
          }
        });
      });
    }

    // Actualizar el estado solo si hay cambios
    if (foundActiveKey !== activeKey) {
      setActiveKey(foundActiveKey);
    }
    
    setOpenMenuItems(prev => ({
      ...prev,
      ...newOpenItems
    }));
  }, [location.pathname, menuSections]);

  // Manejar clic en un item del menú
  const handleItemClick = (path: string, key: string, target?: string) => {
    try {
      setActiveKey(key);
      
      // Verificar si la ruta es válida
      if (!path.startsWith('/')) {
        console.error('Ruta inválida:', path);
        return;
      }

      // Si el ítem tiene un submenú, no navegamos, solo expandimos/colapsamos
      const menuItem = menuSections
        .flatMap(section => section.items)
        .find(item => item.key === key);
      
      if (menuItem?.subMenu) {
        // Si tiene submenú, no hacemos nada aquí (se maneja en toggleSubMenu)
        return;
      }
      
      // Cerrar el menú móvil si está abierto
      if (onToggleMobileMenu && window.innerWidth < 1024) {
        onToggleMobileMenu();
      }
      
      // Navegar a la ruta correspondiente
      if (target === '_blank') {
        window.open(path, '_blank');
      } else {
        navigate(path);
      }
    } catch (error) {
      console.error('Error al manejar clic en menú:', error);
    }
  };

  // Alternar la apertura/cierre de un submenú
  const toggleSubMenu = (key: string, event: React.MouseEvent) => {
    event.preventDefault();
    setOpenMenuItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Efecto para manejar el estado de los submenús cuando se colapsa la barra lateral
  useEffect(() => {
    if (collapsed) {
      // Cerrar todos los submenús al colapsar
      setOpenMenuItems({});
    }
  }, [collapsed]);

  // Función para renderizar un ítem del menú
  const renderMenuItem = (item: MenuItem, sectionIndex: number, itemIndex: number) => {
    const isActive = activeKey === item.key;
    const isOpen = openMenuItems[item.key] || false;
    const isSubItem = itemIndex > 0;

    return (
      <div key={item.key} className={`relative ${isSubItem ? 'pl-6' : ''}`}>
        <Button
          variant="ghost"
          size={collapsed ? 'icon' : 'default'}
          className={`w-full justify-start ${
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-foreground hover:bg-accent'
          }`}
          onClick={(e) => {
            if (item.subMenu) {
              toggleSubMenu(item.key, e);
            } else {
              handleItemClick(item.path, item.key, item.target);
            }
          }}
        >
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <item.icon className={`h-4 w-4 ${collapsed ? 'mr-0' : 'mr-2'}`} />
            {!collapsed && (
              <span className="truncate">
                {item.label}
                {item.module && (
                  <Badge variant="secondary" className="ml-2">
                    {item.module}
                  </Badge>
                )}
              </span>
            )}
          </div>
        </Button>
        {item.subMenu && isOpen && !collapsed && (
          <div className="pl-6">
            {item.subMenu.map((subItem, subIndex) =>
              renderMenuItem(subItem, sectionIndex, subIndex + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex h-full flex-col bg-sidebar text-sidebar-foreground ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
      {/* Header del sidebar */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <img src="/assets/logo.svg" alt="Hub de Seguros" className="h-8 w-8" />
          {!collapsed && <span className="text-lg font-semibold">Hub de Seguros</span>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="rounded-full"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {menuSections.map((section, sectionIndex) => (
          <div key={`section-${sectionIndex}`} className="mb-2">
            {section.isDivider ? (
              <Separator className="my-3 bg-[#2a3c5a]" />
            ) : (
              <>
                {!collapsed && section.title && (
                  <div className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {section.title}
                  </div>
                )}
                {section.items.map((item, itemIndex) =>
                  renderMenuItem(item, sectionIndex, itemIndex)
                )}
              </>
            )}
          </div>
        ))}
      </nav>

      <div className="border-t border-[#2a3c5a] p-4 space-y-2">
        {/* Notification Link */}
        <Button 
          variant="ghost" 
          size={collapsed ? 'icon' : 'default'}
          onClick={() => navigate(`/notifications`)}
        >
          <div className="flex items-center gap-3">
            <BellRing className="h-4 w-4" />
            {!collapsed && (
              <span className="flex items-center gap-2">
                <span>Notificaciones</span>
                {unreadNotificationsCount > 0 && (
                  <Badge variant="destructive" size="sm">
                    {unreadNotificationsCount}
                  </Badge>
                )}
              </span>
            )}
          </div>
        </Button>

        {/* Logout Button */}
        <Button 
          variant="ghost" 
          size={collapsed ? 'icon' : 'default'}
          onClick={logout}
        >
          <div className="flex items-center gap-3">
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Cerrar sesión</span>}
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

  // Detectar la ruta activa y abrir los submenús correspondientes
  useEffect(() => {
    const path = location.pathname;
    const newOpenItems: Record<string, boolean> = {};
    let foundActiveKey = '';

    if (menuSections) {
      // Buscar coincidencias en los items principales y submenús
      menuSections.forEach(section => {
        section.items.forEach(item => {
          // Verificar si la ruta coincide con el item principal
          if (path === item.path || path.startsWith(item.path + '/')) {
            foundActiveKey = item.key;
            if (item.subMenu) {
              newOpenItems[item.key] = true;
            }
          }
          
          // Verificar si la ruta coincide con algún subitem
          if (item.subMenu) {
            item.subMenu.forEach(subItem => {
              if (path === subItem.path || path.startsWith(subItem.path + '/')) {
                foundActiveKey = subItem.key;
                newOpenItems[item.key] = true;
              }
            });
          }
        });
      });
    }

    // Actualizar el estado solo si hay cambios
    if (foundActiveKey !== activeKey) {
      setActiveKey(foundActiveKey);
    }
    
    setOpenMenuItems(prev => ({
      ...prev,
      ...newOpenItems
    }));
  }, [location.pathname, menuSections]);

  // Manejar clic en un item del menú
  const handleItemClick = (path: string, key: string, target?: string) => {
    try {
      setActiveKey(key);
      
      // Verificar si la ruta es válida
      if (!path.startsWith('/')) {
        console.error('Ruta inválida:', path);
        return;
      }

      // Si el ítem tiene un submenú, no navegamos, solo expandimos/colapsamos
      const menuItem = menuSections
        .flatMap(section => section.items)
        .find(item => item.key === key);
      
      if (menuItem?.subMenu) {
        // Si tiene submenú, no hacemos nada aquí (se maneja en toggleSubMenu)
        return;
      }
      
      // Cerrar el menú móvil si está abierto
      if (onToggleMobileMenu && window.innerWidth < 1024) {
        onToggleMobileMenu();
      }
      
      // Navegar a la ruta correspondiente
      if (target === '_blank') {
        window.open(path, '_blank');
      } else {
        navigate(path);
      }
    } catch (error) {
      console.error('Error al manejar clic en menú:', error);
    }
  };

  const handleToggleCollapse = () => {
    toggleSidebar();
    // Si hay un manejador de menú móvil y estamos en móvil, lo cerramos
    if (onToggleMobileMenu && window.innerWidth < 1024) {
      onToggleMobileMenu();
    }
  };

  // Alternar la apertura/cierre de un submenú
  const toggleSubMenu = (key: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenMenuItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Efecto para manejar el estado de los submenús cuando se colapsa la barra lateral
  useEffect(() => {
    if (collapsed) {
      // Cerrar todos los submenús al colapsar
      const updatedMenu = menuSections.map(section => ({
        ...section,
        items: section.items.map(item => ({
          ...item,
          isOpen: false
        }))
      }));
      setMenuSections(updatedMenu);
      // También limpiar los estados de apertura de submenús
      setOpenMenuItems({});
    }
  }, [collapsed]);

  const getMenuByRole = (role: string): MenuSection[] => {
    const roleRoute = role.toLowerCase();
    const baseMenu: MenuSection[] = [
      {

  // Filtrar menú basado en permisos y rutas autorizadas
  return baseMenu.map(section => {
    if (section.isDivider) return section;
    
    const filteredItems = section.items.filter(item => {
      // Verificar si la ruta está autorizada
      const isAuthorizedRoute = authorizedRoutes.includes(item.path);
      // Verificar si el usuario tiene el permiso necesario
      const hasPermission = validateRolePermission(user?.rolePermissions || {}, user?.role || '', item.permission || '');
      return isAuthorizedRoute && hasPermission;
    });

    return {
      ...section,
      items: filteredItems
    };
  }).filter(section => !section.isDivider || section.items.length > 0);
};
                icon: Laptop,
                path: `/${roleRoute}/clientes/crm`
              }
            ]
          },
          {
            key: 'polizas',
            label: 'Pólizas',
            icon: Users,
            path: `/${roleRoute}/polizas`,
            isOpen: true,
            subMenu: [
              {
                key: 'listado-polizas',
                label: 'Listado de Pólizas',
                icon: Users,
                path: `/${roleRoute}/polizas/listado`
              },
              {
                key: 'cumplimiento',
                label: 'Cumplimiento, Judicial, etc',
                icon: Users,
                path: `/${roleRoute}/polizas/cumplimiento`
              }
            ]
          },
          {
            key: 'remisiones',
            label: 'Remisiones',
            icon: CheckSquare,
            path: `/${roleRoute}/remisiones`
          },
          {
            key: 'tareas',
            label: 'Tareas',
            icon: FileText,
            path: `/${roleRoute}/tareas`
          },
          {
            key: 'cobros',
            label: 'Cobros',
            icon: DollarSign,
            path: `/${roleRoute}/cobros`,
            subMenu: [
              {
                key: 'listado-pagos',
                label: 'Listado de pagos',
                icon: DollarSign,
                path: `/${roleRoute}/cobros/listado`
              },
              {
                key: 'pagos-pendientes',
                label: 'Pagos Pendientes',
                icon: DollarSign,
                path: `/${roleRoute}/cobros/pendientes`
              },
              {
                key: 'recibos',
                label: 'Recibos y Cuadre de caja',
                icon: Box,
                path: `/${roleRoute}/cobros/recibos`
              },
              {
                key: 'liquidar',
                label: 'Liquidar vendedores',
                icon: Clipboard,
                path: `/${roleRoute}/cobros/liquidar`
              }
            ]
          },
          {
            key: 'informes',
            label: 'Informes',
            icon: FilePieChart,
            path: `/${roleRoute}/informes`
          }
        ]
      },
      {
        isDivider: true,
        items: []
      },
      {
        title: "GESTIÓN",
        items: [
          {
            key: 'archivos',
            label: 'Archivos',
            icon: File,
            path: `/${roleRoute}/archivos`
          },
          {
            key: 'siniestros',
            label: 'Siniestros',
            icon: AlertTriangle,
            path: `/${roleRoute}/siniestros`
          },
          {
            key: 'facturas',
            label: 'Facturas',
                  icon: Grid,
                  path: `/${roleRoute}/configuracion/ramos`
                },
                {
                  key: 'vendedores',
                  label: 'Vendedores',
                  icon: List,
                  path: `/${roleRoute}/configuracion/vendedores`
                },
                {
                  key: 'estados-siniestros',
                  label: 'Estados Siniestros',
                  icon: Mail,
                  path: `/${roleRoute}/configuracion/estados-siniestros`
                },
                {
                  key: 'estados-arl',
                  label: 'Estados ARL',
                  icon: AlertTriangle,
                  path: `/${roleRoute}/configuracion/estados-arl`
                },
                {
                  key: 'motivos-estados',
                  label: 'Motivos estados póliza',
                  icon: FileText,
                  path: `/${roleRoute}/configuracion/motivos-estados`
                },
                {
                  key: 'tipo-afiliacion',
                  label: 'Tipo afiliación',
                  icon: Clipboard,
                  path: `/${roleRoute}/configuracion/tipo-afiliacion`
                },
                {
                  key: 'mensajeros',
                  label: 'Mensajeros',
                  icon: Mail,
                  path: `/${roleRoute}/configuracion/mensajeros`
                },
                {
                  key: 'coberturas',
                  label: 'Coberturas',
                  icon: List,
                  path: `/${roleRoute}/configuracion/coberturas`
                },
                {
                  key: 'promotores',
                  label: 'Gestión de Promotores',
                  icon: UserPlus,
                  path: `/${roleRoute}/configuracion/promotores`
                },
                {
                  key: 'registrar-cliente',
                  label: 'Registrar Cliente',
                  icon: UserPlus,
                  path: `/${roleRoute}/promotores/clientes/registrar`
                }
              ]
            },
            {
              key: 'importar-plantillas',
              label: 'Importar Plantillas',
              icon: Upload,
              path: `/${roleRoute}/importar`,
              subMenu: [
                {
                  key: 'imp-aseguradoras',
                  label: 'Aseguradoras',
                  icon: Shield,
                  path: `/${roleRoute}/importar/aseguradoras`,
                  target: '_blank'
                },
                {
                  key: 'imp-ramos',
                  label: 'Ramos',
                  icon: Grid,
                  path: `/${roleRoute}/importar/ramos`,
                  target: '_blank'
                },
                {
                  key: 'imp-vendedores',
                  label: 'Vendedores',
                  icon: List,
                  path: `/${roleRoute}/importar/vendedores`,
                  target: '_blank'
                },
                {
                  key: 'imp-clientes',
                  label: 'Clientes',
                  icon: FileUser,
                  path: `/${roleRoute}/importar/clientes`,
                  target: '_blank'
                },
                {
                  key: 'imp-polizas',
                  label: 'Pólizas',
                  icon: Users,
                  path: `/${roleRoute}/importar/polizas`,
                  target: '_blank'
                },
                {
                  key: 'imp-polizas-cumplimiento',
                  label: 'Pólizas de cumplimiento y judicial',
                  icon: Users,
                  path: `/${roleRoute}/importar/polizas-cumplimiento`,
                  target: '_blank'
                },
                {
                  key: 'imp-campos-ramo',
                  label: 'Campos adicionales por ramo',
                  icon: Grid,
                  path: `/${roleRoute}/importar/campos-ramo`
                },
                {
                  key: 'imp-anexos',
                  label: 'Anexos',
                  icon: Paperclip,
                  path: `/${roleRoute}/importar/anexos`,
                  target: '_blank'
                },
                {
                  key: 'imp-cobros',
                  label: 'Cobros',
                  icon: DollarSign,
                  path: `/${roleRoute}/importar/cobros`,
                  target: '_blank'
                },
                {
                  key: 'imp-vinculados',
                  label: 'Vinculados pólizas colectivas',
                  icon: Users,
                  path: `/${roleRoute}/importar/vinculados`,
                  target: '_blank'
                },
                {
                  key: 'imp-beneficiarios',
                  label: 'Beneficiarios',
                  icon: UserPlus,
                  path: `/${roleRoute}/importar/beneficiarios`,
                  target: '_blank'
                },
                {
                  key: 'imp-crm',
                  label: 'Asistente Comercial/CRM',
                  icon: Laptop,
                  path: `/${roleRoute}/importar/crm`,
                  target: '_blank'
                },
                {
                  key: 'imp-siniestros',
                  label: 'Importar Siniestros',
                  icon: AlertTriangle,
                  path: `/${roleRoute}/importar/siniestros`,
                  target: '_blank'
                },
                {
                  key: 'imp-amparos',
                  label: 'Importar Amparos Siniestros',
                  icon: AlertTriangle,
                  path: `/${roleRoute}/importar/amparos`,
                  target: '_blank'
                },
                {
                  key: 'imp-coberturas',
                  label: 'Coberturas',
                  icon: List,
                  path: `/${roleRoute}/importar/coberturas`,
                  target: '_blank'
                },
                {
                  key: 'imp-tareas',
                  label: 'Tareas',
                  icon: FileText,
                  path: `/${roleRoute}/importar/tareas`,
                  target: '_blank'
                },
                {
                  key: 'imp-datos-adicionales',
                  label: 'Importar datos adicionales de clientes',
                  icon: FileText,
                  path: `/${roleRoute}/importar/datos-adicionales`
                }
              ]
            }
          ]
        }
      );
    }

    if (role === 'CLIENTE') {
      return [
        {
          title: "MI CUENTA",
          items: [
            {
              key: 'inicio',
              label: 'Inicio',
              icon: Home,
              path: `/usuario/dashboard`
            },
            {
              key: 'mis-polizas',
              label: 'Mis Pólizas',
              icon: Users,
              path: `/usuario/mis-polizas`
            },
            {
              key: 'siniestros',
              label: 'Siniestros',
              icon: AlertTriangle,
              path: `/usuario/siniestros`
            },
            {
              key: 'pagos',
              label: 'Pagos',
              icon: DollarSign,
              path: `/usuario/pagos`
            },
            {
              key: 'documentos',
              label: 'Documentos',
              icon: File,
              path: `/usuario/documentos`
            },
            {
              key: 'cotizaciones',
              label: 'Cotizaciones',
              icon: FileText,
              path: `/usuario/cotizaciones`
            }
          ]
        }
      ];
    }
    return baseMenu;
  };

  if (!user) return null;

  return (
    <div className={`flex h-full flex-col bg-sidebar text-sidebar-foreground ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
      {/* Header del sidebar */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <img src="/assets/logo.svg" alt="Hub de Seguros" className="h-8 w-8" />
          <h1 className="text-xl font-bold">Hub de Seguros</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleCollapse}
          className="hidden md:block"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      {/* Información del usuario */}
      <div className={`${collapsed ? 'py-4 px-2' : 'p-4'} border-b border-[#2a3c5a]`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white font-medium">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
          {!collapsed && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'Usuario'}</p>
              <p className="text-xs text-gray-300 truncate">{user?.role || 'Rol'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Menú de navegación */}
      <nav className="flex-1 overflow-y-auto py-2">
        {menuSections.map((section, sectionIndex) => (
          <div key={`section-${sectionIndex}`} className="mb-2">
            {section.isDivider ? (
              <Separator className="my-3 bg-[#2a3c5a]" />
            ) : (
              <div className="mb-2">
                {!collapsed && section.title && (
                  <h3 className="text-xs font-semibold tracking-wider uppercase text-gray-400 mb-2 px-4">
                    {section.title}
                  </h3>
                )}
                <ul>
                  {section.items.map((item) => (
                    <li key={item.key} className="mb-0.5">
                      {/* Item principal */}
                      <div 
                        className={`flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#2a3c5a] rounded-md 
                          transition-all duration-150 cursor-pointer select-none 
                          ${activeKey === item.key ? 'bg-[#2a3c5a] font-medium text-blue-400' : ''}`}
                        onClick={(e) => {
                          if (item.subMenu) {
                            toggleSubMenu(item.key, e);
                          } else {
                            handleItemClick(item.path, item.key, item.target);
                          }
                        }}
                      >
                        <div className="mr-2 min-w-[24px] flex justify-center items-center">
                          {item.icon && <item.icon size={18} />}
                        </div>
                        {!collapsed && (
                          <div className="flex justify-between items-center w-full">
                            <span>{item.label}</span>
                            {item.subMenu && (
                              <ChevronRight 
                                size={16} 
                                className={`transition-transform duration-200 ${openMenuItems[item.key] ? 'rotate-90' : ''}`} 
                              />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Submenú */}
                      {item.subMenu && (
                        <div 
                          className={`overflow-hidden transition-all duration-200 ease-in-out pl-6 
                            ${openMenuItems[item.key] ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}
                        >
                          <ul className="border-l border-[#2a3c5a] pl-2">
                            {item.subMenu.map((subItem) => (
                              <li key={subItem.key} className="mb-0.5">
                                <div 
                                  className={`flex items-center px-4 py-1.5 text-sm text-gray-300 hover:bg-[#2a3c5a] rounded-md 
                                    transition-colors duration-150 cursor-pointer select-none 
                                    ${activeKey === subItem.key ? 'bg-[#2a3c5a] font-medium text-blue-400' : ''}`}
                                  onClick={() => handleItemClick(subItem.path, subItem.key, subItem.target)}
                                >
                                  <div className="mr-2 min-w-[24px] flex justify-center items-center">
                                    {subItem.icon && <subItem.icon size={16} />}
                                  </div>
                                  {!collapsed && <span>{subItem.label}</span>}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer del sidebar */}
      <div className="border-t border-[#2a3c5a] p-4 space-y-2">
        {/* Notification Link */}
        <Button 
          variant="ghost" 
          size={collapsed ? 'icon' : 'default'}
          className={`w-full flex items-center justify-${collapsed ? 'center' : 'start'} text-gray-300 hover:bg-[#2a3c5a] hover:text-white relative`}
          onClick={() => navigate('/notificaciones')}
        >
          <div className="relative">
            <BellRing size={18} className={collapsed ? '' : 'mr-2'} />
            {unreadCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs"
                variant="destructive"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </div>
          {!collapsed && <span>Notificaciones</span>}
        </Button>
        
        {/* Logout Button */}
        <Button 
          variant="ghost" 
          size={collapsed ? 'icon' : 'default'}
          className={`w-full flex items-center justify-${collapsed ? 'center' : 'start'} text-gray-300 hover:bg-[#2a3c5a] hover:text-white`}
          onClick={logout}
        >
          <LogOut size={18} className={collapsed ? '' : 'mr-2'} />
          {!collapsed && <span>Cerrar Sesión</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
