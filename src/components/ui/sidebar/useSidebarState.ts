import { useState, useCallback, useEffect } from 'react';

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export interface SidebarState {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
}

export function useSidebarState(defaultOpen = false): SidebarState {
  const [open, setOpen] = useState(defaultOpen);
  const [openMobile, setOpenMobile] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = useCallback(() => {
    setOpen(!open);
  }, [open]);

  // Actualizar el estado inicial desde la cookie
  useEffect(() => {
    const cookie = document.cookie.split('; ').find(row => row.startsWith(SIDEBAR_COOKIE_NAME));
    if (cookie) {
      const value = cookie.split('=')[1];
      const openState = value === 'true';
      if (openState !== open) {
        setOpen(openState);
      }
    }
  }, [open]);

  // Actualizar la cookie cuando cambia el estado
  useEffect(() => {
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${open}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
  }, [open]);

  return {
    state: open ? 'expanded' : 'collapsed',
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  };
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  const checkIsMobile = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
}
