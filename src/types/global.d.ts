// Asegurar que TypeScript reconozca las importaciones de módulos personalizados
declare module '@/components/ui/sidebar' {
  import { ComponentType, ReactNode } from 'react';
  
  export const SidebarProvider: ComponentType<{ children: ReactNode; defaultOpen?: boolean }>;
  export const useSidebar: () => {
    state: 'expanded' | 'collapsed';
    open: boolean;
    setOpen: (open: boolean) => void;
    openMobile: boolean;
    setOpenMobile: (open: boolean) => void;
    isMobile: boolean;
    toggleSidebar: () => void;
  };
  
  // Exportar otros componentes según sea necesario
  export const Sidebar: ComponentType<any>;
  export const SidebarContent: ComponentType<any>;
  export const SidebarFooter: ComponentType<any>;
  // Agregar más exportaciones según sea necesario
}
