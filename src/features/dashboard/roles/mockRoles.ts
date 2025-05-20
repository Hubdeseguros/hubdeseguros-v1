export type Role = {
  id: string
  name: string
  permissions: string[]
}

export const mockRoles: Role[] = [
  { id: "1", name: "Administrador", permissions: ["usuarios", "agencias", "agentes", "pólizas", "configuración", "logs", "apikeys"] },
  { id: "2", name: "Cliente", permissions: ["pólizas"] },
  { id: "3", name: "Promotor", permissions: ["pólizas", "remisiones", "cobros", "informes"] },
  { id: "4", name: "Agencia", permissions: ["usuarios", "agentes", "pólizas", "remisiones", "cobros", "informes", "configuración"] }
]

export const allPermissions = [
  "usuarios",
  "agencias",
  "agentes",
  "pólizas",
  "remisiones",
  "cobros",
  "informes",
  "configuración",
  "logs",
  "apikeys",
]