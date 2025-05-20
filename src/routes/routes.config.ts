import { UserRole } from '../types/auth';
import { 
  BarChart4, 
  AlertCircle, 
  CreditCard, 
  FileText, 
  Calculator, 
  Users, 
  Shield, 
  ShoppingCart, 
  UserPlus, 
  CheckSquare, 
  Calendar, 
  PieChart, 
  Folder, 
  GitBranch, 
  Building, 
  Settings,
  LayoutDashboard,
  KeyRound,
  ClipboardList,
  Database,
  Bell,
  Contact,
  DollarSign
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

export interface MenuItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  notificationCount?: number;
  tooltip?: string;
  items?: Omit<MenuItem, 'icon' | 'items'>[];
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export interface RouteConfig {
  path: string;
  sections: MenuSection[];
}

// Configuración de rutas para el rol de usuario (CLIENTE)
export const userRoutes: RouteConfig = {
  path: '/usuario/dashboard',
  sections: [
    {
      title: 'PRINCIPALES',
      items: [
        { 
          key: 'mis-polizas', 
          label: 'Mis Pólizas', 
          icon: Shield, 
          path: '/usuario/mis-polizas',
          tooltip: 'Administra tus pólizas contratadas'
        },
        { 
          key: 'siniestros', 
          label: 'Siniestros', 
          icon: AlertCircle, 
          path: '/usuario/siniestros',
          tooltip: 'Reporta y da seguimiento a tus siniestros'
        },
        { 
          key: 'pagos', 
          label: 'Pagos', 
          icon: CreditCard, 
          path: '/usuario/pagos',
          tooltip: 'Realiza y administra tus pagos'
        },
        { 
          key: 'notificaciones', 
          label: 'Notificaciones', 
          icon: Bell, 
          path: '/usuario/notificaciones',
          notificationCount: 3,
          tooltip: 'Centro de notificaciones'
        }
      ]
    },
    {
      title: 'GESTIÓN',
      items: [
        { 
          key: 'documentos', 
          label: 'Documentos', 
          icon: FileText, 
          path: '/usuario/documentos',
          tooltip: 'Accede a tus documentos importantes' 
        },
        { 
          key: 'cotizaciones', 
          label: 'Cotizaciones', 
          icon: Calculator, 
          path: '/usuario/cotizaciones',
          tooltip: 'Solicita cotizaciones de seguros'
        },
        { 
          key: 'contacto-soporte', 
          label: 'Contacto con Soporte', 
          icon: Contact, 
          path: '/usuario/contacto-soporte',
          tooltip: 'Contacta con nuestro equipo de soporte'
        }
      ]
    }
  ]
};

// Configuración de rutas para el rol de agente
export const agentRoutes: RouteConfig = {
  path: '/promotor/dashboard',
  sections: [
    {
      title: 'PRINCIPALES',
      items: [
        { 
          key: 'clientes', 
          label: 'Clientes', 
          icon: Users, 
          path: '/promotor/clientes',
          tooltip: 'Administra tu cartera de clientes'
        },
        { 
          key: 'polizas', 
          label: 'Pólizas', 
          icon: Shield, 
          path: '/promotor/polizas',
          tooltip: 'Gestiona las pólizas de tus clientes'
        },
        { 
          key: 'siniestros', 
          label: 'Siniestros', 
          icon: AlertCircle, 
          path: '/promotor/siniestros',
          tooltip: 'Seguimiento de siniestros reportados'
        },
        { 
          key: 'ventas', 
          label: 'Ventas', 
          icon: ShoppingCart, 
          path: '/promotor/ventas',
          tooltip: 'Administra tus ventas y comisiones'
        },
        { 
          key: 'cobros', 
          label: 'Cobros', 
          icon: CreditCard, 
          path: '/promotor/cobros',
          tooltip: 'Gestiona cobros y pagos pendientes'
        },
        { 
          key: 'notificaciones', 
          label: 'Notificaciones', 
          icon: Bell, 
          path: '/promotor/notificaciones',
          notificationCount: 5,
          tooltip: 'Centro de notificaciones'
        }
      ]
    },
    {
      title: 'GESTIÓN',
      items: [
        { 
          key: 'leads', 
          label: 'Leads', 
          icon: UserPlus, 
          path: '/promotor/leads',
          tooltip: 'Administra tus prospectos de clientes'
        },
        { 
          key: 'tareas', 
          label: 'Tareas', 
          icon: CheckSquare, 
          path: '/promotor/tareas',
          tooltip: 'Gestiona tus tareas pendientes',
          notificationCount: 3
        },
        { 
          key: 'calendario', 
          label: 'Calendario', 
          icon: Calendar, 
          path: '/promotor/calendario',
          tooltip: 'Organiza tus citas y recordatorios'
        }
      ]
    },
    {
      title: 'REPORTES',
      items: [
        { 
          key: 'estadisticas', 
          label: 'Estadísticas', 
          icon: BarChart4, 
          path: '/promotor/estadisticas',
          tooltip: 'Visualiza tus indicadores de desempeño'
        },
        { 
          key: 'cotizaciones', 
          label: 'Cotizaciones', 
          icon: FileText, 
          path: '/promotor/cotizaciones',
          tooltip: 'Administra tus cotizaciones',
          notificationCount: 2
        },
        { 
          key: 'facturas', 
          label: 'Facturas', 
          icon: FileText, 
          path: '/promotor/facturas',
          tooltip: 'Gestiona tus facturas y comprobantes'
        }
      ]
    }
  ]
};

// Configuración de rutas para el rol de agencia
export const agencyRoutes: RouteConfig = {
  path: '/agencia/dashboard',
  sections: [
    {
      title: 'DASHBOARD',
      items: [
        { 
          key: 'inicio', 
          label: 'Inicio', 
          icon: LayoutDashboard, 
          path: '/agencia/dashboard',
          tooltip: 'Panel principal de la agencia'
        },
        { 
          key: 'panel-principal', 
          label: 'Panel Principal', 
          icon: BarChart4, 
          path: '/agencia/panel-principal',
          tooltip: 'Vista general de métricas y KPI\'s'
        }
      ]
    },
    {
      title: 'GESTIÓN DE CLIENTES',
      items: [
        { 
          key: 'clientes-listado', 
          label: 'Listado de Clientes', 
          icon: Users, 
          path: '/agencia/clientes',
          tooltip: 'Administrar el listado de clientes'
        },
        { 
          key: 'crm', 
          label: 'Asistente Comercial/CRM', 
          icon: Contact, 
          path: '/agencia/crm',
          tooltip: 'Sistema de gestión de relaciones con clientes'
        }
      ]
    },
    {
      title: 'GESTIÓN DE PÓLIZAS',
      items: [
        { 
          key: 'polizas-listado', 
          label: 'Listado de Pólizas', 
          icon: FileText, 
          path: '/agencia/polizas',
          tooltip: 'Administrar el listado de pólizas'
        },
        { 
          key: 'cumplimiento-judicial', 
          label: 'Cumplimiento y Judicial', 
          icon: Shield, 
          path: '/agencia/cumplimiento',
          tooltip: 'Gestión de pólizas en cumplimiento y procesos judiciales'
        }
      ]
    },
    {
      title: 'GESTIÓN FINANCIERA',
      items: [
        { 
          key: 'cobros', 
          label: 'Cobros', 
          icon: DollarSign, 
          path: '/agencia/cobros',
          items: [
            { 
              key: 'pagos-listado', 
              label: 'Listado de pagos', 
              path: '/agencia/cobros/pagos' 
            },
            { 
              key: 'recibos-cuadre', 
              label: 'Recibos y Cuadre de caja', 
              path: '/agencia/cobros/recibos' 
            },
            { 
              key: 'liquidar-vendedores', 
              label: 'Liquidar vendedores', 
              path: '/agencia/cobros/liquidacion' 
            }
          ]
        },
        { 
          key: 'informes-financieros', 
          label: 'Informes', 
          icon: PieChart, 
          path: '/agencia/informes/financieros',
          tooltip: 'Informes y reportes financieros'
        }
      ]
    },
    {
      title: 'GESTIÓN OPERATIVA',
      items: [
        { 
          key: 'archivos', 
          label: 'Archivos', 
          icon: Folder, 
          path: '/agencia/archivos',
          tooltip: 'Gestión de archivos y documentos'
        },
        { 
          key: 'siniestros', 
          label: 'Siniestros', 
          icon: AlertCircle, 
          path: '/agencia/siniestros',
          tooltip: 'Gestión de siniestros'
        },
        { 
          key: 'remisiones', 
          label: 'Remisiones', 
          icon: ClipboardList, 
          path: '/agencia/remisiones',
          tooltip: 'Gestión de remisiones'
        }
      ]
    },
    {
      title: 'CONFIGURACIÓN',
      items: [
        { 
          key: 'informacion-general', 
          label: 'Información General', 
          icon: Settings, 
          path: '/agencia/configuracion/general',
          tooltip: 'Configuración general de la agencia'
        },
        { 
          key: 'sedes', 
          label: 'Sedes', 
          icon: Building, 
          path: '/agencia/configuracion/sedes',
          tooltip: 'Gestión de sedes de la agencia'
        },
        { 
          key: 'aseguradoras', 
          label: 'Aseguradoras', 
          icon: Shield, 
          path: '/agencia/configuracion/aseguradoras',
          tooltip: 'Gestión de compañías aseguradoras'
        },
        { 
          key: 'ramos', 
          label: 'Ramos', 
          icon: GitBranch, 
          path: '/agencia/configuracion/ramos',
          tooltip: 'Gestión de ramos de seguros'
        },
        { 
          key: 'vendedores', 
          label: 'Vendedores', 
          icon: UserPlus, 
          path: '/agencia/configuracion/vendedores',
          tooltip: 'Gestión de vendedores'
        },
        { 
          key: 'estados-siniestros', 
          label: 'Estados Siniestros', 
          icon: AlertCircle, 
          path: '/agencia/configuracion/estados-siniestros',
          tooltip: 'Configuración de estados de siniestros'
        },
        { 
          key: 'estados-arl', 
          label: 'Estados ARL', 
          icon: CheckSquare, 
          path: '/agencia/configuracion/estados-arl',
          tooltip: 'Configuración de estados ARL'
        },
        { 
          key: 'motivos-estados', 
          label: 'Motivos estados póliza', 
          icon: FileText, 
          path: '/agencia/configuracion/motivos-estados',
          tooltip: 'Configuración de motivos de estados de póliza'
        },
        { 
          key: 'tipo-afiliacion', 
          label: 'Tipo afiliación', 
          icon: Users, 
          path: '/agencia/configuracion/tipo-afiliacion',
          tooltip: 'Configuración de tipos de afiliación'
        },
        { 
          key: 'mensajeros', 
          label: 'Mensajeros', 
          icon: UserPlus, 
          path: '/agencia/configuracion/mensajeros',
          tooltip: 'Gestión de mensajeros'
        },
        { 
          key: 'coberturas', 
          label: 'Coberturas', 
          icon: Shield, 
          path: '/agencia/configuracion/coberturas',
          tooltip: 'Gestión de coberturas de seguros'
        }
      ]
    },
    {
      title: 'IMPORTACIÓN DE DATOS',
      items: [
        { 
          key: 'importar-aseguradoras', 
          label: 'Aseguradoras', 
          icon: Database, 
          path: '/agencia/importar/aseguradoras',
          tooltip: 'Importar datos de aseguradoras'
        },
        { 
          key: 'importar-ramos', 
          label: 'Ramos', 
          icon: GitBranch, 
          path: '/agencia/importar/ramos',
          tooltip: 'Importar datos de ramos'
        },
        { 
          key: 'importar-vendedores', 
          label: 'Vendedores', 
          icon: UserPlus, 
          path: '/agencia/importar/vendedores',
          tooltip: 'Importar datos de vendedores'
        },
        { 
          key: 'importar-clientes', 
          label: 'Clientes', 
          icon: Users, 
          path: '/agencia/importar/clientes',
          tooltip: 'Importar datos de clientes'
        },
        { 
          key: 'importar-polizas', 
          label: 'Pólizas', 
          icon: FileText, 
          path: '/agencia/importar/polizas',
          tooltip: 'Importar datos de pólizas'
        },
        { 
          key: 'importar-polizas-cumplimiento', 
          label: 'Pólizas de cumplimiento', 
          icon: Shield, 
          path: '/agencia/importar/polizas-cumplimiento',
          tooltip: 'Importar datos de pólizas de cumplimiento'
        },
        { 
          key: 'importar-campos-adicionales', 
          label: 'Campos adicionales por ramo', 
          icon: FileText, 
          path: '/agencia/importar/campos-adicionales',
          tooltip: 'Importar campos adicionales por ramo'
        },
        { 
          key: 'importar-anexos', 
          label: 'Anexos', 
          icon: FileText, 
          path: '/agencia/importar/anexos',
          tooltip: 'Importar anexos'
        },
        { 
          key: 'importar-cobros', 
          label: 'Cobros', 
          icon: DollarSign, 
          path: '/agencia/importar/cobros',
          tooltip: 'Importar datos de cobros'
        },
        { 
          key: 'importar-amparos-siniestros', 
          label: 'Amparos Siniestros', 
          icon: AlertCircle, 
          path: '/agencia/importar/amparos-siniestros',
          tooltip: 'Importar datos de amparos de siniestros'
        },
        { 
          key: 'importar-datos-clientes', 
          label: 'Datos adicionales de clientes', 
          icon: Users, 
          path: '/agencia/importar/datos-clientes',
          tooltip: 'Importar datos adicionales de clientes'
        }
      ]
    }
  ]
};

// Configuración de rutas para el rol de administrador
export const adminRoutes: RouteConfig = {
  path: '/admin/dashboard',
  sections: [
    {
      title: 'PRINCIPALES',
      items: [
        { 
          key: 'vista-general', 
          label: 'Vista General', 
          icon: LayoutDashboard, 
          path: '/admin/vista-general',
          tooltip: 'Panel general de la plataforma'
        },
        { 
          key: 'usuarios', 
          label: 'Usuarios', 
          icon: Users, 
          path: '/admin/usuarios',
          tooltip: 'Gestión de usuarios del sistema'
        },
        { 
          key: 'agencias', 
          label: 'Agencias', 
          icon: Building, 
          path: '/admin/agencias',
          tooltip: 'Administración de agencias',
          notificationCount: 2
        },
        { 
          key: 'agentes', 
          label: 'Agentes', 
          icon: Users, 
          path: '/admin/agentes',
          tooltip: 'Administración de agentes',
          notificationCount: 3
        },
        { 
          key: 'notificaciones', 
          label: 'Notificaciones', 
          icon: Bell, 
          path: '/admin/notificaciones',
          notificationCount: 10,
          tooltip: 'Centro de notificaciones'
        }
      ]
    },
    {
      title: 'SISTEMA',
      items: [
        { 
          key: 'roles', 
          label: 'Roles', 
          icon: KeyRound, 
          path: '/admin/roles',
          tooltip: 'Gestión de roles y permisos'
        },
        { 
          key: 'permisos', 
          label: 'Permisos', 
          icon: ClipboardList, 
          path: '/admin/permisos',
          tooltip: 'Configuración de permisos del sistema'
        },
        { 
          key: 'logs', 
          label: 'Logs del Sistema', 
          icon: FileText, 
          path: '/admin/logs',
          tooltip: 'Registro de actividades del sistema'
        },
        { 
          key: 'backups', 
          label: 'Copias de Seguridad', 
          icon: Database, 
          path: '/admin/backups',
          tooltip: 'Gestión de backups del sistema'
        },
        { 
          key: 'configuracion', 
          label: 'Configuración', 
          icon: Settings, 
          path: '/admin/configuracion',
          tooltip: 'Configuración general de la plataforma'
        }
      ]
    },
  ]
};

export const getRoutesByRole = (role: UserRole): RouteConfig => {
  switch (role) {
    case 'CLIENTE':
      return userRoutes;
    case 'PROMOTOR':
      return agentRoutes;
    case 'AGENCIA':
      return agencyRoutes;
    case 'ADMIN':
      return adminRoutes;
    default:
      return adminRoutes; // Por defecto, si es ADMIN mostramos la vista de administrador
  }
};
