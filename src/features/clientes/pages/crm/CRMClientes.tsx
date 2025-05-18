import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus, Users, AlertTriangle, TrendingUp, Search, Filter, Plus, ChevronDown,
  Edit, Trash2, Eye, FileText, Calendar, Download, Upload, SlidersHorizontal,
  ArrowUpDown, ChevronUp, ChevronRight, X, Filter as FilterIcon,
  MessageSquare, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

// Tipos y constantes
type EstadoCliente = 'Activo' | 'Inactivo' | 'Prospecto';
type TipoDocumento = 'CC' | 'CE' | 'NIT' | 'PAS' | 'OTRO';
type TipoPoliza = 'Vida' | 'Salud' | 'Auto' | 'Hogar' | 'Todo Riesgo' | 'Empresarial' | 'Educación' | 'Decesos';
type Ordenamiento = 'asc' | 'desc';
type CampoOrdenamiento = 'nombre' | 'fechaRegistro' | 'estado' | 'tipoPoliza';

// Interfaces para los tipos de datos
interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion?: string;
  ciudad?: string;
  departamento?: string;
  estado: EstadoCliente;
  tipoDocumento: TipoDocumento;
  documento: string;
  fechaNacimiento?: Date;
  fechaRegistro: Date;
  ultimaCompra?: Date;
  vendedor?: string;
  canalVenta?: 'Web' | 'Presencial' | 'Telefónico' | 'Correo' | 'Redes Sociales';
  ingresosMensuales?: number;
  profesion?: string;
  notas?: string;
  contactoPreferido?: 'email' | 'telefono' | 'whatsapp';
  aceptaMensajes: boolean;
}

interface Contacto {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion?: string;
  parentesco?: string;
  tipoPoliza: TipoPoliza;
  clienteId: string;
  fechaContacto: Date;
  proximoSeguimiento?: Date;
  estadoSeguimiento?: 'Nuevo' | 'Contactado' | 'Cotizado' | 'Ganado' | 'Perdido';
  probabilidadCierre?: number;
  montoPrima?: number;
  notas?: string;
  vendedorAsignado?: string;
}

interface FiltrosClientes {
  busqueda: string;
  estado: EstadoCliente | 'Todos';
  tipoDocumento: TipoDocumento | 'Todos';
  ciudad: string;
  canalVenta: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  vendedor: string;
  rangoIngresos: [number, number];
  tienePoliza: boolean;
}

interface OrdenamientoCliente {
  campo: CampoOrdenamiento;
  direccion: Ordenamiento;
}

const TIPOS_DOCUMENTO: { value: TipoDocumento; label: string }[] = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'NIT', label: 'NIT' },
  { value: 'PAS', label: 'Pasaporte' },
  { value: 'OTRO', label: 'Otro' },
];

const TIPOS_POLIZA: TipoPoliza[] = [
  'Vida', 'Salud', 'Auto', 'Hogar', 'Todo Riesgo', 'Empresarial', 'Educación', 'Decesos'
];

const CANALES_VENTA = [
  'Web', 'Presencial', 'Telefónico', 'Correo', 'Redes Sociales'
];

const ESTADOS_CLIENTE: EstadoCliente[] = ['Activo', 'Inactivo', 'Prospecto'];

const RANGOS_INGRESOS = [
  { label: 'Menos de $1M', value: [0, 1000000] },
  { label: '$1M - $3M', value: [1000000, 3000000] },
  { label: '$3M - $5M', value: [3000000, 5000000] },
  { label: 'Más de $5M', value: [5000000, 10000000] },
];

