
import { 
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  BarChart4,
  Folder,
  Settings,
  Import,
  Home,
  File,
} from "lucide-react";

type MenuSubItem = {
  key: string;
  label: string;
  icon: any;
  path: string;
};

type MenuItem = {
  key: string;
  label: string;
  icon: any;
  path?: string;
  subMenu?: MenuSubItem[];
};

export type SidebarMenuSection = {
  key: string;
  title: string;
  items: MenuItem[];
};

// Estructura por ROL
export const SIDEBAR_MENUS: Record<string, SidebarMenuSection[]> = {
  ADMIN: [
    {
      key: "dashboard",
      title: "DASHBOARD",
      items: [
        { key: "inicio", label: "Inicio", icon: LayoutDashboard, path: "/admin/dashboard" }
      ],
    },

    {
      key: "polizas",
      title: "GESTIÓN DE PÓLIZAS",
      items: [
        { key: "polizas", label: "Listado de Pólizas", icon: FileText, path: "/admin/polizas/listado" },
        { key: "cumplimiento", label: "Cumplimiento y Judicial", icon: FileText, path: "/admin/polizas/cumplimiento" },
      ],
    },
    {
      key: "financiera",
      title: "GESTIÓN FINANCIERA",
      items: [
        {
          key: "cobros",
          label: "Cobros",
          icon: CreditCard,
          subMenu: [
            { key: "pagos", label: "Listado de pagos", icon: CreditCard, path: "/admin/cobros/pagos" },
            { key: "recibos", label: "Recibos y Cuadre de caja", icon: CreditCard, path: "/admin/cobros/recibos" },
            { key: "liquidar", label: "Liquidar vendedores", icon: CreditCard, path: "/admin/cobros/liquidar" },
          ],
        },
        { key: "informes", label: "Informes", icon: BarChart4, path: "/admin/informes" },
      ],
    },
    {
      key: "operativa",
      title: "GESTIÓN OPERATIVA",
      items: [
        { key: "archivos", label: "Archivos", icon: Folder, path: "/admin/archivos" },
        { key: "siniestros", label: "Siniestros", icon: FileText, path: "/admin/siniestros" },
        { key: "remisiones", label: "Remisiones", icon: FileText, path: "/admin/remisiones" },
      ],
    },
    {
      key: "configuracion",
      title: "CONFIGURACIÓN",
      items: [
        { key: "info", label: "Información General", icon: Settings, path: "/admin/configuracion/info" },
        { key: "sedes", label: "Sedes", icon: Settings, path: "/admin/configuracion/sedes" },
        { key: "aseguradoras", label: "Aseguradoras", icon: Settings, path: "/admin/configuracion/aseguradoras" },
        { key: "ramos", label: "Ramos", icon: Settings, path: "/admin/configuracion/ramos" },
        { key: "vendedores", label: "Vendedores", icon: Settings, path: "/admin/configuracion/vendedores" },
        { key: "estados-siniestros", label: "Estados Siniestros", icon: Settings, path: "/admin/configuracion/estados-siniestros" },
        { key: "estados-arl", label: "Estados ARL", icon: Settings, path: "/admin/configuracion/estados-arl" },
        { key: "motivos-estados", label: "Motivos estados póliza", icon: Settings, path: "/admin/configuracion/motivos-estados" },
        { key: "tipo-afiliacion", label: "Tipo afiliación", icon: Settings, path: "/admin/configuracion/tipo-afiliacion" },
        { key: "mensajeros", label: "Mensajeros", icon: Settings, path: "/admin/configuracion/mensajeros" },
        { key: "coberturas", label: "Coberturas", icon: Settings, path: "/admin/configuracion/coberturas" },
      ],
    },
    {
      key: "importacion",
      title: "IMPORTACIÓN DE DATOS",
      items: [
        { key: "import-aseguradoras", label: "Aseguradoras", icon: Import, path: "/admin/importar/aseguradoras" },
        { key: "import-ramos", label: "Ramos", icon: Import, path: "/admin/importar/ramos" },
        { key: "import-vendedores", label: "Vendedores", icon: Import, path: "/admin/importar/vendedores" },
        { key: "import-polizas", label: "Pólizas", icon: Import, path: "/admin/importar/polizas" },
        { key: "import-cumplimiento", label: "Pólizas de cumplimiento", icon: Import, path: "/admin/importar/polizas-cumplimiento" },
        { key: "import-campos-ramo", label: "Campos adicionales por ramo", icon: Import, path: "/admin/importar/campos-ramo" },
        { key: "import-anexos", label: "Anexos", icon: Import, path: "/admin/importar/anexos" },
        { key: "import-cobros", label: "Cobros", icon: Import, path: "/admin/importar/cobros" },
        { key: "import-amparos", label: "Amparos Siniestros", icon: Import, path: "/admin/importar/amparos" }
      ],
    },
  ],
  AGENCIA: [
    // ... copiar y ajustar igual que arriba para AGENCIA
    // Reutilizar estructura ADMIN si comparten la misma estructura, solo cambiando los paths base
    // OMITIDO POR BREVEDAD (puedo completarlo si lo deseas)
  ],
  AGENTE: [
    // ... igual que AGENCIA también puede heredar estructura, cambia paths base
  ],
};
