import { User, UserRole, UserLevel } from '../../types/auth';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

// Datos de usuarios de prueba
export const mockUsers: Array<Omit<User, 'password'> & { password: string }> = [
  { 
    id: '1', 
    name: 'Cliente Demo', 
    email: 'cliente@demo.com', 
    password: 'password',
    role: 'CLIENTE',
    level: 'BASICO',
    phone: '+57 123 456 7890',
    company: 'Empresa del Cliente',
    position: 'Gerente',
    address: 'Calle 123 #45-67, Bogotá',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cliente',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // ... otros usuarios mock
];

export const handleLogin = async (email: string, password: string, navigate: ReturnType<typeof useNavigate>): Promise<boolean> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      localStorage.setItem('hubseguros_user', JSON.stringify(userWithoutPassword));
      
      switch (foundUser.role) {
        case 'CLIENTE':
          navigate('/usuario/dashboard');
          break;
        case 'AGENTE':
          navigate('/agente/dashboard');
          break;
        case 'AGENCIA':
          navigate('/agencia/dashboard');
          break;
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/dashboard');
      }
      
      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido, ${foundUser.name}`,
      });
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Error de autenticación",
        description: "Credenciales incorrectas. Inténtelo de nuevo.",
      });
      return false;
    }
  } catch (err) {
    toast({
      variant: "destructive",
      title: "Error de conexión",
      description: "Ocurrió un error al intentar iniciar sesión.",
    });
    return false;
  }
};

export const handleLogout = (navigate: ReturnType<typeof useNavigate>) => {
  localStorage.removeItem('hubseguros_user');
  navigate('/landing');
  toast({
    title: "Sesión finalizada",
    description: "Has cerrado sesión correctamente",
  });
};

export const handleUpdateProfile = async (data: Partial<User>): Promise<boolean> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = JSON.parse(localStorage.getItem('hubseguros_user') || '{}');
    const updatedUser = { ...user, ...data };
    localStorage.setItem('hubseguros_user', JSON.stringify(updatedUser));
    
    toast({
      title: "Perfil actualizado",
      description: "Tus datos se han actualizado correctamente.",
    });
    return true;
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Error al actualizar",
      description: "No se pudo actualizar el perfil. Por favor, inténtalo de nuevo.",
    });
    return false;
  }
};