// Componente para mostrar los filtros activos
const FiltrosActivos = ({ 
  filtros, 
  onRemoveFilter 
}: { 
  filtros: Record<string, any>; 
  onRemoveFilter: (key: string) => void 
}) => {
  const filtrosActivos = Object.entries(filtros).filter(([_, value]) => 
    value !== undefined && value !== '' && value !== 'Todos' && !(Array.isArray(value) && value.length === 0)
  );

  if (filtrosActivos.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filtrosActivos.map(([key, value]) => {
        let label = value;
        
        if (key === 'fechaInicio' || key === 'fechaFin') {
          label = format(new Date(value), 'PPP', { locale: es });
        } else if (key === 'rangoIngresos') {
          const [min, max] = value;
          label = `$${min.toLocaleString()} - $${max.toLocaleString()}`;
        } else if (Array.isArray(value)) {
          label = value.join(', ');
        }

        return (
          <Badge 
            key={key} 
            variant="outline" 
            className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200"
          >
            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}: {label}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 text-blue-700 hover:bg-blue-100"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFilter(key);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        );
      })}
    </div>
  );
};

// Componente para el selector de fechas
const SelectorFechas = ({
  date,
  onSelect,
  placeholder = "Seleccionar fecha",
  disabled = false
}: {
  date?: Date;
  onSelect: (date?: Date) => void;
  placeholder?: string;
  disabled?: boolean;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP', { locale: es }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={onSelect}
          initialFocus
          locale={es}
        />
      </PopoverContent>
    </Popover>
  );
};

// Componente para el rango de fechas
const RangoFechas = ({
  fechaInicio,
  fechaFin,
  onFechaInicioChange,
  onFechaFinChange,
}: {
  fechaInicio?: Date;
  fechaFin?: Date;
  onFechaInicioChange: (date?: Date) => void;
  onFechaFinChange: (date?: Date) => void;
}) => {
  return (
    <div className="grid gap-2">
      <div>
        <label className="text-sm font-medium mb-1 block">Fecha de inicio</label>
        <SelectorFechas
          date={fechaInicio}
          onSelect={onFechaInicioChange}
          placeholder="Seleccionar fecha de inicio"
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Fecha de fin</label>
        <SelectorFechas
          date={fechaFin}
          onSelect={onFechaFinChange}
          placeholder="Seleccionar fecha de fin"
          disabled={!fechaInicio}
        />
      </div>
    </div>
  );
};

