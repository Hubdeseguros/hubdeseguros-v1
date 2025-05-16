import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import {
  ChevronLeft, ChevronRight, LogOut, 
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
  AlertTriangle, 
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
  Home 
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

  const collapsed = sidebarState !== 'expanded';

  const handleToggle = () => {
    toggleSidebar();
  };

  useEffect(() => {
    if (user) {
      const menuConfig = getMenuByRole(user.role);
      setMenuSections(menuConfig);
    }
  }, [user]);

  useEffect(() => {
    const path = location.pathname;
    if (menuSections) {
      for (const section of menuSections) {
        for (const item of section.items) {
          if (path === item.path || path.startsWith(item.path + '/')) {
            setActiveKey(item.key);
            if (item.subMenu) {
              toggleSubMenu(item.key);
            }
            break;
          }
          if (item.subMenu) {
            for (const subItem of item.subMenu) {
              if (path === subItem.path || path.startsWith(subItem.path + '/')) {
                setActiveKey(subItem.key);
                toggleSubMenu(item.key);
                break;
              }
            }
          }
        }
      }
    }
  }, [location.pathname, menuSections]);

  const handleItemClick = (path: string, key: string, target?: string) => {
    if (target === '_blank') {
      window.open(path, '_blank');
    } else {
      setActiveKey(key);
      navigate(path);
    }
  };

  const toggleSubMenu = (key: string) => {
    setMenuSections(prevSections => 
      prevSections.map(section => ({
        ...section,
        items: section.items.map(item => {
          if (item.key === key) {
            return { ...item, isOpen: !item.isOpen };
          }
          return item;
        })
      }))
    );
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
            path: `/${roleRoute}/clientes`,
            isOpen: true,
            subMenu: [
              {
                key: 'listado-clientes',
                label: 'Listado de Clientes',
                icon: FileUser,
                path: `/${roleRoute}/clientes/listado`
              },
              {
                key: 'crm',
                label: 'Asistente Comercial/CRM',
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
                path: `/${roleRoute}/cobros/pagos`
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
            icon: FileText,
            path: `/${roleRoute}/facturas`
          },
          {
            key: 'diligencias',
            label: 'Diligencias',
            icon: Mail,
            path: `/${roleRoute}/diligencias`
          }
        ]
      }
    ];

    if (role === 'AGENCIA' || role === 'ADMIN') {
      baseMenu.push(
        {
          isDivider: true,
          items: []
        },
        {
          title: "CONFIGURACIÓN",
          items: [
            {
              key: 'config-agencia',
              label: 'Configuración Agencia',
              icon: Settings,
              path: `/${roleRoute}/configuracion`,
              isOpen: true,
              subMenu: [
                {
                  key: 'usuarios',
                  label: 'Usuarios',
                  icon: Users,
                  path: `/${roleRoute}/configuracion/usuarios`
                },
                {
                  key: 'info-agencia',
                  label: 'Información de agencia',
                  icon: Info,
                  path: `/${roleRoute}/configuracion/informacion`
                },
                {
                  key: 'sedes',
                  label: 'Sedes',
                  icon: MapPin,
                  path: `/${roleRoute}/configuracion/sedes`
                },
                {
                  key: 'aseguradoras',
                  label: 'Aseguradoras',
                  icon: Shield,
                  path: `/${roleRoute}/configuracion/aseguradoras`
                },
                {
                  key: 'ramos',
                  label: 'Ramos',
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
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Header del sidebar */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          <h1 className="text-xl font-bold">Hub de Seguros</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggle}
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
              {user.name.charAt(0)}
            </div>
          </div>
          {!collapsed && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-300 truncate">{user.role}</p>
            </div>
          )}
        </div>
      </div>

      {/* Menú de navegación */}
      <div className="flex-1 overflow-y-auto py-4">
        {menuSections.map((section, sectionIndex) => (
          <div key={`section-${sectionIndex}`}>
            {section.isDivider ? (
              <Separator className="my-3 bg-[#2a3c5a]" />
            ) : (
              <div className="mb-4">
                {!collapsed && section.title && (
                  <h3 className="text-xs font-semibold tracking-wider uppercase text-gray-400 mb-2 px-4">{section.title}</h3>
                )}
                <ul>
                  {section.items.map((item) => (
                    <li key={item.key}>
                      <TooltipProvider delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className={`flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#2a3c5a] rounded-md transition-colors duration-150 cursor-pointer min-h-[40px] select-none ${
                                activeKey === item.key ? 'bg-[#2a3c5a] font-medium text-blue-400' : ''
                              }`}
                              style={{ minWidth: collapsed ? 48 : 0 }}
                              tabIndex={0}
                              onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  if (item.subMenu) {
                                    toggleSubMenu(item.key);
                                  } else {
                                    handleItemClick(item.path, item.key, item.target);
                                  }
                                }
                              }}
                              onClick={() => {
                                if (item.subMenu) {
                                  toggleSubMenu(item.key);
                                } else {
                                  handleItemClick(item.path, item.key, item.target);
                                }
                              }}
                              aria-current={activeKey === item.key ? "page" : undefined}
                              aria-label={item.label}
                              role="menuitem"
                            >
                              <div className="mr-2 min-w-[24px] flex justify-center items-center">
                                <item.icon size={18} />
                              </div>
                              {!collapsed && (
                                <span className="ml-1">{item.label}</span>
                              )}
                              {!collapsed && item.subMenu && (
                                <div className="ml-auto">
                                  <ChevronRight size={16} className={`transition-transform duration-150 ${item.isOpen ? 'rotate-90' : ''}`} />
                                </div>
                              )}
                            </div>
                          </TooltipTrigger>
                          {collapsed && (
                            <TooltipContent side="right">
                              <p>{item.label}</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                      
                      {/* Submenú */}
                      {!collapsed && item.subMenu && item.isOpen && (
                        <ul className="ml-6 mt-1 border-l border-[#2a3c5a] pl-2">
                          {item.subMenu.map((subItem) => (
                            <li key={subItem.key}>
                              <div 
                                className={`flex items-center px-4 py-1.5 text-sm text-gray-300 hover:bg-[#2a3c5a] rounded-md transition-colors duration-150 cursor-pointer min-h-[36px] select-none ${
                                  activeKey === subItem.key ? 'bg-[#2a3c5a] font-medium text-blue-400' : ''
                                }`}
                                tabIndex={0}
                                style={{ minWidth: 0 }}
                                onKeyDown={e => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    handleItemClick(subItem.path, subItem.key, subItem.target);
                                  }
                                }}
                                onClick={() => handleItemClick(subItem.path, subItem.key, subItem.target)}
                                aria-current={activeKey === subItem.key ? "page" : undefined}
                                aria-label={subItem.label}
                                role="menuitem"
                              >
                                <div className="mr-2 min-w-[24px] flex justify-center items-center">
                                  <subItem.icon size={18} />
                                </div>
                                <span>{subItem.label}</span>
                                {subItem.target === '_blank' && (
                                  <ArrowUpRight size={14} className="ml-1 text-xs" />
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer con botón de cerrar sesión */}
      <div className={`p-4 border-t border-[#2a3c5a] ${collapsed ? 'flex justify-center' : ''}`}>
        <Button 
          variant="ghost" 
          onClick={logout} 
          className={`text-gray-300 hover:bg-[#2a3c5a] ${collapsed ? 'w-10 h-10 p-0' : 'w-full'}`}
        >
          <LogOut size={18} />
          {!collapsed && <span className="ml-2">Cerrar sesión</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
