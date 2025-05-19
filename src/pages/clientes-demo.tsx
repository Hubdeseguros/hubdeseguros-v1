<<<<<<< HEAD

import React from "react";

// Mock de clientes demo
interface ClienteDemo {
  id: number;
  nombre: string;
  correo: string;
  fechaCreacion: Date | string;
  estado: string;
}

const clientesDemo: ClienteDemo[] = [
  {
    id: 1,
    nombre: "Juan Pérez",
    correo: "juan.perez@example.com",
    fechaCreacion: new Date("2024-01-10"),
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "Ana López",
    correo: "ana.lopez@example.com",
    fechaCreacion: "2023-11-24",
    estado: "Inactivo",
  },
  {
    id: 3,
    nombre: "Carlos Gómez",
    correo: "carlos.gomez@example.com",
    fechaCreacion: new Date("2024-04-02"),
    estado: "Activo",
  },
];

const formatFecha = (fecha: Date | string) => {
  if (typeof fecha === "string") return fecha;
  if (fecha instanceof Date && !isNaN(fecha.getTime())) {
    return fecha.toLocaleDateString();
  }
  return "";
};

const ClientesDemoPage: React.FC = () => (
  <div className="p-6 max-w-3xl mx-auto">
    <h1 className="text-2xl font-bold mb-6">Clientes Demo</h1>
    <table className="min-w-full border border-gray-200 rounded shadow bg-white">
      <thead className="bg-gray-50">
        <tr>
          <th className="py-2 px-3 border-b text-left">ID</th>
          <th className="py-2 px-3 border-b text-left">Nombre</th>
          <th className="py-2 px-3 border-b text-left">Correo</th>
          <th className="py-2 px-3 border-b text-left">Fecha de creación</th>
          <th className="py-2 px-3 border-b text-left">Estado</th>
        </tr>
      </thead>
      <tbody>
        {clientesDemo.map((cli) => (
          <tr key={cli.id} className="hover:bg-gray-100">
            <td className="py-2 px-3 border-b">{cli.id}</td>
            <td className="py-2 px-3 border-b">{cli.nombre}</td>
            <td className="py-2 px-3 border-b">{cli.correo}</td>
            <td className="py-2 px-3 border-b">{formatFecha(cli.fechaCreacion)}</td>
            <td className="py-2 px-3 border-b">{cli.estado}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="mt-4 text-gray-400 text-sm">
      Esta página es una demostración. Aquí puedes visualizar y adaptar la tabla con datos ficticios.
    </div>
  </div>
);

export default ClientesDemoPage;
=======
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarIcon, Filter, XCircle, MoreHorizontal, ArrowUpDown, UserPlus, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Interfaces
interface Cliente {
  id: string;
  nombres: string;
  apellidos: string;
  documento: string;
  fechaNacimiento?: Date;
  fechaConstitucion?: Date;
  celular: string;
  email: string;
  estadoCliente: 'Activo' | 'Inactivo' | 'Prospecto';
  usuarioCreado: string;
  recordatoriosPolizasCobros: string;
  sede: string;
  categorias: string[];
}

interface Contacto {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  tipoPoliza: 'Vida' | 'Salud' | 'Auto' | 'Hogar';
  clienteId: string;
}

interface ColumnConfig {
  id: keyof Cliente | keyof Contacto;
  label: string;
  visible: boolean;
  sortable?: boolean;
  isClient?: boolean;
}

// Data generation (demo)
const generarDatosEjemploClientes = (): Cliente[] => {
  const estados = ['Activo', 'Inactivo', 'Prospecto'] as const;
  const sedes = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla'];
  const categoriasPosibles = ['VIP', 'Cliente Regular', 'Nuevo', 'Corporativo'];
  const clientes: Cliente[] = [];

  for (let i = 1; i <= 50; i++) {
    const tipoPersona = Math.random() < 0.7;
    const cliente: Cliente = {
      id: `cliente-${i}`,
      nombres: tipoPersona ? `Nombre${i}` : `Empresa ${i}`,
      apellidos: tipoPersona ? `Apellido${i}` : '',
      documento: tipoPersona ? `${Math.floor(Math.random() * 1000000000)}` : `NIT ${Math.floor(Math.random() * 10000000000)}`,
      fechaNacimiento: tipoPersona ? new Date(1950 + Math.floor(Math.random() * 50), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)) : undefined,
      fechaConstitucion: !tipoPersona ? new Date(2000 + Math.floor(Math.random() * 20), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)) : undefined,
      celular: `3${Math.floor(Math.random() * 1000000000)}`,
      email: `email${i}@example.com`,
      estadoCliente: estados[Math.floor(Math.random() * estados.length)],
      usuarioCreado: `usuario${Math.floor(Math.random() * 10)}`,
      recordatoriosPolizasCobros: `${Math.floor(Math.random() * 5)} pólizas, ${Math.floor(Math.random() * 3)} cobros`,
      sede: sedes[Math.floor(Math.random() * sedes.length)],
      categorias: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => categoriasPosibles[Math.floor(Math.random() * categoriasPosibles.length)]),
    };
    clientes.push(cliente);
  }
  return clientes;
};

