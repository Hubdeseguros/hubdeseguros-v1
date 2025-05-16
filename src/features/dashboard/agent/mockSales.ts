export interface Sale {
  id: number;
  cliente: string;
  poliza: string;
  monto: number;
  fecha: string;
  estado: "Pendiente" | "Pagada" | "Cancelada";
}

export const mockSales: Sale[] = [
  {
    id: 1,
    cliente: "Juan Pérez",
    poliza: "Auto",
    monto: 1200,
    fecha: "2024-06-01",
    estado: "Pagada",
  },
  {
    id: 2,
    cliente: "Ana Gómez",
    poliza: "Vida",
    monto: 800,
    fecha: "2024-06-03",
    estado: "Pendiente",
  },
  {
    id: 3,
    cliente: "Carlos Ruiz",
    poliza: "Hogar",
    monto: 500,
    fecha: "2024-06-05",
    estado: "Cancelada",
  },
];
