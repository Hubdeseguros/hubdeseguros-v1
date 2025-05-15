import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PrivateRoute from './PrivateRoute';
import { UserRole } from '@/types/auth';

// Pages con lazy loading
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Landing = lazy(() => import('../pages/Landing'));

// Dashboards específicos por rol
const UserDashboard = lazy(() => import('../features/dashboard/user/UserDashboard'));
const AgentDashboard = lazy(() => import('../features/dashboard/agent/AgentDashboard'));
const AgencyDashboard = lazy(() => import('../features/dashboard/agency/AgencyDashboard'));
const AdminDashboard = lazy(() => import('../features/dashboard/admin/AdminDashboard'));

// Páginas de ejemplo para cada sección
const Placeholder = lazy(() => import('../components/common/Placeholder'));

const AgentSalesDashboard = lazy(() => import('../features/dashboard/agent/AgentSalesDashboard'));

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
        {/* Ruta raíz con redirección inteligente */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
        
        {/* Rutas públicas */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas para CLIENTE */}
        <Route path="/usuario" element={<PrivateRoute allowedRoles={['CLIENTE', 'ADMIN']} />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="mis-polizas" element={<Placeholder title="Mis Pólizas" />} />
          <Route path="siniestros" element={<Placeholder title="Siniestros" />} />
          <Route path="pagos" element={<Placeholder title="Pagos" />} />
          <Route path="documentos" element={<Placeholder title="Documentos" />} />
          <Route path="cotizaciones" element={<Placeholder title="Cotizaciones" />} />
          <Route path="notificaciones" element={<Placeholder title="Notificaciones" />} />
          <Route path="contacto-soporte" element={<Placeholder title="Contacto con Soporte" />} />
        </Route>

        {/* Rutas para AGENTE */}
        <Route path="/agente" element={<PrivateRoute allowedRoles={['AGENTE', 'ADMIN']} />}>
          <Route path="dashboard" element={<AgentDashboard />} />
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
          {/* Configuración */}
          <Route path="configuracion" element={<Placeholder title="Configuración Agencia" />} />
          <Route path="configuracion/usuarios" element={<Placeholder title="Usuarios" />} />
          <Route path="configuracion/informacion" element={<Placeholder title="Información de agencia" />} />
          <Route path="configuracion/sedes" element={<Placeholder title="Sedes" />} />
          <Route path="configuracion/aseguradoras" element={<Placeholder title="Aseguradoras" />} />
          <Route path="configuracion/ramos" element={<Placeholder title="Ramos" />} />
          <Route path="configuracion/vendedores" element={<Placeholder title="Vendedores" />} />
          <Route path="configuracion/estados-siniestros" element={<Placeholder title="Estados Siniestros" />} />
          <Route path="configuracion/estados-arl" element={<Placeholder title="Estados ARL" />} />
          <Route path="configuracion/motivos-estados" element={<Placeholder title="Motivos estados póliza" />} />
          <Route path="configuracion/tipo-afiliacion" element={<Placeholder title="Tipo afiliación" />} />
          <Route path="configuracion/mensajeros" element={<Placeholder title="Mensajeros" />} />
          <Route path="configuracion/coberturas" element={<Placeholder title="Coberturas" />} />
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
          {/* Configuración */}
          <Route path="configuracion" element={<Placeholder title="Configuración Agencia" />} />
          <Route path="configuracion/usuarios" element={<Placeholder title="Usuarios" />} />
          <Route path="configuracion/informacion" element={<Placeholder title="Información de agencia" />} />
          <Route path="configuracion/sedes" element={<Placeholder title="Sedes" />} />
          <Route path="configuracion/aseguradoras" element={<Placeholder title="Aseguradoras" />} />
          <Route path="configuracion/ramos" element={<Placeholder title="Ramos" />} />
          <Route path="configuracion/vendedores" element={<Placeholder title="Vendedores" />} />
          <Route path="configuracion/estados-siniestros" element={<Placeholder title="Estados Siniestros" />} />
          <Route path="configuracion/estados-arl" element={<Placeholder title="Estados ARL" />} />
          <Route path="configuracion/motivos-estados" element={<Placeholder title="Motivos estados póliza" />} />
          <Route path="configuracion/tipo-afiliacion" element={<Placeholder title="Tipo afiliación" />} />
          <Route path="configuracion/mensajeros" element={<Placeholder title="Mensajeros" />} />
          <Route path="configuracion/coberturas" element={<Placeholder title="Coberturas" />} />
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
          <Route path="roles" element={<Placeholder title="Gestión de Roles" />} />
          <Route path="permisos" element={<Placeholder title="Gestión de Permisos" />} />
          <Route path="logs" element={<Placeholder title="Logs del Sistema" />} />
          <Route path="backups" element={<Placeholder title="Copias de Seguridad" />} />
          <Route path="configuracion" element={<Placeholder title="Configuración del Sistema" />} />
          <Route path="actividades" element={<Placeholder title="Registro de Actividades" />} />
          <Route path="sistema" element={<Placeholder title="Estado del Sistema" />} />
          <Route path="metricas/alertas" element={<Placeholder title="Alertas del Sistema" />} />
          <Route path="metricas/rendimiento" element={<Placeholder title="Rendimiento del Sistema" />} />
          {/* Extra: rutas de sidebar admin si aplica */}
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
          {/* Configuración */}
          <Route path="configuracion/usuarios" element={<Placeholder title="Usuarios" />} />
          <Route path="configuracion/informacion" element={<Placeholder title="Información de agencia" />} />
          <Route path="configuracion/sedes" element={<Placeholder title="Sedes" />} />
          <Route path="configuracion/aseguradoras" element={<Placeholder title="Aseguradoras" />} />
          <Route path="configuracion/ramos" element={<Placeholder title="Ramos" />} />
          <Route path="configuracion/vendedores" element={<Placeholder title="Vendedores" />} />
          <Route path="configuracion/estados-siniestros" element={<Placeholder title="Estados Siniestros" />} />
          <Route path="configuracion/estados-arl" element={<Placeholder title="Estados ARL" />} />
          <Route path="configuracion/motivos-estados" element={<Placeholder title="Motivos estados póliza" />} />
          <Route path="configuracion/tipo-afiliacion" element={<Placeholder title="Tipo afiliación" />} />
          <Route path="configuracion/mensajeros" element={<Placeholder title="Mensajeros" />} />
          <Route path="configuracion/coberturas" element={<Placeholder title="Coberturas" />} />
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

        {/* Página 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
