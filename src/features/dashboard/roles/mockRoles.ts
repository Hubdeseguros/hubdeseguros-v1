export type Role = {
  id: string;
  name: string;
  permissions: string[];
};

export const mockRoles: Role[] = [
  {
    id: "1",
    name: "Administrador",
    permissions: ["usuarios", "agencias", "pólizas", "configuración"],
  },
  { id: "2", name: "Agente", permissions: ["pólizas"] },
  { id: "3", name: "Auditor", permissions: ["logs"] },
];

export const allPermissions = [
  "usuarios",
  "agencias",
  "agentes",
  "pólizas",
  "configuración",
  "logs",
  "apikeys",
];
