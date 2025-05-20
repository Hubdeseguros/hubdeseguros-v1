import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { validateRolePermission } from '@/types/permissions';
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
  BellRing,
  Settings,
  User
} from 'lucide-react';

type MenuIcon = React.ComponentType<{ size?: string | number; className?: string }>;

interface MenuItem {
  key: string;
  label: string;
  icon: MenuIcon;
  path: string;
  subMenu?: MenuItem[];
  permission?: string;
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
  const { user, logout, hasPermission, hasRoleAccess } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { open: isOpen } = useSidebar();
  const collapsed = false; // Siempre expandido

  // Estados del menú
  const [activeKey, setActiveKey] = useState('');
  const [openMenuItems, setOpenMenuItems] = useState<Record<string, boolean>>({});
  const [unreadCount, setUnreadCount] = useState(3); // Simulación de notificaciones no leídas

  // Función para obtener el menú basado en el rol
  const getMenuByRole = (roleId: string): MenuSection[] => {
    // Menú base para cualquier rol
    const baseMenu: MenuSection[] = [
      {
        title: "PRINCIPAL",
        items: [
          {
            key: 'inicio',
            label: 'Inicio',
            icon: Home,
            path: `/dashboard`,
            permission: 'dashboard.view'
          },
          {
            key: 'clientes',
            label: 'Clientes',
            icon: Users,
            path: `/clientes`,
            permission: 'clientes.view'
          },
          {
            key: 'polizas',
            label: 'Pólizas',
            icon: FileText,
            path: `/polizas`,
            permission: 'polizas.view'
          },
          {
            key: 'cobranzas',
            label: 'Cobranzas',
            icon: DollarSign,
            path: `/cobranzas`,
            permission: 'cobranzas.view'
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
            path: `/reportes/venta`,
            permission: 'reportes.venta.view'
          },
          {
            key: 'reportes-cobranza',
            label: 'Reportes de Cobranza',
            icon: FilePieChart,
            path: `/reportes/cobranza`,
            permission: 'reportes.cobranza.view'
          },
          {
            key: 'reportes-clientes',
            label: 'Reportes de Clientes',
            icon: Users,
            path: `/reportes/clientes`,
            permission: 'reportes.clientes.view'
          },
          {
            key: 'reportes-polizas',
            label: 'Reportes de Pólizas',
            icon: FileText,
            path: `/reportes/polizas`,
            permission: 'reportes.polizas.view'
          }
        ]
      },
      {
        isDivider: true,
        items: []
      },
      {
        title: "AGENCIA",
        items: [
          {
            key: 'agencia-perfil',
            label: 'Mi Perfil',
            icon: User,
            path: `/agencia/perfil`,
            permission: 'agencia.perfil.view'
          },
          {
            key: 'agencia-configuracion',
            label: 'Configuración',
            icon: Settings,
            path: `/agencia/configuracion`,
            permission: 'agencia.configuracion.view'
          },
          {
            key: 'agencia-documentos',
            label: 'Documentos',
            icon: FileText,
            path: `/agencia/documentos`,
            permission: 'agencia.documentos.view'
          },
          {
            key: 'agencia-notificaciones',
            label: 'Notificaciones',
            icon: BellRing,
            path: `/agencia/notificaciones`,
            permission: 'agencia.notificaciones.view'
          }
        ]
      }
    ];

    // Filtrar menú según permisos del usuario
    return baseMenu.map(section => ({
      ...section,
      items: section.items.filter(item => {
        if (!item.permission) return true;
        return hasPermission(item.permission);
      })
    }));
  };

  // Cargar el menú basado en el rol del usuario
  const [menuSections, setMenuSections] = useState<MenuSection[]>([]);
  useEffect(() => {
    if (user) {
      const menuConfig = getMenuByRole(user.role); // <-- FIXED: pass user.role instead of user.role.id
      setMenuSections(menuConfig);
      setActiveKey('');
      setOpenMenuItems({});
    }
  }, [user]);

  // Detectar la ruta activa
  useEffect(() => {
    const path = location.pathname;
    let foundActiveKey = '';

    menuSections.forEach(section => {
      if (!section.isDivider) {
        section.items.forEach(item => {
          if (path === item.path || path.startsWith(item.path + '/')) {
            foundActiveKey = item.key;
          }
          
          if (item.subMenu) {
            item.subMenu.forEach(subItem => {
              if (path === subItem.path || path.startsWith(subItem.path + '/')) {
                foundActiveKey = subItem.key;
                setOpenMenuItems(prev => ({ ...prev, [item.key]: true }));
              }
            });
          }
        });
      }
    });

    if (foundActiveKey) {
      setActiveKey(foundActiveKey);
    }
  }, [location.pathname, menuSections]);

  // Función para manejar el clic en un ítem del menú
  const handleItemClick = (path: string, key: string, target?: string) => {
    setActiveKey(key);
    
    if (target === '_blank') {
      window.open(path, '_blank');
    } else {
      navigate(path);
    }
    
    if (onToggleMobileMenu) {
      onToggleMobileMenu();
    }
  };

  // Alternar la apertura/cierre de un submenú
  const toggleSubMenu = (key: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenMenuItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!user) return null;

  return (
    <div className={`relative flex h-full flex-col bg-sidebar text-sidebar-foreground w-64 transition-all duration-300`}>
      {/* Header del sidebar */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <img src="/assets/logo.svg" alt="Hub de Seguros" className="h-8 w-8" />
          <h1 className="text-xl font-semibold">Hub de Seguros</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={logout}
          className="text-red-500 hover:text-red-700"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {menuSections.map((section, sectionIndex) => (
          <div key={`section-${sectionIndex}`} className="mb-2">
            {section.isDivider ? (
              <Separator className="my-3 bg-[#2a3c5a]" />
            ) : (
              <>
                {section.title && (
                  <div className="px-3 py-1 text-sm font-medium text-sidebar-foreground/70">
                    {section.title}
                  </div>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <div key={item.key}>
                      {item.subMenu ? (
                        <div className="relative">
                          <Button
                            variant="ghost"
                            className={`w-full justify-start px-3 py-2 text-left text-sm font-medium transition-colors ${
                              activeKey === item.key ? 'bg-sidebar-hover' : ''
                            }`}
                            onClick={(e) => toggleSubMenu(item.key, e)}
                          >
                            <div className="flex items-center gap-2">
                              <item.icon className="h-4 w-4" />
                              <span>{item.label}</span>
                              <ChevronRight className="h-4 w-4 transition-transform ${
                                openMenuItems[item.key] ? 'rotate-90' : ''
                              }" />
                            </div>
                          </Button>
                          <div
                            className={`overflow-hidden transition-all duration-300 ${
                              openMenuItems[item.key] ? 'max-h-96' : 'max-h-0'
                            }`}
                          >
                            <div className="pl-6">
                              {item.subMenu.map((subItem) => (
                                <Button
                                  key={subItem.key}
                                  variant="ghost"
                                  className={`w-full justify-start px-3 py-2 text-left text-sm font-medium transition-colors ${
                                    activeKey === subItem.key ? 'bg-sidebar-hover' : ''
                                  }`}
                                  onClick={() => handleItemClick(subItem.path, subItem.key)}
                                >
                                  {subItem.label}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          className={`w-full justify-start px-3 py-2 text-left text-sm font-medium transition-colors ${
                            activeKey === item.key ? 'bg-sidebar-hover' : ''
                          }`}
                          onClick={() => handleItemClick(item.path, item.key, item.target)}
                        >
                          <div className="flex items-center gap-2">
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </div>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </>
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
