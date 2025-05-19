import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PrivateRoute from './PrivateRoute';
import { UserRole } from '@/types/auth';
import NotificationsPage from "@/pages/Notifications";
import GestionClientes from "@/features/clientes/pages/GestionClientes";
import PolizasListado from "@/features/polizas/pages/PolizasListado";
import CrmDashboard from "@/features/clientes/pages/CrmDashboard";

// Import types for better type checking
import type { Notification } from '@/types/notifications';

// Agrupar importaciones relacionadas para mejor manejo de chunks
const AuthPages = {
  Login: lazy(() => import('../pages/Login')),
  Register: lazy(() => import('../pages/Register')),
  NotFound: lazy(() => import('../pages/NotFound')),
  Landing: lazy(() => import('../pages/Landing')),
  ProfilePage: lazy(() => import('../pages/ProfilePage')),
  SettingsPage: lazy(() => import('../pages/SettingsPage')),
};

// Dashboards agrupados por rol
const Dashboards = {
  User: lazy(() => import('../features/dashboard/user/UserDashboard')),
  Agent: lazy(() => import('../features/dashboard/agent/AgentDashboard')),
  Agency: lazy(() => import('../features/dashboard/agency/AgencyDashboard')),
  Admin: lazy(() => import('../features/dashboard/admin/AdminDashboard')),
  AgentSales: lazy(() => import('../features/dashboard/agent/AgentSalesDashboard'))
};

// Componentes comunes
const Placeholder = lazy(() => import('../components/common/Placeholder'));

// Componente para mostrar mientras se carga un componente
const LoadingFallback = ({ children }: { children?: React.ReactNode }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700">
      {children}
    </div>
  </div>
);

// Componente para manejar errores en la carga de rutas
const RouteErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = React.useState(false);

  // Resetear el estado de error cuando cambia la ruta
  React.useEffect(() => {
    setHasError(false);
  }, [window.location.pathname]);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 w-full max-w-2xl">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error al cargar la página
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Lo sentimos, ha ocurrido un error al cargar esta página. Por favor, intente recargar la página o intente más tarde.</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Recargar página
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Componente de envoltura para manejar errores en rutas
const ErrorBoundaryRoute = ({ children }: { children: React.ReactNode }) => {
  return <RouteErrorBoundary>{children}</RouteErrorBoundary>;
};

// Función para envolver los componentes con manejo de errores
const withErrorBoundary = (Component: React.ComponentType) => {
  return (props: any) => (
    <ErrorBoundaryRoute>
      <Component {...props} />
    </ErrorBoundaryRoute>
  );
};

// Componentes con manejo de errores
const LoginWithErrorBoundary = withErrorBoundary(AuthPages.Login);
const RegisterWithErrorBoundary = withErrorBoundary(AuthPages.Register);
const LandingWithErrorBoundary = withErrorBoundary(AuthPages.Landing);
const ProfilePageWithErrorBoundary = withErrorBoundary(AuthPages.ProfilePage);
const SettingsPageWithErrorBoundary = withErrorBoundary(AuthPages.SettingsPage);
const NotFoundWithErrorBoundary = withErrorBoundary(AuthPages.NotFound);

