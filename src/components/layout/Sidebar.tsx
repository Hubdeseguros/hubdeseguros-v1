import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { menuItems } from '@/config/menu';
import { UserRole } from '@/types/auth';

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const Sidebar = ({ open, onOpenChange }: SidebarProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const filteredMenu = menuItems.filter(item => 
    item.roles.includes(user?.role || 'PROMOTOR')
  );

  // Función para verificar si un usuario tiene acceso a un menú
  const hasAccess = (roles: UserRole[]) => {
    return roles.includes(user?.role || 'PROMOTOR');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ${
      open ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 bg-primary text-white">
          <span className="text-xl font-bold">HubSeguros</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {filteredMenu.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigate(item.path)}
                  className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === item.path 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </button>
                {item.children && item.children.length > 0 && (
                  <ul className="pl-6">
                    {item.children
                      .filter(child => child.roles.includes(user?.role as any))
                      .map((child) => (
                        <li key={child.id}>
                          <button
                            onClick={() => handleNavigate(child.path)}
                            className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                              location.pathname === child.path 
                                ? 'bg-primary text-white' 
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <span className="ml-3">{child.label}</span>
                          </button>
                        </li>
                      ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};
