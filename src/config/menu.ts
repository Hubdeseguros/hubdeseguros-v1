import { UserRole } from '@/types/auth';
import { Home, Users, FileText, Folder, Settings, BarChart2 } from 'lucide-react';
import React from 'react';

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  roles: UserRole[];
  children?: MenuItem[];
}

// Iconos de Lucide
const icons = {
  dashboard: React.createElement(Home, { className: "w-5 h-5" }),
  clients: React.createElement(Users, { className: "w-5 h-5" }),
  policies: React.createElement(Folder, { className: "w-5 h-5" }),
  reports: React.createElement(BarChart2, { className: "w-5 h-5" }),
  settings: React.createElement(Settings, { className: "w-5 h-5" }),
  clientsList: React.createElement(Users, { className: "w-5 h-5" }),
  clientNew: React.createElement(Users, { className: "w-5 h-5" }),
  policiesList: React.createElement(Folder, { className: "w-5 h-5" }),
  policyNew: React.createElement(Folder, { className: "w-5 h-5" }),
  policyPayment: React.createElement(FileText, { className: "w-5 h-5" }),
  reportsList: React.createElement(BarChart2, { className: "w-5 h-5" }),
  users: React.createElement(Users, { className: "w-5 h-5" }),
  agencies: React.createElement(Folder, { className: "w-5 h-5" }),
  promoters: React.createElement(Users, { className: "w-5 h-5" })
} as const;

export const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: icons.dashboard,
    path: '/',
    roles: ['admin', 'promotor', 'cliente']
  },
  {
    id: 'clients',
    label: 'Clientes',
    icon: icons.clients,
    path: '/clients',
    roles: ['admin', 'promotor'],
    children: [
      {
        id: 'clients-list',
        label: 'Lista de Clientes',
        icon: icons.clientsList,
        path: '/clientes/lista',
        roles: ['promotor']
      },
      {
        id: 'client-new',
        label: 'Nuevo Cliente',
        icon: icons.clientNew,
        path: '/clientes/nuevo',
        roles: ['promotor']
      }
    ]
  },
  {
    id: 'policies',
    label: 'Pólizas',
    icon: icons.policies,
    path: '/policies',
    roles: ['admin', 'promotor', 'cliente'],
    children: [
      {
        id: 'policies-list',
        label: 'Lista de Pólizas',
        icon: icons.policiesList,
        path: '/policies/list',
        roles: ['promotor', 'cliente']
      },
      {
        id: 'payments',
        label: 'Pagos',
        icon: icons.policyPayment,
        path: '/policies/pagos',
        roles: ['promotor', 'cliente']
      },
      {
        id: 'policy-new',
        label: 'Nueva Póliza',
        icon: icons.policyNew,
        path: '/policies/new',
        roles: ['promotor']
      },
      {
        id: 'policy-payment',
        label: 'Pago de Póliza',
        icon: icons.policyPayment,
        path: '/policies/payment',
        roles: ['promotor']
      }
    ]
  },
  {
    id: 'reports',
    label: 'Reportes',
    icon: icons.reports,
    path: '/reportes',
    roles: ['admin', 'promotor'],
    children: [
      {
        id: 'clients-report',
        label: 'Reporte de Clientes',
        icon: icons.reportsList,
        path: '/reportes/clientes',
        roles: ['promotor']
      },
      {
        id: 'collections-report',
        label: 'Reporte de Cobranzas',
        icon: icons.reportsList,
        path: '/reports/collections',
        roles: ['promotor']
      },
      {
        id: 'policies-report',
        label: 'Reporte de Pólizas',
        icon: icons.reportsList,
        path: '/reportes/polizas',
        roles: ['promotor'],
        children: [
          {
            id: 'reports-list',
            label: 'Lista de Reportes',
            icon: icons.reportsList,
            path: '/reportes/lista',
            roles: ['promotor']
          }
        ]
      },
      {
        id: 'collections-report',
        label: 'Reporte de Cobranzas',
        icon: icons.reportsList,
        path: '/reportes/cobranzas',
        roles: ['promotor']
      }
    ]
  },
  {
    id: 'settings',
    label: 'Configuración',
    icon: icons.settings,
    path: '/settings',
    roles: ['admin'],
    children: [
      {
        id: 'users',
        label: 'Usuarios',
        icon: icons.users,
        path: '/configuracion/usuarios',
        roles: ['admin']
      },
      {
        id: 'agencies',
        label: 'Agencias',
        icon: icons.agencies,
        path: '/configuracion/agencias',
        roles: ['admin']
      },
      {
        id: 'promoters',
        label: 'Promotores',
        icon: icons.promoters,
        path: '/configuracion/promotores',
        roles: ['admin']
      }
    ]
  }
];
