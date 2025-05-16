import * as React from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useSidebar } from './useSidebar';
import type { MenuIcon } from './types';
import type { MenuItem, MenuSection, SidebarProps } from './types';
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
  AlertTriangle
} from 'lucide-react';

export function Sidebar({ menuSections, onToggleMobileMenu }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { state, toggleSidebar, open } = useSidebar();
  const collapsed = state === 'collapsed';

  // Estado local para manejar submenús
  const [activeKey, setActiveKey] = React.useState<string>('');
  const [openMenuItems, setOpenMenuItems] = React.useState<Record<string, boolean>>({});

  // Actualizar submenús activos basado en la ruta actual
  React.useEffect(() => {
    const foundActiveKey = menuSections
      .flatMap(section => section.items)
      .find(item => location.pathname.startsWith(item.path))?.key;

    const newOpenItems: Record<string, boolean> = {};
    if (foundActiveKey) {
      // Abrir todos los submenús necesarios para llegar al item activo
      const path = foundActiveKey.split('.');
      for (let i = 1; i < path.length; i++) {
        newOpenItems[path.slice(0, i).join('.')] = true;
      }
    }

    // Actualizar el estado solo si hay cambios
    if (foundActiveKey !== activeKey) {
      setActiveKey(foundActiveKey);
    }
    
    setOpenMenuItems(prev => ({
      ...prev,
      ...newOpenItems
    }));
  }, [location.pathname, menuSections, activeKey]);

  // Manejar clic en un item del menú
  const handleItemClick = (path: string, key: string, target?: string) => {
    setActiveKey(key);
    
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
  React.useEffect(() => {
    if (collapsed) {
      // Cerrar todos los submenús al colapsar
      setOpenMenuItems({});
    }
  }, [collapsed]);

  return (
    <div className={`
      flex flex-col w-full h-full bg-background
      ${collapsed ? 'w-[3rem]' : 'w-[16rem]'}
      transition-all duration-300 ease-in-out
      border-r border-border
    `}>
      {/* Logo y botón de colapso */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <img 
            src="/logo.svg" 
            alt="Hubdeseguros" 
            className={`h-8 w-auto ${collapsed ? 'hidden' : ''}`}
          />
          <span className={`text-xl font-bold ${collapsed ? 'hidden' : ''}`}>
            Hubdeseguros
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 p-0"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Menú principal */}
      <nav className="flex-1 overflow-y-auto">
        <div className="px-3 py-2">
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {section.title && !section.isDivider && (
                <div className={`mt-4 mb-2 text-xs font-medium text-muted-foreground ${collapsed ? 'hidden' : ''}`}>
                  {section.title}
                </div>
              )}

              {section.items.map((item) => (
                <div key={item.key}>
                  {item.subMenu ? (
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${
                          activeKey === item.key
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        } ${collapsed ? 'justify-center' : ''} ${collapsed ? 'px-2' : 'px-3'}`}
                        onClick={(e) => toggleSubMenu(item.key, e)}
                      >
                        <item.icon className={`h-4 w-4 ${collapsed ? 'mr-0' : 'mr-2'}`} />
                        {!collapsed && <span>{item.label}</span>}
                        <ChevronRight className={`h-4 w-4 ml-auto ${collapsed ? 'hidden' : ''}`} />
                      </Button>
                      {openMenuItems[item.key] && (
                        <div className="pl-8">
                          {item.subMenu.map((subItem) => (
                            <Button
                              key={subItem.key}
                              variant="ghost"
                              className={`w-full justify-start text-sm ${
                                activeKey === subItem.key
                                  ? 'bg-accent text-accent-foreground'
                                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                              } ${collapsed ? 'justify-center' : ''} ${collapsed ? 'px-2' : 'px-3'}`}
                              onClick={() => handleItemClick(subItem.path, subItem.key, subItem.target)}
                            >
                              <subItem.icon className={`h-4 w-4 ${collapsed ? 'mr-0' : 'mr-2'}`} />
                              {!collapsed && <span>{subItem.label}</span>}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        activeKey === item.key
                          ? 'bg-accent text-accent-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      } ${collapsed ? 'justify-center' : ''} ${collapsed ? 'px-2' : 'px-3'}`}
                      onClick={() => handleItemClick(item.path, item.key, item.target)}
                    >
                      <item.icon className={`h-4 w-4 ${collapsed ? 'mr-0' : 'mr-2'}`} />
                      {!collapsed && <span>{item.label}</span>}
                    </Button>
                  )}
                </div>
              ))}

              {section.isDivider && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Usuario y opciones */}
      <div className="border-t border-border p-3">
        <div className={`flex items-center gap-2 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div>
              <div className="font-medium">{user?.name}</div>
              <div className="text-sm text-muted-foreground">{user?.role}</div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="h-8 w-8 p-0"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
