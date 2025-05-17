import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types/auth';
import { toast } from '@/components/ui/use-toast';
import { useEffect } from 'react';

interface PrivateRouteProps {
  allowedRoles?: UserRole[];
  requiresAuthentication?: boolean;
  children?: React.ReactNode;
}

const PrivateRoute = ({ 
  allowedRoles = [],
  requiresAuthentication = true,
  children
}: PrivateRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Informar al usuario sobre su contexto actual cuando entra en una ruta protegida
    if (isAuthenticated && user) {
      const roleText = {
        // El rol CLIENTE ha sido eliminado
        'AGENTE': 'agente de seguros',
        'AGENCIA': 'agencia',
        'ADMIN': 'administrador'
      }[user.role];

      toast({
        title: `Bienvenido, ${user.name}`,
        description: `Has iniciado sesión como ${roleText}. Tu panel ha sido adaptado a tu rol.`,
      });
    }
  }, [isAuthenticated, user]);

  // Si se requiere autenticación y el usuario no está autenticado, redirige al landing
  if (requiresAuthentication && !isAuthenticated) {
    return <Navigate to="/landing" replace />;
  }

  // Si se especifican roles permitidos y el usuario no tiene el rol adecuado
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    toast({
      variant: "destructive",
      title: "Acceso restringido",
      description: `No tienes permisos para acceder a esta sección. Serás redirigido al panel correspondiente a tu rol.`,
    });
    
    // Redirigir al dashboard correspondiente al rol del usuario
    return <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace />;
  }

  return (
    <>
      {children || <Outlet />}
    </>
  );
};

export default PrivateRoute;
