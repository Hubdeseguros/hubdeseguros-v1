// Datos ficticios para simular la base de datos de pólizas

export type Policy = {
  id: string
  number: string
  client: string
  type: string
  status: "Activa" | "Vencida"
}

export const mockPolicies: Policy[] = [
  {
    id: "1",
    number: "POL-0001",
    client: "Juan Pérez",
    type: "Auto",
    status: "Activa",
  },
  {
    id: "2",
    number: "POL-0002",
    client: "María García",
    type: "Vida",
    status: "Vencida",
  },
  {
    id: "3",
    number: "POL-0003",
    client: "Carlos Méndez",
    type: "Hogar",
    status: "Activa",
  },
] 