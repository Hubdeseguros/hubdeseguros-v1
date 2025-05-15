export type Log = {
  id: string
  user: string
  action: string
  date: string
  result: string
}

export const mockLogs: Log[] = [
  { id: "1", user: "admin", action: "Login", date: "2024-06-01 10:00", result: "Éxito" },
  { id: "2", user: "agente1", action: "Creó póliza", date: "2024-06-01 11:00", result: "Éxito" },
  { id: "3", user: "admin", action: "Eliminó usuario", date: "2024-06-01 12:00", result: "Error" },
] 