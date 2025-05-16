import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Eye, Edit, Filter, DollarSign } from "lucide-react";

interface Sale {
  id: string;
  number: string;
  client: string;
  agent: string;
  product: string;
  date: string;
  status: "pending" | "completed" | "canceled";
  amount: number;
  commission: number;
}

const mockSales: Sale[] = [
  {
    id: "1",
    number: "VEN-2025-0001",
    client: "Juan Pérez",
    agent: "Carlos Mendoza",
    product: "Seguro de Auto",
    date: "2025-05-10",
    status: "completed",
    amount: 1250.5,
    commission: 125.05,
  },
  {
    id: "2",
    number: "VEN-2025-0002",
    client: "María López",
    agent: "Ana Gómez",
    product: "Seguro de Vida",
    date: "2025-05-08",
    status: "completed",
    amount: 350.0,
    commission: 35.0,
  },
  {
    id: "3",
    number: "VEN-2025-0003",
    client: "Carlos Rodríguez",
    agent: "Luis Ramírez",
    product: "Seguro de Hogar",
    date: "2025-05-05",
    status: "pending",
    amount: 520.75,
    commission: 52.08,
  },
  {
    id: "4",
    number: "VEN-2025-0004",
    client: "Ana Martínez",
    agent: "Carlos Mendoza",
    product: "Seguro de Salud",
    date: "2025-05-03",
    status: "completed",
    amount: 980.25,
    commission: 98.03,
  },
  {
    id: "5",
    number: "VEN-2025-0005",
    client: "Roberto Gómez",
    agent: "Ana Gómez",
    product: "Seguro de Auto",
    date: "2025-05-01",
    status: "canceled",
    amount: 1450.0,
    commission: 0.0,
  },
  {
    id: "6",
    number: "VEN-2025-0006",
    client: "Laura Sánchez",
    agent: "Luis Ramírez",
    product: "Seguro de Viaje",
    date: "2025-04-28",
    status: "completed",
    amount: 245.5,
    commission: 24.55,
  },
  {
    id: "7",
    number: "VEN-2025-0007",
    client: "Miguel Torres",
    agent: "Carlos Mendoza",
    product: "Seguro de Responsabilidad Civil",
    date: "2025-04-25",
    status: "pending",
    amount: 780.25,
    commission: 78.03,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "warning";
    case "completed":
      return "default";
    case "canceled":
      return "destructive";
    default:
      return "outline";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "Pendiente";
    case "completed":
      return "Completada";
    case "canceled":
      return "Cancelada";
    default:
      return status;
  }
};

export const SalesTable: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-bold">Ventas</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Filtrar
              </span>
            </Button>
            <Button size="sm" className="h-8 gap-1">
              <Plus className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Nueva Venta
              </span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Agente</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Comisión</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSales
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">
                        {sale.number}
                      </TableCell>
                      <TableCell>{sale.client}</TableCell>
                      <TableCell>{sale.agent}</TableCell>
                      <TableCell>{sale.product}</TableCell>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(sale.status) as any}>
                          {getStatusLabel(sale.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>${sale.amount.toFixed(2)}</TableCell>
                      <TableCell>${sale.commission.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Editar">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Procesar pago"
                          >
                            <DollarSign className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Mostrando {page * rowsPerPage + 1}-
              {Math.min((page + 1) * rowsPerPage, mockSales.length)} de{" "}
              {mockSales.length} ventas
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={(page + 1) * rowsPerPage >= mockSales.length}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesTable;
