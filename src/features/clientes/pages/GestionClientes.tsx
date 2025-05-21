import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, UserPlus, Users, FileText, AlertTriangle, TrendingUp, Search, Filter, Columns, Check, MoreVertical, Pencil, Trash2, Eye, ArrowLeft, Upload, ChevronDown, FileDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useLocation, useNavigate } from 'react-router-dom';
import { SummaryCard } from '@/components/dashboard/SummaryCard';

interface ClienteFormData {
  tipoDocumento: string;
  documento: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  celular: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  pais: string;
  tipoCliente: string;
  tipoPersona: string;
  fechaNacimiento: string;
  genero: string;
  estadoCivil: string;
  ocupacion: string;
  ingresosMensuales: string;
  tipoVivienda: string;
  tipoPoliza: string;
  aseguradora: string;
  numeroPoliza: string;
  fechaExpedicion: string;
  fechaVencimiento: string;
  valorAsegurado: string;
  valorPrima: string;
  formaPago: string;
  frecuenciaPago: string;
  estadoPoliza: string;
  observaciones: string;
}

export default function GestionClientes() {
  const location = useLocation();
  const navigate = useNavigate();
  const isNewClientRoute = location.pathname.endsWith('/nuevo');
  const [isDialogOpen, setIsDialogOpen] = useState(isNewClientRoute);
  const [formData, setFormData] = useState<ClienteFormData>({
    tipoDocumento: 'CC',
    documento: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    celular: '',
    direccion: '',
    ciudad: 'Bogotá',
    departamento: 'Cundinamarca',
    pais: 'Colombia',
    tipoCliente: 'NATURAL',
    tipoPersona: 'TITULAR',
    fechaNacimiento: '',
    genero: 'MASCULINO',
    estadoCivil: 'SOLTERO',
    ocupacion: '',
    ingresosMensuales: '',
    tipoVivienda: 'PROPIA',
    tipoPoliza: 'VIDA',
    aseguradora: '',
    numeroPoliza: '',
    fechaExpedicion: '',
    fechaVencimiento: '',
    valorAsegurado: '',
    valorPrima: '',
    formaPago: 'ANUAL',
    frecuenciaPago: 'ANUAL',
    estadoPoliza: 'ACTIVA',
    observaciones: ''
  });

  // Datos de ejemplo para la tabla de clientes
  const [clientes, setClientes] = useState<Array<{
    id: number;
    nombre: string;
    tipoDocumento: string;
    documento: string;
    email: string;
    telefono: string;
    ciudad: string;
    tipoCliente: string;
  }>>([
    {
      id: 1,
      nombre: 'Juan Pérez',
      tipoDocumento: 'CC',
      documento: '123456789',
      email: 'juan.perez@example.com',
      telefono: '3001234567',
      ciudad: 'Bogotá',
      tipoCliente: 'Natural'
    },
    {
      id: 2,
      nombre: 'Empresa SAS',
      tipoDocumento: 'NIT',
      documento: '901234567-1',
      email: 'contacto@empresasas.com',
      telefono: '6012345678',
      ciudad: 'Medellín',
      tipoCliente: 'Jurídica'
    },
    {
      id: 3,
      nombre: 'María Gómez',
      tipoDocumento: 'CC',
      documento: '987654321',
      email: 'maria.gomez@example.com',
      telefono: '3109876543',
      ciudad: 'Cali',
      tipoCliente: 'Natural'
    }
  ]);

  const ciudades = [
    'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga',
    'Pereira', 'Manizales', 'Armenia', 'Ibagué', 'Neiva', 'Villavicencio', 'Santa Marta'
  ];

  // Estado para controlar las columnas visibles
  const [visibleColumns, setVisibleColumns] = useState<{[key: string]: boolean}>({
    nombre: true,
    tipoDocumento: true,
    documento: true,
    email: true,
    telefono: true,
    ciudad: true,
    tipoCliente: true,
    acciones: true
  });

  // Función para alternar la visibilidad de una columna
  const toggleColumnVisibility = (column: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  // Datos de ejemplo para las tarjetas de resumen
  const summaryData = [
    {
      title: "Total Clientes",
      value: "0",
      icon: <Users className="w-5 h-5 text-blue-600" />,
      trend: "neutral" as const,
      trendValue: "Sin datos previos"
    },
    {
      title: "Pólizas Activas",
      value: "0",
      icon: <FileText className="w-5 h-5 text-green-600" />,
      trend: "neutral" as const,
      trendValue: "Sin datos previos"
    },
    {
      title: "Siniestros",
      value: "0",
      icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
      trend: "neutral" as const,
      trendValue: "Sin datos previos"
    },
    {
      title: "Crecimiento",
      value: "0%",
      icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
      trend: "neutral" as const,
      trendValue: "Sin datos previos"
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar el cliente
    console.log('Datos del cliente:', formData);
    // Cerrar el modal después de guardar
    setIsDialogOpen(false);
    // Aquí podrías agregar una notificación de éxito
  };

  const getPolizaData = (cliente: any) => {
    return {
      'Nombre': cliente.nombre,
      'Tipo Documento': cliente.tipoDocumento,
      'Documento': cliente.documento,
      'Email': cliente.email || '',
      'Teléfono': cliente.telefono || '',
      'Ciudad': cliente.ciudad || '',
      'Tipo Cliente': cliente.tipoCliente || '',
      'Tipo de Póliza': formData.tipoPoliza || '',
      'Aseguradora': formData.aseguradora || '',
      'Número de Póliza': formData.numeroPoliza || '',
      'Fecha Expedición': formData.fechaExpedicion || '',
      'Fecha Vencimiento': formData.fechaVencimiento || '',
      'Valor Asegurado': formData.valorAsegurado || '',
      'Valor Prima': formData.valorPrima || '',
      'Forma de Pago': formData.formaPago || '',
      'Frecuencia de Pago': formData.frecuenciaPago || '',
      'Estado de la Póliza': formData.estadoPoliza || ''
    };
  };

  const exportToCSV = (cliente: any) => {
    const data = getPolizaData(cliente);
    const headers = Object.keys(data);
    const values = Object.values(data);
    
    const csvContent = [
      headers.join(','),
      values.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `poliza_${cliente.documento}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToXLS = (cliente: any) => {
    const data = getPolizaData(cliente);
    const worksheet = XLSX.utils.json_to_sheet([data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Póliza');
    XLSX.writeFile(workbook, `poliza_${cliente.documento}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToPDF = (cliente: any) => {
    const data = getPolizaData(cliente);
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(18);
    doc.text('Detalle de Póliza', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    // Datos del cliente
    const clienteData = [
      ['Cliente:', data.Nombre],
      ['Documento:', `${data['Tipo Documento']} ${data.Documento}`],
      ['Contacto:', `${data.Email} | ${data.Teléfono}`],
      ['Ubicación:', data.Ciudad],
      ['Tipo de Cliente:', data['Tipo Cliente']]
    ];

    // Datos de la póliza
    const polizaData = [
      ['Tipo de Póliza:', data['Tipo de Póliza']],
      ['Aseguradora:', data.Aseguradora],
      ['Número de Póliza:', data['Número de Póliza']],
      ['Vigencia:', `${data['Fecha Expedición']} al ${data['Fecha Vencimiento']}`],
      ['Valor Asegurado:', data['Valor Asegurado']],
      ['Valor Prima:', data['Valor Prima']],
      ['Forma de Pago:', data['Forma de Pago']],
      ['Frecuencia de Pago:', data['Frecuencia de Pago']],
      ['Estado:', data['Estado de la Póliza']]
    ];

    // Agregar tablas al PDF
    (doc as any).autoTable({
      startY: 30,
      head: [['Datos del Cliente', '']],
      body: clienteData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { top: 30 }
    });

    (doc as any).autoTable({
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Detalles de la Póliza', '']],
      body: polizaData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }
    });

    // Guardar el PDF
    doc.save(`poliza_${cliente.documento}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleExportarPoliza = (clienteId: number, format: 'csv' | 'xls' | 'pdf') => {
    const cliente = clientes.find(c => c.id === clienteId);
    if (!cliente) return;

    switch (format) {
      case 'csv':
        exportToCSV(cliente);
        break;
      case 'xls':
        exportToXLS(cliente);
        break;
      case 'pdf':
        exportToPDF(cliente);
        break;
    }
  };

  useEffect(() => {
    setIsDialogOpen(isNewClientRoute);
  }, [isNewClientRoute]);

  const handleCloseDialog = () => {
    navigate(-1); // Navega a la ruta anterior
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Clientes</h1>
          <p className="text-gray-500">Administra los clientes de tu agencia</p>
        </div>
        {!isNewClientRoute && (
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => navigate('/agente/clientes/nuevo')}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Nuevo Cliente
          </Button>
        )}
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) handleCloseDialog();
          setIsDialogOpen(open);
        }}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 p-0"
                  onClick={handleCloseDialog}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <DialogTitle>Nuevo Cliente</DialogTitle>
              </div>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <Tabs defaultValue="datos-personales" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-4">
                  <TabsTrigger value="datos-personales">Datos Personales</TabsTrigger>
                  <TabsTrigger value="datos-laborales">Datos Laborales</TabsTrigger>
                  <TabsTrigger value="datos-politica">Datos de Póliza</TabsTrigger>
                  <TabsTrigger value="documentos">Documentos</TabsTrigger>
                </TabsList>

                {/* Pestaña de Datos Personales */}
                <TabsContent value="datos-personales">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipoDocumento">Tipo de Documento</Label>
                      <Select 
                        value={formData.tipoDocumento}
                        onValueChange={(value) => handleSelectChange('tipoDocumento', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                          <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                          <SelectItem value="NIT">NIT</SelectItem>
                          <SelectItem value="PAS">Pasaporte</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="documento">Número de Documento</Label>
                      <Input 
                        id="documento"
                        name="documento"
                        value={formData.documento}
                        onChange={handleInputChange}
                        placeholder="Ingrese el documento"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombres</Label>
                      <Input 
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        placeholder="Ingrese los nombres"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="apellido">Apellidos</Label>
                      <Input 
                        id="apellido"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleInputChange}
                        placeholder="Ingrese los apellidos"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                      <Input 
                        id="fechaNacimiento"
                        name="fechaNacimiento"
                        type="date"
                        value={formData.fechaNacimiento}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="genero">Género</Label>
                      <Select 
                        value={formData.genero}
                        onValueChange={(value) => handleSelectChange('genero', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar género" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MASCULINO">Masculino</SelectItem>
                          <SelectItem value="FEMENINO">Femenino</SelectItem>
                          <SelectItem value="OTRO">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="ejemplo@dominio.com"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono Fijo</Label>
                      <Input 
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        placeholder="Ingrese el teléfono fijo"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="celular">Celular</Label>
                      <Input 
                        id="celular"
                        name="celular"
                        value={formData.celular}
                        onChange={handleInputChange}
                        placeholder="Ingrese el número de celular"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="estadoCivil">Estado Civil</Label>
                      <Select 
                        value={formData.estadoCivil}
                        onValueChange={(value) => handleSelectChange('estadoCivil', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado civil" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SOLTERO">Soltero(a)</SelectItem>
                          <SelectItem value="CASADO">Casado(a)</SelectItem>
                          <SelectItem value="UNION_LIBRE">Unión Libre</SelectItem>
                          <SelectItem value="DIVORCIADO">Divorciado(a)</SelectItem>
                          <SelectItem value="VIUDO">Viudo(a)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tipoVivienda">Tipo de Vivienda</Label>
                      <Select 
                        value={formData.tipoVivienda}
                        onValueChange={(value) => handleSelectChange('tipoVivienda', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo de vivienda" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PROPIA">Propia</SelectItem>
                          <SelectItem value="FAMILIAR">Familiar</SelectItem>
                          <SelectItem value="ARRENDADA">Arrendada</SelectItem>
                          <SelectItem value="OTRO">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="direccion">Dirección de Residencia</Label>
                      <Input 
                        id="direccion"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        placeholder="Ingrese la dirección completa"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ciudad">Ciudad</Label>
                      <Input 
                        id="ciudad"
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleInputChange}
                        placeholder="Ciudad"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="departamento">Departamento</Label>
                      <Input 
                        id="departamento"
                        name="departamento"
                        value={formData.departamento}
                        onChange={handleInputChange}
                        placeholder="Departamento"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pais">País</Label>
                      <Input 
                        id="pais"
                        name="pais"
                        value={formData.pais}
                        onChange={handleInputChange}
                        placeholder="País"
                        required
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Pestaña de Datos Laborales */}
                <TabsContent value="datos-laborales">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ocupacion">Ocupación</Label>
                      <Input 
                        id="ocupacion"
                        name="ocupacion"
                        value={formData.ocupacion}
                        onChange={handleInputChange}
                        placeholder="Ingrese la ocupación"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ingresosMensuales">Ingresos Mensuales</Label>
                      <Input 
                        id="ingresosMensuales"
                        name="ingresosMensuales"
                        type="number"
                        value={formData.ingresosMensuales}
                        onChange={handleInputChange}
                        placeholder="Ingrese los ingresos mensuales"
                        required
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Pestaña de Datos de Póliza */}
                <TabsContent value="datos-politica">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipoPoliza">Tipo de Póliza</Label>
                      <Select 
                        value={formData.tipoPoliza}
                        onValueChange={(value) => handleSelectChange('tipoPoliza', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo de póliza" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="VIDA">Vida</SelectItem>
                          <SelectItem value="SALUD">Salud</SelectItem>
                          <SelectItem value="AUTO">Auto</SelectItem>
                          <SelectItem value="HOGAR">Hogar</SelectItem>
                          <SelectItem value="OTRO">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="aseguradora">Aseguradora</Label>
                      <Input 
                        id="aseguradora"
                        name="aseguradora"
                        value={formData.aseguradora}
                        onChange={handleInputChange}
                        placeholder="Ingrese la aseguradora"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="numeroPoliza">Número de Póliza</Label>
                      <Input 
                        id="numeroPoliza"
                        name="numeroPoliza"
                        value={formData.numeroPoliza}
                        onChange={handleInputChange}
                        placeholder="Ingrese el número de póliza"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fechaExpedicion">Fecha de Expedición</Label>
                      <Input 
                        id="fechaExpedicion"
                        name="fechaExpedicion"
                        type="date"
                        value={formData.fechaExpedicion}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fechaVencimiento">Fecha de Vencimiento</Label>
                      <Input 
                        id="fechaVencimiento"
                        name="fechaVencimiento"
                        type="date"
                        value={formData.fechaVencimiento}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="valorAsegurado">Valor Asegurado</Label>
                      <Input 
                        id="valorAsegurado"
                        name="valorAsegurado"
                        type="number"
                        value={formData.valorAsegurado}
                        onChange={handleInputChange}
                        placeholder="Ingrese el valor asegurado"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="valorPrima">Valor de la Prima</Label>
                      <Input 
                        id="valorPrima"
                        name="valorPrima"
                        type="number"
                        value={formData.valorPrima}
                        onChange={handleInputChange}
                        placeholder="Ingrese el valor de la prima"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="formaPago">Forma de Pago</Label>
                      <Select 
                        value={formData.formaPago}
                        onValueChange={(value) => handleSelectChange('formaPago', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar forma de pago" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                          <SelectItem value="TARJETA_CREDITO">Tarjeta de Crédito</SelectItem>
                          <SelectItem value="TRANSFERENCIA">Transferencia</SelectItem>
                          <SelectItem value="PSE">PSE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="frecuenciaPago">Frecuencia de Pago</Label>
                      <Select 
                        value={formData.frecuenciaPago}
                        onValueChange={(value) => handleSelectChange('frecuenciaPago', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar frecuencia de pago" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MENSUAL">Mensual</SelectItem>
                          <SelectItem value="TRIMESTRAL">Trimestral</SelectItem>
                          <SelectItem value="SEMESTRAL">Semestral</SelectItem>
                          <SelectItem value="ANUAL">Anual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="estadoPoliza">Estado de la Póliza</Label>
                      <Select 
                        value={formData.estadoPoliza}
                        onValueChange={(value) => handleSelectChange('estadoPoliza', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACTIVA">Activa</SelectItem>
                          <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                          <SelectItem value="VENCIDA">Vencida</SelectItem>
                          <SelectItem value="CANCELADA">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                {/* Pestaña de Documentos */}
                <TabsContent value="documentos">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <p className="text-sm text-gray-500 mb-2">Arrastra y suelta los archivos aquí o haz clic para seleccionar</p>
                      <Button variant="outline" type="button">
                        <Upload className="w-4 h-4 mr-2" />
                        Subir Documentos
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">Formatos aceptados: PDF, JPG, PNG (máx. 10MB)</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Documentos Adjuntos</Label>
                      <div className="border rounded-md p-4">
                        <p className="text-sm text-gray-500">No hay documentos adjuntos</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="observaciones">Observaciones</Label>
                      <textarea
                        id="observaciones"
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleInputChange}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Ingrese cualquier observación adicional"
                        rows={3}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  Guardar Cliente
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Tarjetas de resumen */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryData.map((item, index) => (
          <SummaryCard
            key={index}
            title={item.title}
            value={item.value}
            icon={item.icon}
            trend={item.trend}
            trendValue={item.trendValue}
          />
        ))}
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar clientes..."
                className="pl-8 w-full"
              />
            </div>
            <div className="flex space-x-2 w-full sm:w-auto">
              <Button variant="outline" className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
              <div className="relative group">
                <Button 
                  variant="outline" 
                  className="flex items-center"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Exportar Póliza
                </Button>
                <div className="absolute right-0 z-10 mt-1 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block">
                  <div className="py-1">
                    <button
                      onClick={() => handleExportarPoliza(clientes[0]?.id, 'csv')}
                      className="text-gray-700 block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      Exportar a CSV
                    </button>
                    <button
                      onClick={() => handleExportarPoliza(clientes[0]?.id, 'xls')}
                      className="text-gray-700 block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      Exportar a Excel
                    </button>
                    <button
                      onClick={() => handleExportarPoliza(clientes[0]?.id, 'pdf')}
                      className="text-gray-700 block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      Exportar a PDF
                    </button>
                  </div>
                </div>
              </div>
              <div className="relative">
                <Button 
                  variant="outline" 
                  className="flex items-center"
                  onClick={() => document.getElementById('columns-dropdown')?.classList.toggle('hidden')}
                >
                  <Columns className="w-4 h-4 mr-2" />
                  Columnas
                </Button>
                <div id="columns-dropdown" className="hidden absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="p-2">
                    <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b">Mostrar/Ocultar Columnas</div>
                    <div className="py-1">
                      {Object.entries({
                        nombre: 'Nombre',
                        tipoDocumento: 'Tipo Documento',
                        documento: 'Documento',
                        email: 'Email',
                        telefono: 'Teléfono',
                        ciudad: 'Ciudad',
                        tipoCliente: 'Tipo Cliente',
                        acciones: 'Acciones'
                      }).map(([key, label]) => (
                        <div 
                          key={key}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          onClick={() => toggleColumnVisibility(key)}
                        >
                          <Check 
                            className={`w-4 h-4 mr-2 ${visibleColumns[key] ? 'text-blue-500' : 'invisible'}`} 
                          />
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Cliente
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {visibleColumns.nombre && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>}
                  {visibleColumns.tipoDocumento && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo Doc.</th>}
                  {visibleColumns.documento && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>}
                  {visibleColumns.email && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>}
                  {visibleColumns.telefono && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>}
                  {visibleColumns.ciudad && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ciudad</th>}
                  {visibleColumns.tipoCliente && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo Cliente</th>}
                  {visibleColumns.acciones && <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50">
                    {visibleColumns.nombre && <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{cliente.nombre}</div>
                    </td>}
                    {visibleColumns.tipoDocumento && <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{cliente.tipoDocumento}</div>
                    </td>}
                    {visibleColumns.documento && <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{cliente.documento}</div>
                    </td>}
                    {visibleColumns.email && <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{cliente.email}</div>
                    </td>}
                    {visibleColumns.telefono && <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{cliente.telefono}</div>
                    </td>}
                    {visibleColumns.ciudad && <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{cliente.ciudad}</div>
                    </td>}
                    {visibleColumns.tipoCliente && <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        cliente.tipoCliente === 'Natural' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {cliente.tipoCliente}
                      </span>
                    </td>}
                    {visibleColumns.acciones && <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="clientes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="contactos">Contactos</TabsTrigger>
          <TabsTrigger value="actividades">Actividades</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clientes" className="space-y-4">
          {/* Contenido de clientes */}
          <div className="rounded-lg border p-4">
            <p>Lista de clientes</p>
          </div>
        </TabsContent>
        
        <TabsContent value="contactos" className="space-y-4">
          {/* Contenido de contactos */}
          <div className="rounded-lg border p-4">
            <p>Lista de contactos</p>
          </div>
        </TabsContent>
        
        <TabsContent value="actividades" className="space-y-4">
          {/* Contenido de actividades */}
          <div className="rounded-lg border p-4">
            <p>Actividades recientes</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
