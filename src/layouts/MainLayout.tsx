import { ReactNode, useState, useRef, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { SidebarProvider } from '@/components/ui/sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
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

  // Manejar el tamaño de la ventana para cerrar el menú en móvil
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileMenuOpenRef.current) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <SidebarProvider defaultOpen={!mobileMenuOpen}>
      <div className="min-h-screen flex flex-col w-full overflow-hidden">
        {/* Contenido principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          
          {/* Botón de hamburguesa para móvil */}
          <button
            className="lg:hidden absolute top-4 left-4 p-2 rounded-md bg-white shadow-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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

        {/* Sidebar (en versión desktop y overlay en móvil) */}
        <div className={`
          fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0
          transition duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <Sidebar onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
        </div>

        {/* Overlay para cerrar el sidebar en móvil */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={handleOverlayClick}
          />
        )}
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
