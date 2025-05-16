import type { ReactNode } from "react";

export type MenuIcon = React.ComponentType<{
  size?: string | number;
  className?: string;
}>;

export interface MenuItem {
  key: string;
  label: string;
  icon: MenuIcon;
  path: string;
  subMenu?: MenuItem[];
  isOpen?: boolean;
  target?: string;
}

export interface MenuSection {
  title?: string;
  items: MenuItem[];
  isDivider?: boolean;
}

export interface SidebarProps {
  menuSections: MenuSection[];
  onToggleMobileMenu?: () => void;
}

export interface SidebarContext {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
}