// Dashboards con manejo de errores
const UserDashboardWithErrorBoundary = withErrorBoundary(Dashboards.User);
const AgentDashboardWithErrorBoundary = withErrorBoundary(Dashboards.Agent);
const AgencyDashboardWithErrorBoundary = withErrorBoundary(Dashboards.Agency);
const AdminDashboardWithErrorBoundary = withErrorBoundary(Dashboards.Admin);
const AgentSalesDashboardWithErrorBoundary = withErrorBoundary(Dashboards.AgentSales);

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  // Redirección inteligente basada en autenticación y rol
  const getDefaultRoute = () => {
    if (!isAuthenticated) return '/landing';
    
    switch (user?.role) {
      case 'CLIENTE':
        return '/usuario/dashboard';
      case 'AGENTE':
        return '/agente/dashboard';
      case 'AGENCIA':
        return '/agencia/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return '/dashboard';
    }
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Ruta raíz con redirección a landing */}
        <Route path="/" element={<Navigate to="/landing" replace />} />
        
        {/* Rutas públicas */}
        <Route path="/landing" element={<LandingWithErrorBoundary />} />
        <Route path="/login" element={<LoginWithErrorBoundary />} />
        <Route path="/register" element={<RegisterWithErrorBoundary />} />

        {/* Rutas para CLIENTE */}
        <Route path="/usuario" element={<PrivateRoute allowedRoles={['CLIENTE', 'ADMIN']} />}>
          <Route path="dashboard" element={<UserDashboardWithErrorBoundary />} />
          <Route path="mis-polizas" element={<Placeholder title="Mis Pólizas" />} />
          <Route path="siniestros" element={<Placeholder title="Siniestros" />} />
          <Route path="pagos" element={<Placeholder title="Pagos" />} />
          <Route path="documentos" element={<Placeholder title="Documentos" />} />
          <Route path="cotizaciones" element={<Placeholder title="Cotizaciones" />} />
          <Route path="notificaciones" element={<NotificationsPage />} />
          <Route path="perfil" element={<ProfilePageWithErrorBoundary />} />
          <Route path="configuracion" element={<SettingsPageWithErrorBoundary />}>
            <Route index element={<Navigate to="general" replace />} />
            <Route path="general" element={<Placeholder title="Configuración General" />} />
            <Route path="seguridad" element={<Placeholder title="Seguridad y Privacidad" />} />
            <Route path="notificaciones" element={<Placeholder title="Preferencias de Notificaciones" />} />
          </Route>
          <Route path="contacto-soporte" element={<Placeholder title="Contacto con Soporte" />} />
        </Route>

        {/* Rutas para AGENTE */}
        <Route path="/agente" element={<PrivateRoute allowedRoles={['AGENTE', 'ADMIN']} />}>
          <Route path="dashboard" element={<AgentDashboardWithErrorBoundary />} />
          
          {/* Rutas de Clientes */}
          <Route path="clientes">
            <Route index element={<Navigate to="listado" replace />} />
            <Route path="listado" element={<GestionClientes clientes={[]} />} />
            <Route path="crm" element={<GestionClientes clientes={[]} />} />
          </Route>
          
          {/* Rutas de Pólizas */}
          <Route path="polizas">
            <Route index element={<Navigate to="listado" replace />} />
            <Route path="listado" element={<PolizasListado polizas={[]} />} />
            <Route path="cumplimiento" element={<Placeholder title="Cumplimiento, Judicial, etc" />} />
          </Route>
          
          <Route path="remisiones" element={<Placeholder title="Remisiones" />} />
          <Route path="tareas" element={<Placeholder title="Tareas" />} />
          
          {/* Rutas de Cobros */}
          <Route path="cobros">
            <Route index element={<Navigate to="pagos" replace />} />
            <Route path="pagos" element={<Placeholder title="Listado de pagos" />} />
            <Route path="recibos" element={<Placeholder title="Recibos y Cuadre de caja" />} />
            <Route path="liquidar" element={<Placeholder title="Liquidar vendedores" />} />
          </Route>
          
          <Route path="informes" element={<Placeholder title="Informes" />} />
          <Route path="archivos" element={<Placeholder title="Archivos" />} />
          <Route path="siniestros" element={<Placeholder title="Siniestros" />} />
          <Route path="facturas" element={<Placeholder title="Facturas" />} />
          <Route path="diligencias" element={<Placeholder title="Diligencias" />} />
          
          {/* Perfil */}
          <Route path="perfil" element={<AuthPages.ProfilePage />} />
          
          {/* Configuración */}
          <Route path="configuracion" element={<AuthPages.SettingsPage />}>
            <Route index element={<Navigate to="general" replace />} />
            <Route path="general" element={<Placeholder title="Configuración General" />} />
            <Route path="usuarios" element={<Placeholder title="Usuarios" />} />
            <Route path="informacion" element={<Placeholder title="Información de agencia" />} />
            <Route path="sedes" element={<Placeholder title="Sedes" />} />
            <Route path="aseguradoras" element={<Placeholder title="Aseguradoras" />} />
            <Route path="ramos" element={<Placeholder title="Ramos" />} />
            <Route path="vendedores" element={<Placeholder title="Vendedores" />} />
            <Route path="estados-siniestros" element={<Placeholder title="Estados Siniestros" />} />
            <Route path="estados-arl" element={<Placeholder title="Estados ARL" />} />
            <Route path="motivos-estados" element={<Placeholder title="Motivos estados póliza" />} />
            <Route path="tipo-afiliacion" element={<Placeholder title="Tipo afiliación" />} />
            <Route path="mensajeros" element={<Placeholder title="Mensajeros" />} />
            <Route path="coberturas" element={<Placeholder title="Coberturas" />} />
            <Route path="seguridad" element={<Placeholder title="Seguridad" />} />
            <Route path="notificaciones" element={<Placeholder title="Notificaciones" />} />
          </Route>

          {/* Importar Plantillas */}
          <Route path="importar" element={<Placeholder title="Importar Plantillas" />}>
            <Route index element={<Navigate to="aseguradoras" replace />} />
            <Route path="aseguradoras" element={<Placeholder title="Importar Aseguradoras" />} />
            <Route path="ramos" element={<Placeholder title="Importar Ramos" />} />
            <Route path="vendedores" element={<Placeholder title="Importar Vendedores" />} />
            <Route path="clientes" element={<Placeholder title="Importar Clientes" />} />
            <Route path="polizas" element={<Placeholder title="Importar Pólizas" />} />
            <Route path="polizas-cumplimiento" element={<Placeholder title="Importar Pólizas de cumplimiento y judicial" />} />
            <Route path="campos-ramo" element={<Placeholder title="Campos adicionales por ramo" />} />
            <Route path="anexos" element={<Placeholder title="Anexos" />} />
            <Route path="cobros" element={<Placeholder title="Cobros" />} />
            <Route path="vinculados" element={<Placeholder title="Vinculados" />} />
            <Route path="beneficiarios" element={<Placeholder title="Beneficiarios" />} />
            <Route path="crm" element={<Placeholder title="CRM" />} />
            <Route path="siniestros" element={<Placeholder title="Siniestros" />} />
            <Route path="amparos" element={<Placeholder title="Amparos" />} />
            <Route path="coberturas" element={<Placeholder title="Coberturas" />} />
            <Route path="tareas" element={<Placeholder title="Tareas" />} />
            <Route path="datos-adicionales" element={<Placeholder title="Datos adicionales" />} />
          </Route>
          
          <Route path="ventas" element={<AgentSalesDashboardWithErrorBoundary />} />
        </Route>

        {/* Rutas para AGENCIA */}
        <Route path="/agencia" element={<PrivateRoute allowedRoles={['AGENCIA', 'ADMIN']} />}>
          <Route path="dashboard" element={<AgencyDashboardWithErrorBoundary />} />
          
          {/* Rutas de Clientes */}
          <Route path="clientes">
            <Route index element={<Navigate to="listado" replace />} />
            <Route path="listado" element={<GestionClientes clientes={[]} />} />
            <Route path="crm" element={<CrmDashboard />} />
            <Route path="crm/*" element={<CrmDashboard />} />
            <Route path="crm" element={<CrmDashboard />} />
          </Route>
          
          {/* Rutas de Pólizas */}
          <Route path="polizas">
            <Route index element={<Navigate to="listado" replace />} />
            <Route path="listado" element={<PolizasListado polizas={[]} />} />
            <Route path="cumplimiento" element={<Placeholder title="Cumplimiento, Judicial, etc" />} />
          </Route>
          
          <Route path="remisiones" element={<Placeholder title="Remisiones" />} />
          <Route path="tareas" element={<Placeholder title="Tareas" />} />
          
          {/* Rutas de Cobros */}
          <Route path="cobros">
            <Route index element={<Navigate to="pagos" replace />} />
            <Route path="pagos" element={<Placeholder title="Listado de pagos" />} />
            <Route path="recibos" element={<Placeholder title="Recibos y Cuadre de caja" />} />
            <Route path="liquidar" element={<Placeholder title="Liquidar vendedores" />} />
          </Route>
          
          <Route path="informes" element={<Placeholder title="Informes" />} />
          <Route path="archivos" element={<Placeholder title="Archivos" />} />
          <Route path="siniestros" element={<Placeholder title="Siniestros" />} />
          <Route path="facturas" element={<Placeholder title="Facturas" />} />
          <Route path="diligencias" element={<Placeholder title="Diligencias" />} />
          
          {/* Perfil */}
          <Route path="perfil" element={<AuthPages.ProfilePage />} />
          
          {/* Configuración */}
          <Route path="configuracion" element={<AuthPages.SettingsPage />}>
            <Route index element={<Navigate to="general" replace />} />
            <Route path="general" element={<Placeholder title="Configuración General" />} />
            <Route path="usuarios" element={<Placeholder title="Usuarios" />} />
            <Route path="informacion" element={<Placeholder title="Información de agencia" />} />
            <Route path="sedes" element={<Placeholder title="Sedes" />} />
            <Route path="aseguradoras" element={<Placeholder title="Aseguradoras" />} />
            <Route path="ramos" element={<Placeholder title="Ramos" />} />
            <Route path="vendedores" element={<Placeholder title="Vendedores" />} />
            <Route path="estados-siniestros" element={<Placeholder title="Estados Siniestros" />} />
            <Route path="estados-arl" element={<Placeholder title="Estados ARL" />} />
            <Route path="motivos-estados" element={<Placeholder title="Motivos estados póliza" />} />
            <Route path="tipo-afiliacion" element={<Placeholder title="Tipo afiliación" />} />
            <Route path="mensajeros" element={<Placeholder title="Mensajeros" />} />
            <Route path="coberturas" element={<Placeholder title="Coberturas" />} />
            <Route path="seguridad" element={<Placeholder title="Seguridad" />} />
            <Route path="notificaciones" element={<Placeholder title="Notificaciones" />} />
          </Route>

          {/* Importar Plantillas */}
          <Route path="importar" element={<Placeholder title="Importar Plantillas" />}>
            <Route index element={<Navigate to="aseguradoras" replace />} />
            <Route path="aseguradoras" element={<Placeholder title="Importar Aseguradoras" />} />
            <Route path="ramos" element={<Placeholder title="Importar Ramos" />} />
            <Route path="vendedores" element={<Placeholder title="Importar Vendedores" />} />
            <Route path="clientes" element={<Placeholder title="Importar Clientes" />} />
            <Route path="polizas" element={<Placeholder title="Importar Pólizas" />} />
            <Route path="polizas-cumplimiento" element={<Placeholder title="Importar Pólizas de cumplimiento y judicial" />} />
            <Route path="campos-ramo" element={<Placeholder title="Campos adicionales por ramo" />} />
            <Route path="anexos" element={<Placeholder title="Anexos" />} />
            <Route path="cobros" element={<Placeholder title="Cobros" />} />
            <Route path="vinculados" element={<Placeholder title="Vinculados" />} />
            <Route path="beneficiarios" element={<Placeholder title="Beneficiarios" />} />
            <Route path="crm" element={<Placeholder title="CRM" />} />
            <Route path="siniestros" element={<Placeholder title="Siniestros" />} />
            <Route path="amparos" element={<Placeholder title="Amparos" />} />
            <Route path="coberturas" element={<Placeholder title="Coberturas" />} />
            <Route path="tareas" element={<Placeholder title="Tareas" />} />
            <Route path="datos-adicionales" element={<Placeholder title="Datos adicionales" />} />
          </Route>
        </Route>

        {/* Rutas para ADMIN */}
        <Route path="/admin" element={<PrivateRoute allowedRoles={['ADMIN']} />}>
          <Route path="dashboard" element={<AdminDashboardWithErrorBoundary />} />
          <Route path="usuarios" element={<Placeholder title="Gestión de Usuarios" />} />
          <Route path="configuracion" element={<SettingsPageWithErrorBoundary />}>
            <Route index element={<Navigate to="general" replace />} />
            <Route path="general" element={<Placeholder title="Configuración General" />} />
            <Route path="seguridad" element={<Placeholder title="Configuración de Seguridad" />} />
            <Route path="notificaciones" element={<Placeholder title="Configuración de Notificaciones" />} />
          </Route>
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<NotFoundWithErrorBoundary />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
