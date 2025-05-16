import { ReactNode, useState, useRef, useEffect, useCallback } from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar/useSidebar';
import { menuSections } from './components/SidebarMenu';
import Header from './components/Header';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  // Usar un ref para el estado del overlay para evitar re-renders innecesarios
  const mobileMenuOpenRef = useRef(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Actualizar el ref cuando cambie el estado
  useEffect(() => {
    mobileMenuOpenRef.current = mobileMenuOpen;
  }, [mobileMenuOpen]);

  // Función memoizada para manejar el clic en el overlay
  const handleOverlayClick = useCallback(() => {
    if (mobileMenuOpenRef.current) {
      setMobileMenuOpen(false);
    }
  }, []);

  return (
    <SidebarProvider defaultOpen={!mobileMenuOpen}>
      <div className="min-h-screen flex w-full overflow-hidden">
        {/* Sidebar (en versión desktop y overlay en móvil) */}
        <div className={`
          fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0
          transition duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <Sidebar menuSections={menuSections} onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
        </div>

        {/* Overlay para cerrar el sidebar en móvil */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={handleOverlayClick}
          />
        )}
        
        {/* Contenido principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          
          {/* Botón de hamburguesa para móvil */}
          <button
            className="lg:hidden absolute top-4 left-4 p-2 rounded-md"
            onClick={() => setMobileMenuOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Área de contenido */}
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
