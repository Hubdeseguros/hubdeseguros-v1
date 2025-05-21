import React, { useState } from 'react';
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui';
import { Plus, Filter, Menu, Grid, X, CheckCircle, XCircle, ChevronDown, ChevronRight, ChevronLeft, ChevronUp, FileDown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Colores de la aplicación
const PRIMARY_COLOR = '#2569E6';
const SECONDARY_COLOR = '#F7F9FB';
const DANGER_COLOR = '#EF4444';
const SUCCESS_COLOR = '#10B981';
const WARNING_COLOR = '#F59E0B';

// Columnas de la tabla
const columnasBase = [
  { id: 'seleccionar', label: 'Seleccionar', fixed: true, disableCheckbox: true },
  { id: 'tipo_poliza', label: 'Tipo de póliza', fixed: true, disableCheckbox: true },
  { id: 'numero_poliza', label: 'Número de póliza', fixed: false },
  { id: 'aseguradora', label: 'Aseguradora', fixed: false },
  { id: 'ramo', label: 'Ramo', fixed: false },
  { id: 'riesgo', label: 'Riesgo', fixed: false },
  { id: 'cliente', label: 'Cliente', fixed: false },
  { id: 'documento', label: 'Documento', fixed: false },
  { id: 'vendedor', label: 'Vendedor', fixed: false },
  { id: 'estado_cobros', label: 'Estado cobros', fixed: false },
  { id: 'tiene_siniestros', label: 'Tiene siniestros', fixed: false },
  { id: 'renovable', label: 'Renovable', fixed: false },
  { id: 'categorias', label: 'Categorías', fixed: false },
  { id: 'prima_neta', label: 'Prima Neta', fixed: false },
  { id: 'prima_total', label: 'Prima Total', fixed: false },
  { id: 'comision_agencia', label: 'Comisión agencia', fixed: false },
  { id: 'comision_vendedor', label: 'Comisión vendedor', fixed: false },
  { id: 'estado_poliza', label: 'Estado póliza', fixed: false },
  { id: 'fecha_inicio', label: 'Fecha inicio', fixed: false },
  { id: 'fecha_fin', label: 'Fecha fin', fixed: false },
  { id: 'fecha_creacion', label: 'Fecha creación', fixed: false },
  { id: 'observaciones', label: 'Observaciones', fixed: false },
  { id: 'creada_por', label: 'Creada por', fixed: false },
  { id: 'accion', label: 'Acción', fixed: true, disableCheckbox: true },
];

// Datos de ejemplo
const polizasEjemplo = [
  {
    tipo_poliza: 'Individual',
    numero_poliza: 'POL-0001',
    aseguradora: 'Seguros Vida',
    ramo: 'Vida',
    riesgo: 'Bajo',
    cliente: 'Juan Pérez',
    documento: 'CC12345678',
    vendedor: 'Ana Torres',
    estado_cobros: 'Pagado',
    tiene_siniestros: false,
    renovable: true,
    categorias: 'General',
    prima_neta: 1000000,
    prima_total: 1200000,
    comision_agencia: 40000,
    comision_vendedor: 40000,
    estado_poliza: 'Vigente',
    fecha_inicio: '2024-01-01',
    fecha_fin: '2025-01-01',
    fecha_creacion: '2024-01-01',
    observaciones: '',
    creada_por: 'admin',
  },
  {
    tipo_poliza: 'Colectiva',
    numero_poliza: 'POL-0002',
    aseguradora: 'Seguros Salud',
    ramo: 'Salud',
    riesgo: 'Medio',
    cliente: 'Empresa ABC',
    documento: 'NIT98765432',
    vendedor: 'Carlos Gómez',
    estado_cobros: 'Pendiente',
    tiene_siniestros: true,
    renovable: false,
    categorias: 'Empresarial',
    prima_neta: 5000000,
    prima_total: 6000000,
    comision_agencia: 200000,
    comision_vendedor: 200000,
    estado_poliza: 'Activa',
    fecha_inicio: '2024-03-01',
    fecha_fin: '2025-02-28',
    fecha_creacion: '2024-02-15',
    observaciones: 'Renovación anual',
    creada_por: 'editor',
  },
];

export default function PolizasTable() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [columns, setColumns] = useState(columnasBase.map(col => ({
    ...col,
    visible: col.fixed ? true : true
  })));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [polizas, setPolizas] = useState(polizasEjemplo);
  const [selectedPolizas, setSelectedPolizas] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const visibleColumns = columns.filter(col => col.visible);

  // Handlers
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleColumnToggle = (id: string) => {
    setColumns(cols =>
      cols.map(col =>
        col.id === id && !col.fixed && !col.disableCheckbox
          ? { ...col, visible: !col.visible }
          : col
      )
    );
  };

  const handleMarkAll = () => {
    setColumns(cols =>
      cols.map(col =>
        (col.fixed || col.disableCheckbox) ? col : { ...col, visible: true }
      )
    );
  };

  const handleUnmarkAll = () => {
    setColumns(cols =>
      cols.map(col =>
        (col.fixed || col.disableCheckbox) ? col : { ...col, visible: false }
      )
    );
  };

  const handleResetColumns = () => {
    setColumns(columnasBase.map(col => ({
      ...col,
      visible: col.fixed ? true : true
    })));
  };

  const handleSaveColumns = () => {
    setDrawerOpen(false);
  };

  const handleCancelColumns = () => {
    setDrawerOpen(false);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedPolizas(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  // Función para manejar el envío del formulario de creación de póliza
  const handleSubmitPoliza = async (tipo: string) => {
    try {
      // Aquí iría la lógica para crear la póliza
      console.log('Creando póliza de tipo:', tipo);
      setModalCreateOpen(false);
      // Aquí podrías mostrar una notificación de éxito
    } catch (error) {
      console.error('Error al crear póliza:', error);
      // Aquí podrías mostrar una notificación de error
    }
  };

  // Función para exportar las pólizas seleccionadas
  const handleExportarPoliza = (formato: 'csv' | 'xls' | 'pdf') => {
    try {
      const polizasAExportar = selectedPolizas.length > 0 
        ? polizas.filter(poliza => selectedPolizas.includes(poliza.numero_poliza))
        : polizas;

      if (polizasAExportar.length === 0) {
        console.warn('No hay pólizas para exportar');
        return;
      }

      const fechaActual = new Date().toISOString().split('T')[0];
      
      if (formato === 'csv' || formato === 'xls') {
        // Preparar datos para CSV/Excel
        const datos = polizasAExportar.map(poliza => ({
          'Tipo de póliza': poliza.tipo_poliza,
          'Número de póliza': poliza.numero_poliza,
          'Aseguradora': poliza.aseguradora,
          'Ramo': poliza.ramo,
          'Riesgo': poliza.riesgo,
          'Cliente': poliza.cliente,
          'Documento': poliza.documento,
          'Estado': poliza.estado_poliza,
          'Prima Neta': poliza.prima_neta,
          'Prima Total': poliza.prima_total,
          'Fecha Inicio': poliza.fecha_inicio,
          'Fecha Fin': poliza.fecha_fin
        }));

        if (formato === 'csv') {
          // Exportar a CSV
          const cabeceras = Object.keys(datos[0]);
          const contenidoCSV = [
            cabeceras.join(','),
            ...datos.map(fila => 
              cabeceras.map(cabecera => 
                `"${String(fila[cabecera as keyof typeof fila] || '').replace(/"/g, '""')}"`
              ).join(',')
            )
          ].join('\n');

          const blob = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `polizas_${fechaActual}.csv`;
          link.click();
          URL.revokeObjectURL(url);
        } else {
          // Exportar a Excel
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.json_to_sheet(datos);
          XLSX.utils.book_append_sheet(wb, ws, 'Pólizas');
          XLSX.writeFile(wb, `polizas_${fechaActual}.xlsx`);
        }
      } else if (formato === 'pdf') {
        // Exportar a PDF
        const doc = new jsPDF();
        
        // Título
        doc.setFontSize(18);
        doc.text('Reporte de Pólizas', 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 30);
        
        // Tabla
        const headers = [
          'Tipo',
          'Número',
          'Aseguradora',
          'Cliente',
          'Estado',
          'Prima Total'
        ];
        
        const data = polizasAExportar.map(poliza => [
          poliza.tipo_poliza,
          poliza.numero_poliza,
          poliza.aseguradora,
          poliza.cliente,
          poliza.estado_poliza,
          `$${poliza.prima_total.toLocaleString()}`
        ]);
        
        (doc as any).autoTable({
          head: [headers],
          body: data,
          startY: 40,
          styles: { 
            fontSize: 9,
            cellPadding: 2,
            overflow: 'linebreak',
            cellWidth: 'wrap'
          },
          headStyles: {
            fillColor: [41, 105, 230],
            textColor: 255,
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [245, 249, 255]
          },
          margin: { top: 40 }
        });
        
        // Pie de página
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(10);
          doc.setTextColor(150);
          doc.text(
            `Página ${i} de ${pageCount}`,
            doc.internal.pageSize.width - 40,
            doc.internal.pageSize.height - 10
          );
        }
        
        doc.save(`polizas_${fechaActual}.pdf`);
      }
    } catch (error) {
      console.error('Error al exportar pólizas:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestión y Control de Pólizas</h1>
          <p className="text-gray-500">Administra tus pólizas de seguros</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setFilterDrawerOpen(true)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setDrawerOpen(true)}
          >
            <Grid className="w-4 h-4 mr-2" />
            Columnas
          </Button>
          <div className="relative group">
            <Button 
              variant="outline" 
              className="flex items-center"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <div className="absolute right-0 z-10 mt-1 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block">
              <div className="py-1">
                <button
                  onClick={() => handleExportarPoliza('csv')}
                  className="text-gray-700 block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  Exportar a CSV
                </button>
                <button
                  onClick={() => handleExportarPoliza('xls')}
                  className="text-gray-700 block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  Exportar a Excel
                </button>
                <button
                  onClick={() => handleExportarPoliza('pdf')}
                  className="text-gray-700 block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  Exportar a PDF
                </button>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => setModalCreateOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Póliza
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Filtros rápidos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="fecha">Fecha</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="produccion">Producción</SelectItem>
                  <SelectItem value="emision">Emisión</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="aseguradora">Aseguradora</Label>
              <Input placeholder="Buscar aseguradora..." />
            </div>
            <div>
              <Label htmlFor="ramo">Ramo</Label>
              <Input placeholder="Buscar ramo..." />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de pólizas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pólizas</CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleUnmarkAll}
            >
              <XCircle className="w-3 h-3 mr-1" />
              Desmarcar todos
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleMarkAll}
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Marcar todos
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.map(col => (
                    <TableHead key={col.id}>
                      {col.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {polizas.map((row, idx) => (
                  <TableRow 
                    key={idx} 
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    {visibleColumns.map(col => {
                      let cellContent = row[col.id];
                      
                      if (col.id === 'tiene_siniestros') {
                        cellContent = row[col.id]
                          ? <Badge variant="destructive" className="px-2">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Sí
                            </Badge>
                          : <Badge variant="secondary" className="px-2">
                              <XCircle className="w-4 h-4 mr-1" />
                              No
                            </Badge>;
                      } else if (col.id === 'estado_poliza') {
                        const estadoColor = {
                          Vigente: SUCCESS_COLOR,
                          Activa: PRIMARY_COLOR,
                          Cancelada: DANGER_COLOR,
                          Cotización: WARNING_COLOR
                        }[row[col.id] as keyof typeof estadoColor] || 'default';
                        
                        cellContent = (
                          <Badge 
                            className={`px-2 ${
                              estadoColor === 'default' ? '' : `bg-${estadoColor}-50 text-${estadoColor}-700`
                            }`}
                          >
                            {row[col.id]}
                          </Badge>
                        );
                      }
                      
                      return (
                        <TableCell key={col.id}>
                          {cellContent}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
                {polizas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={visibleColumns.length} className="text-center py-8">
                      <p className="text-gray-500">No hay pólizas disponibles</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Drawer de filtros */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out" 
           style={{ transform: filterDrawerOpen ? 'translateX(0)' : 'translateX(100%)' }}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Filtros Avanzados</h2>
            <button 
              onClick={() => setFilterDrawerOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fecha">Fecha a buscar</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="produccion">Producción</SelectItem>
                  <SelectItem value="emision">Emisión</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="aseguradora">Aseguradora</Label>
              <Input placeholder="Buscar aseguradora..." />
            </div>
            <div>
              <Label htmlFor="ramo">Ramo Principal</Label>
              <Input placeholder="Buscar ramo..." />
            </div>
            <div>
              <Label htmlFor="subramo">Subramo</Label>
              <Input placeholder="Buscar subramo..." />
            </div>
            <div>
              <Label htmlFor="vendedor">Vendedor</Label>
              <Input placeholder="Buscar vendedor..." />
            </div>
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vigente">Vigente</SelectItem>
                  <SelectItem value="cotizacion">Cotización</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                  <SelectItem value="activa">Activa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setFilterDrawerOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setFilterDrawerOpen(false)}>
                Aplicar filtros
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer para gestionar columnas */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out" 
           style={{ transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)' }}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Gestionar Columnas</h2>
            <button 
              onClick={handleCancelColumns}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={handleUnmarkAll}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Desmarcar todos
              </Button>
              <Button 
                variant="outline" 
                onClick={handleMarkAll}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Marcar todos
              </Button>
            </div>
            <div className="space-y-2">
              {columns.map(col => (
                <div key={col.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Checkbox
                      checked={col.visible}
                      disabled={col.fixed || col.disableCheckbox}
                      onCheckedChange={() => handleColumnToggle(col.id)}
                    />
                    <Label 
                      className={`ml-2 ${
                        col.fixed || col.disableCheckbox 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'cursor-pointer'
                      }`}
                    >
                      {col.label}
                    </Label>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Eliminar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={handleCancelColumns}
              >
                Cancelar
              </Button>
              <Button 
                variant="outline" 
                onClick={handleResetColumns}
              >
                Restablecer
              </Button>
              <Button 
                onClick={handleSaveColumns}
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal crear póliza */}
      <Dialog open={modalCreateOpen} onOpenChange={setModalCreateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crear Póliza</DialogTitle>
            <DialogDescription>
              Selecciona el tipo de póliza que deseas crear
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button 
              variant="outline" 
              className="justify-start gap-2"
              onClick={() => handleSubmitPoliza('INDIVIDUAL')}
            >
              <ChevronRight className="w-4 h-4" />
              Individual
            </Button>
            <Button 
              variant="outline" 
              className="justify-start gap-2"
              onClick={() => handleSubmitPoliza('COLECTIVA')}
            >
              <ChevronRight className="w-4 h-4" />
              Colectiva
            </Button>
            <Button 
              variant="outline" 
              className="justify-start gap-2"
              onClick={() => handleSubmitPoliza('AGRUPADORA')}
            >
              <ChevronRight className="w-4 h-4" />
              Agrupadora
            </Button>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setModalCreateOpen(false)}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
