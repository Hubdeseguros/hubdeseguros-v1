import type { MenuIcon } from "@/components/ui/sidebar/types";
import {
  Home,
  BellRing,
  FileUser,
  FilePieChart,
  AlertTriangle,
  DollarSign,
  Users,
  UserPlus,
  Building2,
  Settings,
  FileText,
} from "lucide-react";

export const menuSections = [
  {
    title: "Navegación Principal",
    items: [
      {
        key: "dashboard",
        label: "Dashboard",
        icon: Home,
        path: "/",
      },
      {
        key: "notifications",
        label: "Notificaciones",
        icon: BellRing,
        path: "/notifications",
      },
      {
        key: "profile",
        label: "Perfil",
        icon: FileUser,
        path: "/profile",
      },
    ],
  },
  {
    title: "Seguros",
    items: [
      {
        key: "policies",
        label: "Pólizas",
        icon: FilePieChart,
        path: "/agente/polizas",
      },
      {
        key: "claims",
        label: "Siniestros",
        icon: AlertTriangle,
        path: "/agente/siniestros",
      },
      {
        key: "sales",
        label: "Ventas",
        icon: DollarSign,
        path: "/agente/ventas",
      },
      {
        key: "payments",
        label: "Pagos",
        icon: DollarSign,
        path: "/payments",
      },
    ],
  },
  {
    title: "Clientes",
    items: [
      {
        key: "clients",
        label: "Clientes",
        icon: Users,
        path: "/agente/clientes",
      },
      {
        key: "agents",
        label: "Agentes",
        icon: UserPlus,
        path: "/agents",
      },
      {
        key: "agencies",
        label: "Agencias",
        icon: Building2,
        path: "/agencies",
      },
    ],
  },
  {
    title: "Configuración",
    items: [
      {
        key: "settings",
        label: "Configuración",
        icon: Settings,
        path: "/settings",
      },
      {
        key: "documentation",
        label: "Documentación",
        icon: FileText,
        path: "/docs",
        target: "_blank",
      },
    ],
  },
];