// Componente para el rango de ingresos
const RangoIngresos = ({
  value,
  onChange,
}: {
  value: [number, number];
  onChange: (value: [number, number]) => void;
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-sm font-medium mb-1 block">Mínimo</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-muted-foreground">$</span>
            <Input
              type="number"
              value={value[0]}
              onChange={(e) => onChange([Number(e.target.value), value[1]])}
              className="pl-8"
              min="0"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Máximo</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-muted-foreground">$</span>
            <Input
              type="number"
              value={value[1]}
              onChange={(e) => onChange([value[0], Number(e.target.value)])}
              className="pl-8"
              min={value[0]}
            />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {RANGOS_INGRESOS.map((rango) => (
          <Button
            key={rango.label}
            variant="outline"
            size="sm"
            className={`w-full justify-start ${value[0] === rango.value[0] && value[1] === rango.value[1] ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}`}
            onClick={() => onChange([...rango.value] as [number, number])}
          >
            {rango.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

// Componente para el menú de filtros avanzados
const FiltrosAvanzados = ({
  filtros,
  onFiltrosChange,
  ciudades,
  vendedores,
}: {
  filtros: FiltrosClientes;
  onFiltrosChange: (filtros: FiltrosClientes) => void;
  ciudades: string[];
  vendedores: string[];
}) => {
  const handleChange = (key: keyof FiltrosClientes, value: any) => {
    onFiltrosChange({ ...filtros, [key]: value });
  };

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Tipo de Documento</label>
          <Select
            value={filtros.tipoDocumento}
            onValueChange={(value) => handleChange('tipoDocumento', value as TipoDocumento | 'Todos')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo de documento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos los tipos</SelectItem>
              {TIPOS_DOCUMENTO.map((tipo) => (
                <SelectItem key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Ciudad</label>
          <Select
            value={filtros.ciudad}
            onValueChange={(value) => handleChange('ciudad', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas las ciudades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas las ciudades</SelectItem>
              {ciudades.map((ciudad) => (
                <SelectItem key={ciudad} value={ciudad}>
                  {ciudad}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Rango de Fechas</label>
        <RangoFechas
          fechaInicio={filtros.fechaInicio}
          fechaFin={filtros.fechaFin}
          onFechaInicioChange={(date) => handleChange('fechaInicio', date)}
          onFechaFinChange={(date) => handleChange('fechaFin', date)}
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Rango de Ingresos Mensuales</label>
        <RangoIngresos
          value={filtros.rangoIngresos}
          onChange={(value) => handleChange('rangoIngresos', value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Canal de Venta</label>
          <Select
            value={filtros.canalVenta}
            onValueChange={(value) => handleChange('canalVenta', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los canales" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos los canales</SelectItem>
              {CANALES_VENTA.map((canal) => (
                <SelectItem key={canal} value={canal}>
                  {canal}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Vendedor</label>
          <Select
            value={filtros.vendedor}
            onValueChange={(value) => handleChange('vendedor', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los vendedores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos los vendedores</SelectItem>
              {vendedores.map((vendedor) => (
                <SelectItem key={vendedor} value={vendedor}>
                  {vendedor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Checkbox
          id="tienePoliza"
          checked={filtros.tienePoliza}
          onCheckedChange={(checked) => handleChange('tienePoliza', Boolean(checked))}
        />
        <label
          htmlFor="tienePoliza"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Solo clientes con póliza activa
        </label>
      </div>
    </div>
  );
};

// Datos de ejemplo para inicializar el estado
const clientesEjemplo: Cliente[] = [
  {
    id: '1',
    nombre: 'Juan Pérez',
    email: 'juan@example.com',
    telefono: '3001234567',
    direccion: 'Calle 123 #45-67',
    ciudad: 'Bogotá',
    departamento: 'Bogotá D.C.',
    estado: 'Activo',
    tipoDocumento: 'CC',
    documento: '1234567890',
    fechaNacimiento: new Date('1990-05-15'),
    fechaRegistro: new Date('2023-01-15'),
    vendedor: 'Ana García',
    canalVenta: 'Web',
    ingresosMensuales: 5000000,
    profesion: 'Ingeniero',
    contactoPreferido: 'whatsapp',
    aceptaMensajes: true
  }
];

const contactosEjemplo: Contacto[] = [
  {
    id: 'c1',
    nombre: 'María López',
    email: 'maria@example.com',
    telefono: '3109876543',
    direccion: 'Carrera 5 #12-34',
    parentesco: 'Familiar',
    tipoPoliza: 'Vida',
    clienteId: '1',
    fechaContacto: new Date('2023-04-05'),
    proximoSeguimiento: new Date('2023-05-15'),
    estadoSeguimiento: 'Contactado',
    probabilidadCierre: 70,
    montoPrima: 1200000,
    notas: 'Interesado en cobertura de vida',
    vendedorAsignado: 'Ana García'
  }
];

// Componente principal
function GestionClientes() {
  // Inicializar estados con datos de ejemplo
  const [clientes, setClientes] = useState<Cliente[]>(clientesEjemplo);
  const [contactos, setContactos] = useState<Contacto[]>(contactosEjemplo);
  const [busqueda, setBusqueda] = useState('');
  const [tabActivo, setTabActivo] = useState<'clientes' | 'contactos'>('clientes');
  const [filtroEstado, setFiltroEstado] = useState<string | null>(null);
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mostrarFormularioContacto, setMostrarFormularioContacto] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosClientes>({
    busqueda: '',
    estado: 'Todos',
    tipoDocumento: 'Todos',
    ciudad: '',
    canalVenta: '',
    vendedor: '',
    rangoIngresos: [0, 10000000],
    tienePoliza: false,
  });
  const [ordenamiento, setOrdenamiento] = useState<OrdenamientoCliente>({
    campo: 'fechaRegistro',
    direccion: 'desc',
  });
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  // Datos para los selects
  const ciudades = useMemo(() => {
    return Array.from(new Set(clientes.map(c => c.ciudad).filter(Boolean))) as string[];
  }, [clientes]);

  const vendedores = useMemo(() => {
    return Array.from(new Set(clientes.map(c => c.vendedor).filter(Boolean))) as string[];
  }, [clientes]);

  // Filtrar clientes
  const clientesFiltrados = useMemo(() => {
    return clientes.filter(cliente => {
      // Búsqueda general
      const busquedaTerm = filtros.busqueda.toLowerCase();
      const coincideBusqueda = 
        cliente.nombre.toLowerCase().includes(busquedaTerm) ||
        (cliente.email?.toLowerCase().includes(busquedaTerm) || '') ||
        (cliente.telefono?.includes(busquedaTerm) || '') ||
        (cliente.documento?.includes(busquedaTerm) || '');

      // Filtros adicionales
      const coincideEstado = filtros.estado === 'Todos' || cliente.estado === filtros.estado;
      const coincideTipoDoc = filtros.tipoDocumento === 'Todos' || cliente.tipoDocumento === filtros.tipoDocumento;
      const coincideCiudad = !filtros.ciudad || cliente.ciudad === filtros.ciudad;
      const coincideCanal = !filtros.canalVenta || cliente.canalVenta === filtros.canalVenta;
      const coincideVendedor = !filtros.vendedor || cliente.vendedor === filtros.vendedor;
      const enRangoIngresos = 
        (cliente.ingresosMensuales || 0) >= (filtros.rangoIngresos?.[0] || 0) &&
        (cliente.ingresosMensuales || 0) <= (filtros.rangoIngresos?.[1] || 10000000);
      
      const tienePolizaActiva = !filtros.tienePoliza || 
        contactos.some(c => c.clienteId === cliente.id && c.estadoSeguimiento === 'Ganado');

      // Filtro por rango de fechas
      const fechaRegistro = new Date(cliente.fechaRegistro);
      const fechaInicio = filtros.fechaInicio ? new Date(filtros.fechaInicio) : null;
      const fechaFin = filtros.fechaFin ? new Date(filtros.fechaFin) : null;
      
      const enRangoFechas = 
        (!fechaInicio || fechaRegistro >= new Date(fechaInicio.setHours(0, 0, 0, 0))) &&
        (!fechaFin || fechaRegistro <= new Date(fechaFin.setHours(23, 59, 59, 999)));

      return coincideBusqueda && coincideEstado && coincideTipoDoc && coincideCiudad && 
             coincideCanal && coincideVendedor && enRangoIngresos && enRangoFechas && tienePolizaActiva;
    });
  }, [clientes, contactos, filtros]);

  // Ordenar clientes
  const clientesOrdenados = useMemo(() => {
    return [...clientesFiltrados].sort((a, b) => {
      const campo = ordenamiento.campo as keyof Cliente;
      const valorA = a[campo];
      const valorB = b[campo];

      if (valorA === undefined || valorB === undefined) return 0;

      if (typeof valorA === 'string' && typeof valorB === 'string') {
        return ordenamiento.direccion === 'asc' 
          ? valorA.localeCompare(valorB)
          : valorB.localeCompare(valorA);
      }

      if (valorA instanceof Date && valorB instanceof Date) {
        return ordenamiento.direccion === 'asc'
          ? valorA.getTime() - valorB.getTime()
          : valorB.getTime() - valorA.getTime();
      }

      return 0;
    });
  }, [clientesFiltrados, ordenamiento]);

  // Filtrar contactos según búsqueda
  const contactosFiltrados = useMemo(() => {
    const busquedaTerm = filtros.busqueda.toLowerCase();
    return contactos.filter(contacto => {
      const cliente = clientes.find(c => c.id === contacto.clienteId);
      if (!cliente) return false;
      
      return (
        contacto.nombre.toLowerCase().includes(busquedaTerm) ||
        (contacto.email?.toLowerCase().includes(busquedaTerm) || '') ||
        (contacto.telefono?.includes(busquedaTerm) || '') ||
        cliente.nombre.toLowerCase().includes(busquedaTerm)
      );
    });
  }, [contactos, clientes, filtros.busqueda]);

  const toggleFiltroEstado = useCallback((estado: string) => {
    setFiltroEstado(prev => prev === estado ? null : estado);
  }, []);

  // Manejar cambio de ordenamiento
  const handleOrdenar = (campo: CampoOrdenamiento) => {
    setOrdenamiento(prev => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      busqueda: '',
      estado: 'Todos',
      tipoDocumento: 'Todos',
      ciudad: '',
      canalVenta: '',
      vendedor: '',
      rangoIngresos: [0, 10000000],
      tienePoliza: false,
    });
  };

  // Eliminar un filtro específico
  const eliminarFiltro = (key: string) => {
    setFiltros(prev => ({
      ...prev,
      [key]: key === 'rangoIngresos' ? [0, 10000000] : 
              key === 'estado' ? 'Todos' : 
              key === 'tipoDocumento' ? 'Todos' : 
              ''
    }));
  };

  // Obtener el ícono de ordenamiento
  const getSortIcon = (campo: CampoOrdenamiento) => {
    if (ordenamiento.campo !== campo) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    return ordenamiento.direccion === 'asc' 
      ? <ChevronUp className="ml-2 h-4 w-4" /> 
      : <ChevronDown className="ml-2 h-4 w-4" />;
  };

  // Datos para las tarjetas de resumen
  const resumenClientes = useMemo(() => ({
    total: clientes.length,
    activos: clientes.filter(c => c.estado === 'Activo').length,
    inactivos: clientes.filter(c => c.estado === 'Inactivo').length,
    prospectos: clientes.filter(c => c.estado === 'Prospecto').length,
  }), [clientes]);

  // Datos para las tarjetas de resumen de contactos
  const resumenContactos = useMemo(() => ({
    total: contactos.length,
    nuevos: contactos.filter(c => c.estadoSeguimiento === 'Nuevo').length,
    contactados: contactos.filter(c => c.estadoSeguimiento === 'Contactado').length,
    cotizados: contactos.filter(c => c.estadoSeguimiento === 'Cotizado').length,
    ganados: contactos.filter(c => c.estadoSeguimiento === 'Ganado').length,
    perdidos: contactos.filter(c => c.estadoSeguimiento === 'Perdido').length,
  }), [contactos]);

  // Renderizar el componente
  return (
    <div className="flex flex-col h-full">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-white border-b">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h1>
          <p className="text-sm text-gray-500">
            Administra la información de tus clientes y sus pólizas de seguros
          </p>
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-1 md:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-9 w-full"
              placeholder="Buscar clientes..."
              value={filtros.busqueda}
              onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="shrink-0">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                {Object.values(filtros).filter(v => 
                  v && v !== '' && 
                  !(Array.isArray(v) && v[0] === 0 && v[1] === 10000000)
                ).length > 1 && (
                  <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800">
                    {Object.values(filtros).filter(v => 
                      v && v !== '' && 
                      !(Array.isArray(v) && v[0] === 0 && v[1] === 10000000)
                    ).length - 1}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <h3 className="text-sm font-medium">Filtros avanzados</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 text-sm text-blue-600 hover:bg-blue-50"
                  onClick={limpiarFiltros}
                >
                  Limpiar todo
                </Button>
              </div>
              <FiltrosAvanzados
                filtros={filtros}
                onFiltrosChange={setFiltros}
                ciudades={ciudades}
                vendedores={vendedores}
              />
            </PopoverContent>
          </Popover>
          
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => navigate('/clientes/nuevo')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </Button>
        </div>
      </div>
      
      {/* Filtros activos */}
      <FiltrosActivos 
        filtros={{
          ...filtros,
          // Excluir búsqueda y estado por defecto
          ...(filtros.estado === 'Todos' ? { estado: undefined } : {}),
        }} 
        onRemoveFilter={eliminarFiltro} 
      />
      
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <EstadoCard
          estado="Totales"
          color="blue"
          icon={<Users className="w-6 h-6" />}
          count={resumenClientes.total}
          tabActivo={tabActivo}
          toggleFiltroEstado={() => setFiltroEstado(null)}
          filtroEstado={filtroEstado}
        />
        
        <EstadoCard
          estado="Activos"
          color="green"
          icon={<TrendingUp className="w-6 h-6" />}
          count={resumenClientes.activos}
          tabActivo={tabActivo}
          toggleFiltroEstado={() => toggleFiltroEstado('Activo')}
          filtroEstado={filtroEstado}
        />
        
        <EstadoCard
          estado="Inactivos"
          color="red"
          icon={<AlertTriangle className="w-6 h-6" />}
          count={resumenClientes.inactivos}
          tabActivo={tabActivo}
          toggleFiltroEstado={() => toggleFiltroEstado('Inactivo')}
          filtroEstado={filtroEstado}
        />
        
        <EstadoCard
          estado="Prospectos"
          color="yellow"
          icon={<UserPlus className="w-6 h-6" />}
          count={resumenClientes.prospectos}
          tabActivo={tabActivo}
          toggleFiltroEstado={() => toggleFiltroEstado('Prospecto')}
          filtroEstado={filtroEstado}
        />
      </div>
      
      {/* Tarjetas de contacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 pb-4 -mt-2">
        <EstadoCard
          estado="Nuevos"
          color="blue"
          icon={<Plus className="w-6 h-6" />}
          count={resumenContactos.nuevos}
          tabActivo={tabActivo}
          toggleFiltroEstado={() => toggleFiltroEstado('Nuevo')}
          filtroEstado={filtroEstado}
        />
        
        <EstadoCard
          estado="Contactados"
          color="green"
          icon={<MessageSquare className="w-6 h-6" />}
          count={resumenContactos.contactados}
          tabActivo={tabActivo}
          toggleFiltroEstado={() => toggleFiltroEstado('Contactado')}
          filtroEstado={filtroEstado}
        />
        
        <EstadoCard
          estado="Cotizados"
          color="purple"
          icon={<FileText className="w-6 h-6" />}
          count={resumenContactos.cotizados}
          tabActivo={tabActivo}
          toggleFiltroEstado={() => toggleFiltroEstado('Cotizado')}
          filtroEstado={filtroEstado}
        />
        
        <EstadoCard
          estado="Ganados"
          color="green"
          icon={<CheckCircle className="w-6 h-6" />}
          count={resumenContactos.ganados}
          tabActivo={tabActivo}
          toggleFiltroEstado={() => toggleFiltroEstado('Ganado')}
          filtroEstado={filtroEstado}
        />
      </div>
      
      {/* Lista de clientes */}
      <div className="flex-1 overflow-auto p-4">
        <Card>
          <CardHeader className="px-6 py-4 border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold">Lista de Clientes</h2>
                <p className="text-sm text-muted-foreground">
                  {clientesFiltrados.length} {clientesFiltrados.length === 1 ? 'cliente encontrado' : 'clientes encontrados'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="h-8">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button variant="outline" size="sm" className="h-8">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar columnas
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleOrdenar('nombre')}
                  >
                    <div className="flex items-center">
                      Nombre
                      {getSortIcon('nombre')}
                    </div>
                  </TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleOrdenar('fechaRegistro')}
                  >
                    <div className="flex items-center">
                      Fecha de Registro
                      {getSortIcon('fechaRegistro')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleOrdenar('estado')}
                  >
                    <div className="flex items-center">
                      Estado
                      {getSortIcon('estado')}
                    </div>
                  </TableHead>
                  <TableHead>Pólizas</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientesOrdenados.length > 0 ? (
                  clientesOrdenados.map((cliente) => {
                    const polizasCliente = contactos.filter(c => c.clienteId === cliente.id);
                    const polizaActiva = polizasCliente.some(p => p.estadoSeguimiento === 'Ganado');
                    
                    return (
                      <TableRow key={cliente.id} className="hover:bg-gray-50">
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3">
                              {cliente.nombre.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{cliente.nombre}</div>
                              <div className="text-xs text-gray-500">{cliente.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">
                            {TIPOS_DOCUMENTO.find(t => t.value === cliente.tipoDocumento)?.label || cliente.tipoDocumento}
                          </div>
                          <div className="text-xs text-gray-500">{cliente.documento}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">{cliente.telefono}</div>
                          <div className="text-xs text-gray-500">
                            {cliente.contactoPreferido === 'whatsapp' ? 'WhatsApp' : 
                             cliente.contactoPreferido === 'email' ? 'Email' : 'Llamada'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">{cliente.ciudad}</div>
                          <div className="text-xs text-gray-500">{cliente.departamento}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">
                            {format(new Date(cliente.fechaRegistro), 'dd/MM/yyyy', { locale: es })}
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(new Date(cliente.fechaRegistro), 'HH:mm', { locale: es })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                            cliente.estado === 'Activo' ? 'bg-green-100 text-green-800' :
                            cliente.estado === 'Inactivo' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          )}>
                            {cliente.estado}
                          </span>
                        </TableCell>
                        <TableCell>
                          {polizaActiva ? (
                            <div className="flex -space-x-1">
                              {polizasCliente
                                .filter(p => p.estadoSeguimiento === 'Ganado')
                                .slice(0, 3)
                                .map((poliza, i) => (
                                  <div 
                                    key={poliza.id}
                                    className={cn(
                                      "h-6 w-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium",
                                      i === 0 ? 'bg-purple-100 text-purple-800' :
                                      i === 1 ? 'bg-blue-100 text-blue-800' :
                                      'bg-green-100 text-green-800',
                                      i > 0 ? 'opacity-80' : ''
                                    )}
                                    title={`${poliza.tipoPoliza} - ${poliza.nombre}`}
                                  >
                                    {poliza.tipoPoliza.charAt(0)}
                                  </div>
                                ))}
                              {polizasCliente.filter(p => p.estadoSeguimiento === 'Ganado').length > 3 && (
                                <div className="h-6 w-6 rounded-full border-2 border-white bg-gray-100 text-gray-800 flex items-center justify-center text-xs font-medium">
                                  +{polizasCliente.filter(p => p.estadoSeguimiento === 'Ganado').length - 3}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">Sin pólizas</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4 text-blue-500" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <FileText className="h-4 w-4 text-green-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2 py-6">
                        <Users className="h-12 w-12 text-gray-300" />
                        <p className="text-sm font-medium text-gray-500">No se encontraron clientes</p>
                        <p className="text-xs text-gray-400">
                          Intenta ajustar tus filtros o crear un nuevo cliente
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => setFiltros({
                            busqueda: '',
                            estado: 'Todos',
                            tipoDocumento: 'Todos',
                            ciudad: '',
                            canalVenta: '',
                            vendedor: '',
                            rangoIngresos: [0, 10000000],
                            tienePoliza: false,
                          })}
                        >
                          Limpiar filtros
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {clientesOrdenados.length > 0 && (
            <CardFooter className="flex items-center justify-between border-t px-6 py-3">
              <div className="text-sm text-gray-500">
                Mostrando <span className="font-medium">1</span> a <span className="font-medium">{Math.min(10, clientesOrdenados.length)}</span> de{' '}
                <span className="font-medium">{clientesOrdenados.length}</span> clientes
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Siguiente
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}

interface EstadoCardProps {
  estado: string;
  color: string;
  icon: React.ReactNode;
  count: number;
  tabActivo: 'clientes' | 'contactos';
  toggleFiltroEstado: (estado: string) => void;
  filtroEstado: string | null;
}

// Componente para las tarjetas de estado
const EstadoCard: React.FC<EstadoCardProps> = React.memo(({ 
  estado, 
  color, 
  icon, 
  count, 
  tabActivo, 
  toggleFiltroEstado, 
  filtroEstado 
}) => {
  const activo = filtroEstado === estado;
  
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        activo && `border-${color} border-2`
      )}
      onClick={() => toggleFiltroEstado(estado)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {tabActivo === 'clientes' ? 'Clientes' : 'Contactos'} {estado}
            </p>
            <p className="text-2xl font-bold">{count}</p>
          </div>
          <div className={`rounded-full p-3 bg-${color}/10`}>
            {React.cloneElement(icon as React.ReactElement, { 
              className: `w-6 h-6 text-${color}`, 
              strokeWidth: 2 
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default GestionClientes;
