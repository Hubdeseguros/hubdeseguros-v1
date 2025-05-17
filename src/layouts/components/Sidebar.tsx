import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  BarChart2, 
  FileUser, 
  Laptop, 
  Users, 
  CheckSquare, 
  FileText, 
  DollarSign, 
  Box, 
  Clipboard, 
  FilePieChart, 
  File, 
  Mail, 
  Settings, 
  Info, 
  MapPin, 
  Shield, 
  Grid, 
  List, 
  Upload, 
  UserPlus, 
  Paperclip,
  ArrowUpRight,
  Home,
  BellRing,
  AlertTriangle,
  User
} from 'lucide-react';

type MenuIcon = React.ComponentType<{ size?: string | number; className?: string }>;

interface MenuItem {
  key: string;
  label: string;
  icon: MenuIcon;
  path: string;
  subMenu?: MenuItem[];
  isOpen?: boolean;
  target?: string;
}

interface MenuSection {
  title?: string;
  items: MenuItem[];
  isDivider?: boolean;
}

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { state: sidebarState, toggleSidebar } = useSidebar();
  const [activeKey, setActiveKey] = useState('');
  const [menuSections, setMenuSections] = useState<MenuSection[]>([]);
  const [openMenuItems, setOpenMenuItems] = useState<Record<string, boolean>>({});
  
  // Datos de ejemplo para notificaciones
  const notifications = [
    {
      id: '1',
      title: 'Nuevo mensaje',
      message: 'Tienes un nuevo mensaje del equipo de soporte',
      date: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      read: false,
      type: 'info' as const
    },
    {
      id: '2',
      title: 'Pago recibido',
      message: 'Se ha registrado el pago de la póliza #12345',
      date: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      read: false,
      type: 'success' as const
    },
    {
      id: '3',
      title: 'Recordatorio',
      message: 'La póliza #54321 vence en 15 días',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
      type: 'warning' as const
    }
  ];
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const collapsed = sidebarState !== 'expanded';

  // Cargar el menú basado en el rol del usuario
  useEffect(() => {
    if (user) {
      const menuConfig = getMenuByRole(user.role);
      setMenuSections(menuConfig);
    }
  }, [user]);

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
    if (target === '_blank') {
      window.open(path, '_blank');
    } else {
      navigate(path);
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

  const getMenuByRole = (role: string): MenuSection[] => {
    const roleRoute = role.toLowerCase();
    const baseMenu: MenuSection[] = [
      {
        title: "PRINCIPAL",
        items: [
          {
            key: 'inicio',
            label: 'Inicio',
            icon: BarChart2,
            path: `/${roleRoute}/dashboard`
          },
          {
            key: 'clientes',
            label: 'Clientes',
            icon: FileUser,
            path: '/clientes/crm',
            isOpen: true,
            subMenu: [
              {
                key: 'crm',
                label: 'Asistente Comercial/CRM',
                icon: Laptop,
                path: '/clientes/crm'
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
                path: `/${roleRoute}/cobros/pagos`
              },
              {
                key: 'recibos-cuadre',
                label: 'Recibos y Cuadre de caja',
                icon: DollarSign,
                path: `/${roleRoute}/cobros/recibos`
              },
              {
                key: 'liquidar-vendedores',
                label: 'Liquidar vendedores',
                icon: DollarSign,
                path: `/${roleRoute}/cobros/liquidar`
              }
            ]
          },
          {
            key: 'informes',
            label: 'Informes',
            icon: FilePieChart,
            path: `/${roleRoute}/informes`
          },
          // En el rol usuario mostramos siempre los archivos y siniestros como secciones independientes
          ...(role === 'CLIENTE' ? [
            {
              key: 'documentos',
              label: 'Documentos',
              icon: File,
              path: `/${roleRoute}/documentos`
            },
            {
              key: 'siniestros-usuario',
              label: 'Siniestros',
              icon: AlertTriangle,
              path: `/${roleRoute}/siniestros`
            }
          ] : [
            {
              key: 'archivos',
              label: 'Archivos',
              icon: File,
              path: `/${roleRoute}/archivos`
            }
          ]),
          // Estas secciones son visibles para todos los roles menos para el CLIENTE
          ...(role !== 'CLIENTE' ? [
            {
              key: 'siniestros',
              label: 'Siniestros',
              icon: AlertTriangle,
              path: `/${roleRoute}/siniestros`
            },
            {
              key: 'facturas',
              label: 'Facturas',
              icon: FileText,
              path: `/${roleRoute}/facturas`
            },
            {
              key: 'diligencias',
              label: 'Diligencias',
              icon: Clipboard,
              path: `/${roleRoute}/diligencias`
            }
          ] : [])
        ]
      }
    ];
    
    // Menú para CLIENTE
    if (role === 'CLIENTE') {
      return [
        ...baseMenu,
        {
          title: 'COMUNICACIONES',
          items: [
            {
              key: 'notificaciones',
              label: 'Notificaciones',
              icon: BellRing,
              path: `/${roleRoute}/notificaciones`,
              ...(unreadCount > 0 ? {
                badge: <Badge variant="destructive" className="ml-auto h-5">{unreadCount}</Badge>
              } : {})
            },
            {
              key: 'contacto-soporte',
              label: 'Contacto con Soporte',
              icon: Mail,
              path: `/${roleRoute}/contacto-soporte`
            }
          ]
        },
        {
          title: 'MI CUENTA',
          items: [
            {
              key: 'perfil',
              label: 'Mi Perfil',
              icon: User,
              path: `/${roleRoute}/perfil`
            },
            {
              key: 'configuracion',
              label: 'Configuración',
              icon: Settings,
              path: `/${roleRoute}/configuracion`,
              subMenu: [
                {
                  key: 'config-general',
                  label: 'General',
                  icon: Settings,
                  path: `/${roleRoute}/configuracion/general`
                },
                {
                  key: 'config-seguridad',
                  label: 'Seguridad y Privacidad',
                  icon: Shield,
                  path: `/${roleRoute}/configuracion/seguridad`
                },
                {
                  key: 'config-notificaciones',
                  label: 'Notificaciones',
                  icon: BellRing,
                  path: `/${roleRoute}/configuracion/notificaciones`
                }
              ]
            }
          ]
        }
      ];
    }
    
    // Menú para AGENTE o AGENCIA
    if (role === 'AGENTE' || role === 'AGENCIA') {
      const baseMenuSections = [
        ...baseMenu,
        {
          title: 'GESTIÓN',
          items: [
            {
              key: 'perfil',
              label: 'Mi Perfil',
              icon: FileUser,
              path: `/${roleRoute}/perfil`
            },
            {
              key: 'configuracion',
              label: 'Configuración',
              icon: Settings,
              path: `/${roleRoute}/configuracion`,
              subMenu: [
                {
                  key: 'config-general',
                  label: 'General',
                  icon: Settings,
                  path: `/${roleRoute}/configuracion/general`
                },
                {
                  key: 'config-usuarios',
                  label: 'Usuarios',
                  icon: Users,
                  path: `/${roleRoute}/configuracion/usuarios`
                },
                {
                  key: 'config-informacion',
                  label: 'Información de agencia',
                  icon: Info,
                  path: `/${roleRoute}/configuracion/informacion`
                },
                {
                  key: 'config-sedes',
                  label: 'Sedes',
                  icon: MapPin,
                  path: `/${roleRoute}/configuracion/sedes`
                },
                {
                  key: 'config-aseguradoras',
                  label: 'Aseguradoras',
                  icon: Shield,
                  path: `/${roleRoute}/configuracion/aseguradoras`
                },
                {
                  key: 'config-ramos',
                  label: 'Ramos',
                  icon: Grid,
                  path: `/${roleRoute}/configuracion/ramos`
                },
                {
                  key: 'config-vendedores',
                  label: 'Vendedores',
                  icon: Users,
                  path: `/${roleRoute}/configuracion/vendedores`
                },
                {
                  key: 'config-estados-siniestros',
                  label: 'Estados Siniestros',
                  icon: List,
                  path: `/${roleRoute}/configuracion/estados-siniestros`
                },
                {
                  key: 'config-estados-arl',
                  label: 'Estados ARL',
                  icon: List,
                  path: `/${roleRoute}/configuracion/estados-arl`
                },
                {
                  key: 'config-motivos-estados',
                  label: 'Motivos estados póliza',
                  icon: List,
                  path: `/${roleRoute}/configuracion/motivos-estados`
                },
                {
                  key: 'config-tipo-afiliacion',
                  label: 'Tipo afiliación',
                  icon: List,
                  path: `/${roleRoute}/configuracion/tipo-afiliacion`
                },
                {
                  key: 'config-mensajeros',
                  label: 'Mensajeros',
                  icon: Users,
                  path: `/${roleRoute}/configuracion/mensajeros`
                },
                {
                  key: 'config-coberturas',
                  label: 'Coberturas',
                  icon: Shield,
                  path: `/${roleRoute}/configuracion/coberturas`
                },
                {
                  key: 'config-seguridad',
                  label: 'Seguridad',
                  icon: Shield,
                  path: `/${roleRoute}/configuracion/seguridad`
                },
                {
                  key: 'config-notificaciones',
                  label: 'Notificaciones',
                  icon: BellRing,
                  path: `/${roleRoute}/configuracion/notificaciones`
                }
              ]
            },
            {
              key: 'importar',
              label: 'Importar Plantillas',
              icon: Upload,
              path: `/${roleRoute}/importar`,
              subMenu: [
                {
                  key: 'importar-aseguradoras',
                  label: 'Aseguradoras',
                  icon: Shield,
                  path: `/${roleRoute}/importar/aseguradoras`
                },
                {
                  key: 'importar-ramos',
                  label: 'Ramos',
                  icon: Grid,
                  path: `/${roleRoute}/importar/ramos`
                },
                {
                  key: 'importar-vendedores',
                  label: 'Vendedores',
                  icon: Users,
                  path: `/${roleRoute}/importar/vendedores`
                },
                {
                  key: 'importar-clientes',
                  label: 'Clientes',
                  icon: Users,
                  path: `/${roleRoute}/importar/clientes`
                },
                {
                  key: 'importar-polizas',
                  label: 'Pólizas',
                  icon: FileText,
                  path: `/${roleRoute}/importar/polizas`
                },
                {
                  key: 'importar-polizas-cumplimiento',
                  label: 'Pólizas de cumplimiento y judicial',
                  icon: FileText,
                  path: `/${roleRoute}/importar/polizas-cumplimiento`
                },
                {
                  key: 'importar-campos-ramo',
                  label: 'Campos adicionales por ramo',
                  icon: FileText,
                  path: `/${roleRoute}/importar/campos-ramo`
                },
                {
                  key: 'importar-anexos',
                  label: 'Anexos',
                  icon: Paperclip,
                  path: `/${roleRoute}/importar/anexos`
                },
                {
                  key: 'importar-cobros',
                  label: 'Cobros',
                  icon: DollarSign,
                  path: `/${roleRoute}/importar/cobros`
                },
                {
                  key: 'importar-vinculados',
                  label: 'Vinculados',
                  icon: UserPlus,
                  path: `/${roleRoute}/importar/vinculados`
                },
                {
                  key: 'importar-beneficiarios',
                  label: 'Beneficiarios',
                  icon: UserPlus,
                  path: `/${roleRoute}/importar/beneficiarios`
                },
                {
                  key: 'importar-crm',
                  label: 'CRM',
                  icon: Laptop,
                  path: `/${roleRoute}/importar/crm`
                },
                {
                  key: 'importar-siniestros',
                  label: 'Siniestros',
                  icon: AlertTriangle,
                  path: `/${roleRoute}/importar/siniestros`
                },
                {
                  key: 'importar-amparos',
                  label: 'Amparos',
                  icon: Shield,
                  path: `/${roleRoute}/importar/amparos`
                },
                {
                  key: 'importar-coberturas',
                  label: 'Coberturas',
                  icon: Shield,
                  path: `/${roleRoute}/importar/coberturas`
                },
                {
                  key: 'importar-tareas',
                  label: 'Tareas',
                  icon: FileText,
                  path: `/${roleRoute}/importar/tareas`
                },
                {
                  key: 'importar-datos-adicionales',
                  label: 'Datos adicionales',
                  icon: FileText,
                  path: `/${roleRoute}/importar/datos-adicionales`
                }
              ]
            }
          ]
        }
      ];
      
      // Para agentes, agregamos una sección con métricas de ventas
      if (role === 'AGENTE') {
        return [
          ...baseMenuSections,
          {
            title: "MÉTRICAS",
            items: [
              {
                key: 'ventas',
                label: 'Ventas',
                icon: BarChart2,
                path: `/${roleRoute}/ventas`
              }
            ]
          }
        ];
      }
      
      return baseMenuSections;
    }
    
    // Menú para ADMIN
    if (role === 'ADMIN') {
      return [
        ...baseMenu,
        {
          title: 'ADMINISTRACIÓN',
          items: [
            {
              key: 'usuarios',
              label: 'Gestión de Usuarios',
              icon: Users,
              path: `/admin/usuarios`
            },
            {
              key: 'agencias',
              label: 'Gestión de Agencias',
              icon: Box,
              path: `/admin/agencias`
            },
            {
              key: 'metricas',
              label: 'Métricas y Reportes',
              icon: BarChart2,
              path: `/admin/metricas`
            },
            {
              key: 'configuracion-sistema',
              label: 'Configuración del Sistema',
              icon: Settings,
              path: `/admin/configuracion-sistema`,
              subMenu: [
                {
                  key: 'config-general',
                  label: 'General',
                  icon: Settings,
                  path: `/admin/configuracion-sistema/general`
                },
                {
                  key: 'config-seguridad',
                  label: 'Seguridad',
                  icon: Shield,
                  path: `/admin/configuracion-sistema/seguridad`
                },
                {
                  key: 'config-notificaciones',
                  label: 'Notificaciones',
                  icon: BellRing,
                  path: `/admin/configuracion-sistema/notificaciones`
                },
                {
                  key: 'config-integraciones',
                  label: 'Integraciones',
                  icon: ArrowUpRight,
                  path: `/admin/configuracion-sistema/integraciones`
                }
              ]
            }
          ]
        }
      ];
    }
    
    // Por defecto, devolver menú base
    return baseMenu;
  };
  
  const renderMenuSection = (section: MenuSection, index: number) => {
    if (section.isDivider) {
      return <Separator key={index} className="my-4" />;
    }
    
    return (
      <div key={index} className="mb-8">
        {section.title && (
          <h3 className="px-4 text-xs text-muted-foreground font-semibold tracking-wider uppercase mb-2">
            {collapsed ? '···' : section.title}
          </h3>
        )}
        <ul className="space-y-1">
          {section.items.map(item => renderMenuItem(item))}
        </ul>
      </div>
    );
  };
  
  const renderMenuItem = (item: MenuItem) => (
    <li key={item.key} className="relative">
      <Button
        variant={activeKey === item.key ? "secondary" : "ghost"}
        size="sm"
        className={`w-full h-10 justify-start gap-2 ${activeKey === item.key ? 'font-medium' : ''}`}
        onClick={() => handleItemClick(item.path, item.key, item.target)}
      >
        <item.icon size={20} />
        {!collapsed && (
          <>
            <span className="flex-1 truncate">{item.label}</span>
            {item.subMenu && (
              <ChevronRight 
                className={`h-4 w-4 shrink-0 transition-transform ${openMenuItems[item.key] ? 'rotate-90' : ''}`}
                onClick={(e) => toggleSubMenu(item.key, e)}
              />
            )}
          </>
        )}
      </Button>
      
      {!collapsed && item.subMenu && openMenuItems[item.key] && (
        <ul className="ml-6 mt-1 space-y-1">
          {item.subMenu.map(subItem => (
            <li key={subItem.key}>
              <Button
                variant={activeKey === subItem.key ? "secondary" : "ghost"}
                size="sm"
                className={`w-full h-8 justify-start gap-2 text-sm ${activeKey === subItem.key ? 'font-medium' : ''}`}
                onClick={() => handleItemClick(subItem.path, subItem.key, subItem.target)}
              >
                <subItem.icon size={16} />
                <span className="flex-1 truncate">{subItem.label}</span>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </li>
  );

  return (
    <aside 
      className={`flex flex-col h-full bg-background border-r transition-all duration-300 ${
        collapsed ? 'w-[60px]' : 'w-[260px]'
      }`}
    >
      <div className="flex items-center h-16 px-3 border-b">
        <div className="flex-1">
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User className="h-5 w-5" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="font-medium truncate">{user?.name || 'Usuario'}</span>
                <span className="text-xs text-muted-foreground truncate">{user?.role}</span>
              </div>
            </div>
          ) : (
            <div className="h-8 w-8 mx-auto flex items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="h-5 w-5" />
            </div>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="ml-1"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-2">
          {menuSections.map((section, index) => renderMenuSection(section, index))}
        </div>
      </div>
      
      <div className="p-2 mt-auto border-t">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-destructive hover:text-destructive"
          onClick={logout}
        >
          <LogOut size={20} />
          {!collapsed && <span>Cerrar sesión</span>}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
