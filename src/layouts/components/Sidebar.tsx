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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { open: isOpen } = useSidebar();
  const collapsed = false; // Siempre expandido
  const [activeKey, setActiveKey] = useState('');
  const [openMenuItems, setOpenMenuItems] = useState<Record<string, boolean>>({});
  const [unreadCount, setUnreadCount] = useState(3); // Simulación de notificaciones no leídas

  // Función para obtener el menú basado en el rol
  const getMenuByRole = (role: string): MenuSection[] => {
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
          },
          {
            key: 'clientes',
            label: 'Clientes',
            icon: Users,
            path: `/clientes`,
          },
          {
            key: 'polizas',
            label: 'Pólizas',
            icon: FileText,
            path: `/polizas`,
          },
          {
            key: 'cobranzas',
            label: 'Cobranzas',
            icon: DollarSign,
            path: `/cobranzas`,
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
          },
          {
            key: 'reportes-cobranza',
            label: 'Reportes de Cobranza',
            icon: FilePieChart,
            path: `/reportes/cobranza`,
          },
          {
            key: 'reportes-clientes',
            label: 'Reportes de Clientes',
            icon: Users,
            path: `/reportes/clientes`,
          },
          {
            key: 'reportes-polizas',
            label: 'Reportes de Pólizas',
            icon: FileText,
            path: `/reportes/polizas`,
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
          },
          {
            key: 'agencia-configuracion',
            label: 'Configuración',
            icon: Settings,
            path: `/agencia/configuracion`,
          },
          {
            key: 'agencia-documentos',
            label: 'Documentos',
            icon: FileText,
            path: `/agencia/documentos`,
          },
          {
            key: 'agencia-notificaciones',
            label: 'Notificaciones',
            icon: BellRing,
            path: `/agencia/notificaciones`,
          }
        ]
      }
    ];

    // Agregar ítems específicos según el rol
    if (role === 'agencia') {
      return baseMenu;
    }

    // Para otros roles, filtrar el menú
    return baseMenu.map(section => ({
      ...section,
      items: section.items.filter(item => validateRolePermission(role, item.permission))
    }));
  };

  // Cargar el menú basado en el rol del usuario
  const [menuSections, setMenuSections] = useState<MenuSection[]>([]);
  
  useEffect(() => {
    if (user?.role) {
      const menuConfig = getMenuByRole(user.role);
      setMenuSections(menuConfig);
      // Reiniciar los estados de menú al cambiar de rol
      setActiveKey('');
      setOpenMenuItems({});
    }
  }, [user?.role]);

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
          <h1 className="text-xl font-bold">Hub de Seguros</h1>
        </div>
      </div>

      {/* Información del usuario */}
      <div className="p-4 border-b border-[#2a3c5a]">
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
