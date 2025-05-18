import React, { useState, useEffect, useCallback } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ArrowDown, ArrowUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from 'react-router-dom';

// Define una interfaz para los datos de los clientes
interface ClientData {
  id: string;
  nombres: string;
  apellidos: string;
  documento: string;
  fechaNacimiento: string;
  fechaConstitucion: string;
  celular: string;
  email: string;
  estadoCliente: string;
  usuarioCreado: string;
  recordatoriosPolizasCobros: string;
  sede: string;
  categorias: string;
}

const CRMClientes = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Estado para los datos de los clientes (inicialmente vacío)
  const [data, setData] = useState<ClientData[]>([]);
  // Estado para la configuración de las columnas
  const [columnVisibility, setColumnVisibility] = useState({});
  // Estado para la paginación
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  // Estado para la ordenación
  const [sorting, setSorting] = useState<SortingState>([]);
  // Estado para los filtros de columna
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Simulación de datos de clientes (reemplazar con datos reales)
  useEffect(() => {
    // Simulación de una llamada a la API para obtener datos de clientes
    const mockData: ClientData[] = [
      {
        id: "1",
        nombres: "Juan",
        apellidos: "Pérez",
        documento: "123456789",
        fechaNacimiento: "1990-01-01",
        fechaConstitucion: "",
        celular: "3001234567",
        email: "juan.perez@example.com",
        estadoCliente: "Activo",
        usuarioCreado: "admin",
        recordatoriosPolizasCobros: "Sí",
        sede: "Bogotá",
        categorias: "A",
      },
      {
        id: "2",
        nombres: "María",
        apellidos: "Gómez",
        documento: "987654321",
        fechaNacimiento: "",
        fechaConstitucion: "2015-05-10",
        celular: "3109876543",
        email: "maria.gomez@example.com",
        estadoCliente: "Inactivo",
        usuarioCreado: "admin",
        recordatoriosPolizasCobros: "No",
        sede: "Medellín",
        categorias: "B",
      },
      {
        id: "3",
        nombres: "Carlos",
        apellidos: "Rodríguez",
        documento: "456789123",
        fechaNacimiento: "1985-11-20",
        fechaConstitucion: "",
        celular: "3204567891",
        email: "carlos.rodriguez@example.com",
        estadoCliente: "Activo",
        usuarioCreado: "admin",
        recordatoriosPolizasCobros: "Sí",
        sede: "Cali",
        categorias: "A",
      },
    ];

    setData(mockData);
  }, []);

  // Definición de las columnas de la tabla
  const columns: ColumnDef<ClientData>[] = [
    {
      accessorKey: "nombres",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Nombres
            <ArrowDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "apellidos",
      header: "Apellidos",
    },
    {
      accessorKey: "documento",
      header: "Documento",
    },
    {
      accessorKey: "fechaNacimiento",
      header: "Fecha de Nacimiento",
    },
    {
      accessorKey: "fechaConstitucion",
      header: "Fecha de Constitución",
    },
    {
      accessorKey: "celular",
      header: "Celular",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "estadoCliente",
      header: "Estado del Cliente",
    },
    {
      accessorKey: "usuarioCreado",
      header: "Usuario Creado",
    },
    {
      accessorKey: "recordatoriosPolizasCobros",
      header: "Recordatorios",
    },
    {
      accessorKey: "sede",
      header: "Sede",
    },
    {
      accessorKey: "categorias",
      header: "Categorías",
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const client = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(client.email)}
              >
                Copy email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View</DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ];

  // Creación de la instancia de la tabla
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      columnVisibility,
      pagination,
      sorting,
      columnFilters,
    },
    onPaginationChange: setPagination,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
  });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar clientes..."
          value={(table.getColumn("nombres")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("nombres")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columnas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuItem
                    key={column.id}
                    className="flex items-center space-x-2"
                    onSelect={() => column.toggleVisibility()}
                  >
                    <Checkbox
                      checked={column.getIsVisible()}
                    />
                    <span>
                      {column.id}
                    </span>
                  </DropdownMenuItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ScrollArea>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="flex items-center justify-between space-x-2 py-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} of {table.getCoreRowModel().rows.length} row(s)
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CRMClientes;