const generarDatosEjemploContactos = (): Contacto[] => {
  const tiposPoliza = ['Vida', 'Salud', 'Auto', 'Hogar'];
  const contactos: Contacto[] = [];
  for (let i = 1; i <= 50; i++) {
    contactos.push({
      id: `contacto-${i}`,
      nombre: `Contacto${i}`,
      apellido: `Apellido${i}`,
      telefono: `3${Math.floor(Math.random() * 1000000000)}`,
      email: `contacto${i}@example.com`,
      tipoPoliza: tiposPoliza[Math.floor(Math.random() * tiposPoliza.length)] as Contacto["tipoPoliza"],
      clienteId: `cliente-${Math.floor(Math.random() * 50) + 1}`,
    });
  }
  return contactos;
};

// ----- COMPONENT -----
const VistaClientes: React.FC = () => {
  // State initializations and utility functions (almost exactly as in your code)
  const [clientes, setClientes] = useState<Cliente[]>(generarDatosEjemploClientes());
  const [contactos, setContactos] = useState<Contacto[]>(generarDatosEjemploContactos());
  const [selectedClientes, setSelectedClientes] = useState<string[]>([]);
  const [selectedContactos, setSelectedContactos] = useState<string[]>([]);
  const [columnConfigClientes, setColumnConfigClientes] = useState<ColumnConfig[]>([
    { id: 'nombres', label: 'Nombres / Razón social', visible: true, sortable: true, isClient: true },
    { id: 'apellidos', label: 'Apellidos', visible: true, sortable: true, isClient: true },
    { id: 'documento', label: 'N. documento / NIT', visible: true, isClient: true },
    { id: 'fechaNacimiento', label: 'F. nacimiento', visible: true, sortable: true, isClient: true },
    { id: 'fechaConstitucion', label: 'F. constitución', visible: true, sortable: true, isClient: true },
    { id: 'celular', label: 'Celular', visible: true, isClient: true },
    { id: 'email', label: 'Email', visible: true, isClient: true },
    { id: 'estadoCliente', label: 'Estado cliente', visible: true, sortable: true, isClient: true },
    { id: 'usuarioCreado', label: 'Usuario creado', visible: true, sortable: true, isClient: true },
    { id: 'recordatoriosPolizasCobros', label: 'Recordatorios – Pólizas / Cobros', visible: true, isClient: true },
    { id: 'sede', label: 'Sede', visible: true, sortable: true, isClient: true },
    { id: 'categorias', label: 'Categorías', visible: true, isClient: true },
  ]);
  const [columnConfigContactos, setColumnConfigContactos] = useState<ColumnConfig[]>([
    { id: 'nombre', label: 'Nombre', visible: true, sortable: true, isClient: false },
    { id: 'apellido', label: 'Apellido', visible: true, sortable: true, isClient: false },
    { id: 'telefono', label: 'Teléfono', visible: true, isClient: false },
    { id: 'email', label: 'Email', visible: true, sortable: true, isClient: false },
    { id: 'tipoPoliza', label: 'Tipo de Póliza', visible: true, sortable: true, isClient: false },
  ]);

  const [isColumnSheetOpen, setIsColumnSheetOpen] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: any }>({});
  const [sortConfig, setSortConfig] = useState<{ key: keyof Cliente | keyof Contacto; direction: 'asc' | 'desc' } | null>(null);
  const [activeTab, setActiveTab] = useState('clientes');

  const toggleClienteSelection = (clienteId: string) => {
    setSelectedClientes((prevSelected) =>
      prevSelected.includes(clienteId)
        ? prevSelected.filter((id) => id !== clienteId)
        : [...prevSelected, clienteId]
    );
  };

  const toggleContactoSelection = (contactoId: string) => {
    setSelectedContactos((prevSelected) =>
      prevSelected.includes(contactoId)
        ? prevSelected.filter((id) => id !== contactoId)
        : [...prevSelected, contactoId]
    );
  };

  const isClienteSelected = (clienteId: string) => {
    return selectedClientes.includes(clienteId);
  };

  const isContactoSelected = (contactoId: string) => {
    return selectedContactos.includes(contactoId);
  };

  const handleSelectAllClientes = (checked: boolean) => {
    if (checked) {
      const clienteIds = clientes.map((cliente) => cliente.id);
      setSelectedClientes(clienteIds);
    } else {
      setSelectedClientes([]);
    }
  };

  const handleSelectAllContactos = (checked: boolean) => {
    if (checked) {
      const contactoIds = contactos.map((contacto) => contacto.id);
      setSelectedContactos(contactoIds);
    } else {
      setSelectedContactos([]);
    }
  };

  const isAllClientesSelected = () => {
    return clientes.length > 0 && selectedClientes.length === clientes.length;
  };

  const isAllContactosSelected = () => {
    return contactos.length > 0 && selectedContactos.length === contactos.length;
  };

  const handleColumnToggle = (columnId: keyof Cliente | keyof Contacto, isClient: boolean) => {
    if (isClient) {
      setColumnConfigClientes((prevConfig) =>
        prevConfig.map((col) =>
          col.id === columnId ? { ...col, visible: !col.visible } : col
        )
      );
    } else {
      setColumnConfigContactos((prevConfig) =>
        prevConfig.map((col) =>
          col.id === columnId ? { ...col, visible: !col.visible } : col
        )
      );
    }
  };

  const handleColumnReset = (isClient: boolean) => {
    if (isClient) {
      setColumnConfigClientes([
        { id: 'nombres', label: 'Nombres / Razón social', visible: true, sortable: true, isClient: true },
        { id: 'apellidos', label: 'Apellidos', visible: true, sortable: true, isClient: true },
        { id: 'documento', label: 'N. documento / NIT', visible: true, isClient: true },
        { id: 'fechaNacimiento', label: 'F. nacimiento', visible: true, sortable: true, isClient: true },
        { id: 'fechaConstitucion', label: 'F. constitución', visible: true, sortable: true, isClient: true },
        { id: 'celular', label: 'Celular', visible: true, isClient: true },
        { id: 'email', label: 'Email', visible: true, isClient: true },
        { id: 'estadoCliente', label: 'Estado cliente', visible: true, sortable: true, isClient: true },
        { id: 'usuarioCreado', label: 'Usuario creado', visible: true, sortable: true, isClient: true },
        { id: 'recordatoriosPolizasCobros', label: 'Recordatorios – Pólizas / Cobros', visible: true, isClient: true },
        { id: 'sede', label: 'Sede', visible: true, sortable: true, isClient: true },
        { id: 'categorias', label: 'Categorías', visible: true, isClient: true },
      ]);
    } else {
      setColumnConfigContactos([
        { id: 'nombre', label: 'Nombre', visible: true, sortable: true, isClient: false },
        { id: 'apellido', label: 'Apellido', visible: true, sortable: true, isClient: false },
        { id: 'telefono', label: 'Teléfono', visible: true, isClient: false },
        { id: 'email', label: 'Email', visible: true, sortable: true, isClient: false },
        { id: 'tipoPoliza', label: 'Tipo de Póliza', visible: true, sortable: true, isClient: false },
      ]);
    }
  };

  const handleFilterChange = (filterName: string, value: any) => {
    setSelectedFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({});
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const requestSort = (key: keyof Cliente | keyof Contacto) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Cliente | keyof Contacto) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortConfig.direction === 'asc'
      ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="ml-2 h-4 w-4">
          <path fillRule="evenodd" d="M9.293 6.707a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 8.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4z" clipRule="evenodd" />
        </svg>
      : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="ml-2 h-4 w-4">
          <path fillRule="evenodd" d="M10.707 13.293a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L10 11.586l3.293-3.293a1 1 0 011.414 1.414l-4 4z" clipRule="evenodd" />
        </svg>;
  };

  const filteredClientes = clientes.filter(cliente => {
    let matchesSearch = true;
    let matchesFilters = true;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      matchesSearch =
        cliente.nombres.toLowerCase().includes(query) ||
        (cliente.apellidos && cliente.apellidos.toLowerCase().includes(query)) ||
        cliente.documento.toLowerCase().includes(query) ||
        cliente.email.toLowerCase().includes(query) ||
        cliente.sede.toLowerCase().includes(query);
    }

    for (const key in selectedFilters) {
      const filterValue = selectedFilters[key];

      if (filterValue !== undefined && filterValue !== null && filterValue !== '') {
        switch (key) {
          case 'categoria':
            matchesFilters = matchesFilters && cliente.categorias.includes(filterValue);
            break;
          case 'fechaCreacion':
            const fechaCreacionCliente = new Date();
            if (filterValue.from) {
              matchesFilters = matchesFilters && fechaCreacionCliente >= filterValue.from;
            }
            if (filterValue.to) {
              matchesFilters = matchesFilters && fechaCreacionCliente <= filterValue.to;
            }
            break;
          case 'fechaNacimiento':
            if (cliente.fechaNacimiento) {
              if (filterValue.from) {
                matchesFilters = matchesFilters && cliente.fechaNacimiento >= filterValue.from;
              }
              if (filterValue.to) {
                matchesFilters = matchesFilters && cliente.fechaNacimiento <= filterValue.to;
              }
            } else {
              matchesFilters = false;
            }
            break;
          case 'estadoCliente':
            matchesFilters = matchesFilters && cliente.estadoCliente === filterValue;
            break;
          case 'sede':
            matchesFilters = matchesFilters && cliente.sede === filterValue;
            break;
        }
      }
    }
    return matchesSearch && matchesFilters;
  });

  const filteredContactos = contactos.filter(contacto => {
    let matchesSearch = true;
    let matchesFilters = true;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      matchesSearch =
        contacto.nombre.toLowerCase().includes(query) ||
        (contacto.apellido && contacto.apellido.toLowerCase().includes(query)) ||
        contacto.email.toLowerCase().includes(query);
    }

    for (const key in selectedFilters) {
      const filterValue = selectedFilters[key];

      if (filterValue !== undefined && filterValue !== null && filterValue !== '') {
        switch (key) {
          case 'tipoPoliza':
            matchesFilters = matchesFilters && contacto.tipoPoliza === filterValue;
            break;
        }
      }
    }
    return matchesSearch && matchesFilters;
  });

  const sortedClientes = useMemo(() => {
    let sortableItems = [...filteredClientes];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredClientes, sortConfig]);

  const sortedContactos = useMemo(() => {
    let sortableItems = [...filteredContactos];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredContactos, sortConfig]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClientes = sortedClientes.slice(indexOfFirstItem, indexOfLastItem);
  const currentContactos = sortedContactos.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
          <Users className="text-primary" /> Gestión de Clientes y Contactos
        </h1>
        <p className="text-gray-600">Administra tus clientes y contactos de manera eficiente, usando filtros y columnas personalizables.</p>
      </div>
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Crear {activeTab === 'clientes' ? 'Cliente' : 'Contacto'}
        </Button>
        <Input
          type="text"
          placeholder={`Buscar ${activeTab}...`}
          className="w-64"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filtros
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-sm">
            <SheetHeader>
              <SheetTitle>Filtros Avanzados</SheetTitle>
              <SheetDescription>
                Filtrar {activeTab} por diferentes criterios.
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-4 py-4">
              {activeTab === 'clientes' && (
                <>
                  <div>
                    <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
                    <Select onValueChange={(value) => handleFilterChange('categoria', value)} value={selectedFilters.categoria}>
                      <SelectTrigger id="categoria" className="w-full">
                        <SelectValue placeholder="Seleccione una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VIP">VIP</SelectItem>
                        <SelectItem value="Cliente Regular">Cliente Regular</SelectItem>
                        <SelectItem value="Nuevo">Nuevo</SelectItem>
                        <SelectItem value="Corporativo">Corporativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de Creación</label>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !selectedFilters.fechaCreacion?.from && "text-muted-foreground"
                            )}
                          >
                            {selectedFilters.fechaCreacion?.from ? (
                              format(selectedFilters.fechaCreacion.from, "PPP", { locale: es })
                            ) : (
                              <span>Desde</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedFilters.fechaCreacion?.from}
                            onSelect={(date) => handleFilterChange('fechaCreacion', { ...selectedFilters.fechaCreacion, from: date })}
                            initialFocus
                            locale={es}
                          />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !selectedFilters.fechaCreacion?.to && "text-muted-foreground"
                            )}
                          >
                            {selectedFilters.fechaCreacion?.to ? (
                              format(selectedFilters.fechaCreacion.to, "PPP", { locale: es })
                            ) : (
                              <span>Hasta</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedFilters.fechaCreacion?.to}
                            onSelect={(date) => handleFilterChange('fechaCreacion', { ...selectedFilters.fechaCreacion, to: date })}
                            locale={es}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !selectedFilters.fechaNacimiento?.from && "text-muted-foreground"
                            )}
                          >
                            {selectedFilters.fechaNacimiento?.from ? (
                              format(selectedFilters.fechaNacimiento.from, "PPP", { locale: es })
                            ) : (
                              <span>Desde</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedFilters.fechaNacimiento?.from}
                            onSelect={(date) => handleFilterChange('fechaNacimiento', { ...selectedFilters.fechaNacimiento, from: date })}
                            initialFocus
                            locale={es}
                          />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !selectedFilters.fechaNacimiento?.to && "text-muted-foreground"
                            )}
                          >
                            {selectedFilters.fechaNacimiento?.to ? (
                              format(selectedFilters.fechaNacimiento.to, "PPP", { locale: es })
                            ) : (
                              <span>Hasta</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedFilters.fechaNacimiento?.to}
                            onSelect={(date) => handleFilterChange('fechaNacimiento', { ...selectedFilters.fechaNacimiento, to: date })}
                            locale={es}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="estadoCliente" className="block text-sm font-medium text-gray-700">Estado Cliente</label>
                    <Select onValueChange={(value) => handleFilterChange('estadoCliente', value)} value={selectedFilters.estadoCliente}>
                      <SelectTrigger id="estadoCliente" className="w-full">
                        <SelectValue placeholder="Seleccione un estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Activo">Activo</SelectItem>
                        <SelectItem value="Inactivo">Inactivo</SelectItem>
                        <SelectItem value="Prospecto">Prospecto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label htmlFor="sede" className="block text-sm font-medium text-gray-700">Sede</label>
                    <Select onValueChange={(value) => handleFilterChange('sede', value)} value={selectedFilters.sede}>
                      <SelectTrigger id="sede" className="w-full">
                        <SelectValue placeholder="Seleccione una sede" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bogotá">Bogotá</SelectItem>
                        <SelectItem value="Medellín">Medellín</SelectItem>
                        <SelectItem value="Cali">Cali</SelectItem>
                        <SelectItem value="Barranquilla">Barranquilla</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              {activeTab === 'contactos' && (
                <div>
                  <label htmlFor="tipoPoliza" className="block text-sm font-medium text-gray-700">Tipo de Póliza</label>
                  <Select onValueChange={(value) => handleFilterChange('tipoPoliza', value)} value={selectedFilters.tipoPoliza}>
                    <SelectTrigger id="tipoPoliza" className="w-full">
                      <SelectValue placeholder="Seleccione un tipo de póliza" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vida">Vida</SelectItem>
                      <SelectItem value="Salud">Salud</SelectItem>
                      <SelectItem value="Auto">Auto</SelectItem>
                      <SelectItem value="Hogar">Hogar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <SheetFooter className="justify-between">
              <Button variant="outline" onClick={clearFilters}>
                <XCircle className="mr-2 h-4 w-4" />
                Limpiar
              </Button>
              <Button onClick={() => setFilterSheetOpen(false)}>Buscar</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        <Sheet open={isColumnSheetOpen} onOpenChange={setIsColumnSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline">Gestionar Columnas</Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-sm">
            <SheetHeader>
              <SheetTitle>Gestionar Columnas</SheetTitle>
              <SheetDescription>
                Seleccione las columnas que desea ver en la tabla.
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-2 py-4">
              {(activeTab === 'clientes' ? columnConfigClientes : columnConfigContactos).map((column) => (
                <div key={column.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={column.id.toString()}
                    checked={column.visible}
                    onCheckedChange={() => handleColumnToggle(column.id, column.isClient)}
                  />
                  <label
                    htmlFor={column.id.toString()}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {column.label}
                  </label>
                </div>
              ))}
            </div>
            <SheetFooter className="justify-between">
              <Button variant="outline" onClick={() => handleColumnReset(activeTab === 'clientes')}>Restablecer</Button>
              <Button onClick={() => setIsColumnSheetOpen(false)}>Guardar</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={activeTab === 'clientes' ? selectedClientes.length === 0 : selectedContactos.length === 0}>
              Eliminar {activeTab === 'clientes'
                ? (selectedClientes.length > 1 ? 'Clientes' : 'Cliente')
                : (selectedContactos.length > 1 ? 'Contactos' : 'Contacto')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer.  ¿Deseas eliminar los {activeTab === 'clientes'
                    ? (selectedClientes.length > 1 ? 'clientes seleccionados' : 'cliente seleccionado')
                    : (selectedContactos.length > 1 ? 'contactos seleccionados' : 'contacto seleccionado')}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                    if (activeTab === 'clientes') {
                        setClientes(prevClientes => prevClientes.filter(c => !selectedClientes.includes(c.id)));
                        setSelectedClientes([]);
                    } else {
                        setContactos(prevContactos => prevContactos.filter(c => !selectedContactos.includes(c.id)));
                        setSelectedContactos([]);
                    }
                }}>Eliminar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Tabs defaultValue="clientes" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="contactos">Contactos</TabsTrigger>
        </TabsList>
        <TabsContent value="clientes">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={isAllClientesSelected()}
                      onCheckedChange={(checked) => handleSelectAllClientes(!!checked)}
                    />
                  </TableHead>
                  {columnConfigClientes
                    .filter((col) => col.visible)
                    .map((column) => (
                      <TableHead key={column.id} className="whitespace-nowrap">
                        <div className="flex items-center">
                          {column.label}
                          {column.sortable && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => requestSort(column.id)}
                            >
                              {getSortIcon(column.id)}
                            </Button>
                          )}
                        </div>
                      </TableHead>
                    ))}
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentClientes.length > 0 ? (
                  currentClientes.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell>
                        <Checkbox
                          checked={isClienteSelected(cliente.id)}
                          onCheckedChange={() => toggleClienteSelection(cliente.id)}
                        />
                      </TableCell>
                      {columnConfigClientes
                        .filter((col) => col.visible)
                        .map((column) => (
                          <TableCell key={`${cliente.id}-${column.id}`} className="whitespace-nowrap">
                            {column.id === 'fechaNacimiento' && cliente.fechaNacimiento
                              ? format(cliente.fechaNacimiento, 'dd/MM/yyyy', { locale: es })
                              : column.id === 'fechaConstitucion' && cliente.fechaConstitucion
                              ? format(cliente.fechaConstitucion, 'dd/MM/yyyy', { locale: es })
                              : column.id === 'categorias'
                              ? cliente.categorias.join(', ')
                              : cliente[column.id as keyof Cliente]}
                          </TableCell>
                        ))}
                      <TableCell className="text-right">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent align="end" className="w-[180px]">
                            <div className="grid gap-2">
                              <Button variant="ghost" className="justify-start">
                                Ver Detalles
                              </Button>
                              <Button variant="ghost" className="justify-start">
                                Editar
                              </Button>
                              <Button variant="ghost" className="justify-start">
                                Eliminar
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columnConfigClientes.filter(c => c.visible).length + 2} className="text-center">
                      <div className="py-4">
                        <Users className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                        <p className="text-gray-500">No hay clientes para mostrar.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {sortedClientes.length > itemsPerPage && (
            <div className="flex items-center justify-center mt-4">
              {Array.from({ length: Math.ceil(sortedClientes.length / itemsPerPage) }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  className="mx-1"
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="contactos">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={isAllContactosSelected()}
                      onCheckedChange={(checked) => handleSelectAllContactos(!!checked)}
                    />
                  </TableHead>
                  {columnConfigContactos
                    .filter((col) => col.visible)
                    .map((column) => (
                      <TableHead key={column.id} className="whitespace-nowrap">
                        <div className="flex items-center">
                          {column.label}
                          {column.sortable && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => requestSort(column.id)}
                            >
                              {getSortIcon(column.id)}
                            </Button>
                          )}
                        </div>
                      </TableHead>
                    ))}
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentContactos.length > 0 ? (
                  currentContactos.map((contacto) => (
                    <TableRow key={contacto.id}>
                      <TableCell>
                        <Checkbox
                          checked={isContactoSelected(contacto.id)}
                          onCheckedChange={() => toggleContactoSelection(contacto.id)}
                        />
                      </TableCell>
                      {columnConfigContactos
                        .filter((col) => col.visible)
                        .map((column) => (
                          <TableCell key={`${contacto.id}-${column.id}`} className="whitespace-nowrap">
                            {contacto[column.id as keyof Contacto]}
                          </TableCell>
                        ))}
                      <TableCell className="text-right">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent align="end" className="w-[180px]">
                            <div className="grid gap-2">
                              <Button variant="ghost" className="justify-start">
                                Ver Detalles
                              </Button>
                              <Button variant="ghost" className="justify-start">
                                Editar
                              </Button>
                              <Button variant="ghost" className="justify-start">
                                Eliminar
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columnConfigContactos.filter(c => c.visible).length + 2} className="text-center">
                      <div className="py-4">
                        <Users className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                        <p className="text-gray-500">No hay contactos para mostrar.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {sortedContactos.length > itemsPerPage && (
            <div className="flex items-center justify-center mt-4">
              {Array.from({ length: Math.ceil(sortedContactos.length / itemsPerPage) }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  className="mx-1"
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VistaClientes;
>>>>>>> parent of 4dd9338 (refactor: eliminar archivo clientes-demo.tsx y mejorar estructura del componente)
