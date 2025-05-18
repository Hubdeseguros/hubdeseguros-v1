import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PrivateRoute from './PrivateRoute';
import { UserRole } from '@/types/auth';
import NotificationsPage from "@/pages/Notifications";
import PolizasListado from "@/features/polizas/pages/PolizasListado";

// Import types for better type checking
import type { Notification } from '@/types/notifications';

// Pages con lazy loading
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Landing = lazy(() => import('../pages/Landing'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));

// Dashboards específicos por rol
const UserDashboard = lazy(() => import('../features/dashboard/user/UserDashboard'));
const AgentDashboard = lazy(() => import('../features/dashboard/agent/AgentDashboard'));
const AgencyDashboard = lazy(() => import('../features/dashboard/agency/AgencyDashboard'));
const AdminDashboard = lazy(() => import('../features/dashboard/admin/AdminDashboard'));

// Páginas de ejemplo para cada sección
const Placeholder = lazy(() => import('../components/common/Placeholder'));

// Páginas de la aplicación
const AgentSalesDashboard = lazy(() => import('../features/dashboard/agent/AgentSalesDashboard'));
const Clientes = lazy(() => import('../pages/Clientes'));
const ClientesVacio = lazy(() => import('../pages/ClientesVacio'));
const GestionClientes = lazy(() => import('../features/clientes/pages/GestionClientes'));
const CRMClientes = lazy(() => import('../features/clientes/pages/crm/CRMClientes'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
  </div>
);

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
        {/* Ruta raíz muestra directamente ClientesVacio */}
        <Route path="/" element={<ClientesVacio />} />
        
        {/* Rutas públicas */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Ruta temporal para ver clientes */}
        <Route path="/clientes" element={<ClientesVacio />} />

        {/* Rutas para CLIENTE */}
        <Route path="/usuario" element={<PrivateRoute allowedRoles={['CLIENTE', 'ADMIN']} />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="mis-polizas" element={<Placeholder title="Mis Pólizas" />} />
          <Route path="siniestros" element={<Placeholder title="Siniestros" />} />
          <Route path="pagos" element={<Placeholder title="Pagos" />} />
          <Route path="documentos" element={<Placeholder title="Documentos" />} />
          <Route path="cotizaciones" element={<Placeholder title="Cotizaciones" />} />
          <Route path="notificaciones" element={<NotificationsPage />} />
          <Route path="perfil" element={<ProfilePage />} />
          <Route path="configuracion" element={<SettingsPage />}>
            <Route index element={<Navigate to="general" replace />} />
            <Route path="general" element={<Placeholder title="Configuración General" />} />
            <Route path="seguridad" element={<Placeholder title="Seguridad y Privacidad" />} />
            <Route path="notificaciones" element={<Placeholder title="Preferencias de Notificaciones" />} />
          </Route>
          <Route path="contacto-soporte" element={<Placeholder title="Contacto con Soporte" />} />
        </Route>

        {/* Rutas para AGENTE */}
        <Route path="/agente" element={<PrivateRoute allowedRoles={['AGENTE', 'ADMIN']} />}>
          <Route path="dashboard" element={<AgentDashboard />} />
          <Route path="clientes" element={<Navigate to="gestion" replace />} />
          <Route path="clientes/gestion/*" element={<GestionClientes />} />
          <Route path="clientes/crm" element={<CRMClientes />} />
          <Route path="clientes/listado" element={<GestionClientes />} />
          <Route path="polizas/listado" element={<PolizasListado />} />
          <Route path="clientes/nuevo" element={<GestionClientes />} />
          <Route path="polizas" element={<Placeholder title="Pólizas" />} />
          <Route path="polizas/listado" element={<Placeholder title="Listado de Pólizas" />} />
          <Route path="polizas/cumplimiento" element={<Placeholder title="Cumplimiento, Judicial, etc" />} />
          <Route path="remisiones" element={<Placeholder title="Remisiones" />} />
          <Route path="tareas" element={<Placeholder title="Tareas" />} />
          <Route path="cobros" element={<Placeholder title="Cobros" />} />
          <Route path="cobros/pagos" element={<Placeholder title="Listado de pagos" />} />
          <Route path="cobros/recibos" element={<Placeholder title="Recibos y Cuadre de caja" />} />
          <Route path="cobros/liquidar" element={<Placeholder title="Liquidar vendedores" />} />
          <Route path="informes" element={<Placeholder title="Informes" />} />
          <Route path="archivos" element={<Placeholder title="Archivos" />} />
          <Route path="siniestros" element={<Placeholder title="Siniestros" />} />
          <Route path="facturas" element={<Placeholder title="Facturas" />} />
          <Route path="diligencias" element={<Placeholder title="Diligencias" />} />
          
          {/* Perfil */}
          <Route path="perfil" element={<ProfilePage />} />
          
          {/* Configuración */}
          <Route path="configuracion" element={<SettingsPage />}>
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
          <Route path="importar" element={<Placeholder title="Importar Plantillas" />} />
          <Route path="importar/aseguradoras" element={<Placeholder title="Importar Aseguradoras" />} />
          <Route path="importar/ramos" element={<Placeholder title="Importar Ramos" />} />
          <Route path="importar/vendedores" element={<Placeholder title="Importar Vendedores" />} />
          <Route path="importar/clientes" element={<Placeholder title="Importar Clientes" />} />
          <Route path="importar/polizas" element={<Placeholder title="Importar Pólizas" />} />
          <Route path="importar/polizas-cumplimiento" element={<Placeholder title="Importar Pólizas de cumplimiento y judicial" />} />
          <Route path="importar/campos-ramo" element={<Placeholder title="Campos adicionales por ramo" />} />
          <Route path="importar/anexos" element={<Placeholder title="Anexos" />} />
          <Route path="importar/cobros" element={<Placeholder title="Cobros" />} />
          <Route path="importar/vinculados" element={<Placeholder title="Vinculados" />} />
          <Route path="importar/beneficiarios" element={<Placeholder title="Beneficiarios" />} />
          <Route path="importar/crm" element={<Placeholder title="CRM" />} />
          <Route path="importar/siniestros" element={<Placeholder title="Siniestros" />} />
          <Route path="importar/amparos" element={<Placeholder title="Amparos" />} />
          <Route path="importar/coberturas" element={<Placeholder title="Coberturas" />} />
          <Route path="importar/tareas" element={<Placeholder title="Tareas" />} />
          <Route path="importar/datos-adicionales" element={<Placeholder title="Datos adicionales" />} />
          <Route path="ventas" element={<AgentSalesDashboard />} />
        </Route>

        {/* Rutas para AGENCIA */}
        <Route path="/agencia" element={<PrivateRoute allowedRoles={['AGENCIA', 'ADMIN']} />}>
          <Route path="dashboard" element={<AgencyDashboard />} />
          <Route path="clientes" element={<Placeholder title="Clientes" />} />
          <Route path="clientes/listado" element={<Placeholder title="Listado de Clientes" />} />
          <Route path="clientes/crm" element={<Placeholder title="Asistente Comercial/CRM" />} />
          <Route path="polizas" element={<Placeholder title="Pólizas" />} />
          <Route path="polizas/listado" element={<Placeholder title="Listado de Pólizas" />} />
          <Route path="polizas/cumplimiento" element={<Placeholder title="Cumplimiento, Judicial, etc" />} />
          <Route path="remisiones" element={<Placeholder title="Remisiones" />} />
          <Route path="tareas" element={<Placeholder title="Tareas" />} />
          <Route path="cobros" element={<Placeholder title="Cobros" />} />
          <Route path="cobros/pagos" element={<Placeholder title="Listado de pagos" />} />
          <Route path="cobros/recibos" element={<Placeholder title="Recibos y Cuadre de caja" />} />
          <Route path="cobros/liquidar" element={<Placeholder title="Liquidar vendedores" />} />
          <Route path="informes" element={<Placeholder title="Informes" />} />
          <Route path="archivos" element={<Placeholder title="Archivos" />} />
          <Route path="siniestros" element={<Placeholder title="Siniestros" />} />
          <Route path="facturas" element={<Placeholder title="Facturas" />} />
          <Route path="diligencias" element={<Placeholder title="Diligencias" />} />
          
          {/* Perfil */}
          <Route path="perfil" element={<ProfilePage />} />
          
          {/* Configuración */}
          <Route path="configuracion" element={<SettingsPage />}>
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
          <Route path="importar" element={<Placeholder title="Importar Plantillas" />} />
          <Route path="importar/aseguradoras" element={<Placeholder title="Importar Aseguradoras" />} />
          <Route path="importar/ramos" element={<Placeholder title="Importar Ramos" />} />
          <Route path="importar/vendedores" element={<Placeholder title="Importar Vendedores" />} />
          <Route path="importar/clientes" element={<Placeholder title="Importar Clientes" />} />
          <Route path="importar/polizas" element={<Placeholder title="Importar Pólizas" />} />
          <Route path="importar/polizas-cumplimiento" element={<Placeholder title="Importar Pólizas de cumplimiento y judicial" />} />
          <Route path="importar/campos-ramo" element={<Placeholder title="Campos adicionales por ramo" />} />
          <Route path="importar/anexos" element={<Placeholder title="Anexos" />} />
          <Route path="importar/cobros" element={<Placeholder title="Cobros" />} />
          <Route path="importar/vinculados" element={<Placeholder title="Vinculados" />} />
          <Route path="importar/beneficiarios" element={<Placeholder title="Beneficiarios" />} />
          <Route path="importar/crm" element={<Placeholder title="CRM" />} />
          <Route path="importar/siniestros" element={<Placeholder title="Siniestros" />} />
          <Route path="importar/amparos" element={<Placeholder title="Amparos" />} />
          <Route path="importar/coberturas" element={<Placeholder title="Coberturas" />} />
          <Route path="importar/tareas" element={<Placeholder title="Tareas" />} />
          <Route path="importar/datos-adicionales" element={<Placeholder title="Datos adicionales" />} />
        </Route>

        {/* Rutas para ADMIN */}
        <Route path="/admin" element={<PrivateRoute allowedRoles={['ADMIN']} />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="vista-general" element={<AdminDashboard />} />
          <Route path="usuarios" element={<Placeholder title="Gestión de Usuarios" />} />
          <Route path="agencias" element={<Placeholder title="Gestión de Agencias" />} />
          <Route path="agentes" element={<Placeholder title="Gestión de Agentes" />} />
          <Route path="configuracion" element={<SettingsPage />}>
            <Route index element={<Navigate to="general" replace />} />
            <Route path="general" element={<Placeholder title="Configuración General" />} />
            <Route path="seguridad" element={<Placeholder title="Seguridad y Privacidad" />} />
            <Route path="notificaciones" element={<Placeholder title="Notificaciones del Sistema" />} />
          </Route>
          <Route path="perfil" element={<ProfilePage />} />
        </Route>

        {/* Ruta 404 - Redirigir a landing */}
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
