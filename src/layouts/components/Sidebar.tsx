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
import { SIDEBAR_MENUS, SidebarMenuSection } from "./sidebarMenu.config";
import {
  Sidebar as BaseSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarProvider,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

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
  const { state: sidebarState, toggleSidebar } = useSidebar();

  // Determinar el menú del rol actual
  const role = user?.role?.toUpperCase() || "CLIENTE";
  const sections: SidebarMenuSection[] = SIDEBAR_MENUS[role] || [];

  return (
    <aside className={`flex flex-col h-full bg-background border-r transition-all duration-300 ${sidebarState !== 'expanded' ? 'w-[60px]' : 'w-[260px]'}`}>
      <SidebarHeader>
        <div className="flex items-center h-16 px-3 border-b">
          {/* Avatar y nombre */}
          <div className="flex-1 flex items-center gap-2">
            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground">
              {/* Puedes poner aquí el ícono de usuario */}
            </div>
            {sidebarState === 'expanded' && (
              <div>
                <span className="font-medium truncate">{user?.name || 'Usuario'}</span>
                <span className="text-xs text-muted-foreground truncate">{role}</span>
              </div>
            )}
          </div>
          {/* Botón para colapsar/expandir */}
          <button onClick={toggleSidebar} className="ml-1">
            {sidebarState !== 'expanded' ? <span>&gt;</span> : <span>&lt;</span>}
          </button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {sections.map(section => (
          <SidebarGroup key={section.key}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton asChild isActive={false} /* TODO: activa según ruta actual */>
                      {item.path ? (
                        <a href={item.path} className="flex items-center gap-2">
                          <item.icon size={18} />
                          <span>{item.label}</span>
                        </a>
                      ) : (
                        <span className="flex items-center gap-2">
                          <item.icon size={18} /> <span>{item.label}</span>
                        </span>
                      )}
                    </SidebarMenuButton>
                    {item.subMenu && (
                      <SidebarMenuSub>
                        {item.subMenu.map(sub =>
                          <SidebarMenuSubItem key={sub.key}>
                            <SidebarMenuSubButton asChild>
                              <a href={sub.path} className="flex items-center gap-2">
                                <sub.icon size={16} />
                                <span>{sub.label}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <button
          className="w-full flex items-center gap-2 px-4 py-2 text-destructive hover:text-destructive"
          onClick={logout}
        >
          {/* Ícono de logout aquí si deseas */}
          <span>Cerrar sesión</span>
        </button>
      </SidebarFooter>
    </aside>
  );
};

export default Sidebar;
