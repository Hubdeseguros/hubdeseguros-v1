import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/DataTable';
import { Poliza, Cliente } from '@/types';
import { format, parseISO, isValid } from 'date-fns';

interface PolizasProps {
  polizas: Poliza[];
  onEditar?: (poliza: Poliza) => void;
  onEliminar?: (poliza: Poliza) => void;
}

const PolizasListado: React.FC<PolizasProps> = ({ polizas = [], onEditar, onEliminar }) => {
  const [search, setSearch] = useState('');
  
  const filteredPolizas = useMemo(() => {
    if (!search) return polizas;
    return polizas.filter(poliza => 
      poliza.numeroPoliza?.toLowerCase().includes(search.toLowerCase()) ||
      (poliza.cliente?.nombres?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      poliza.tipoPoliza?.toLowerCase().includes(search.toLowerCase())
    );
  }, [polizas, search]);

  type ColumnId = keyof Poliza | 'acciones' | 'cliente' | 'fechaEmision' | 'fechaVencimiento';
  
  const columns: Array<{
    id: ColumnId;
    label: string;
    sortable?: boolean;
  }> = [
    { id: 'numeroPoliza', label: 'Número de Póliza', sortable: true },
    { id: 'cliente', label: 'Cliente', sortable: true },
    { id: 'tipoPoliza', label: 'Tipo de Póliza', sortable: true },
    { id: 'fechaEmision', label: 'Fecha de Emisión', sortable: true },
    { id: 'fechaVencimiento', label: 'Fecha de Vencimiento', sortable: true },
    { id: 'estado', label: 'Estado', sortable: true },
    { id: 'acciones', label: 'Acciones' },
  ];

  type PolizaRow = {
    [K in keyof Poliza]: K extends 'cliente' 
      ? Pick<Cliente, 'nombres' | 'apellidos'> | undefined 
      : K extends 'fechaEmision' | 'fechaVencimiento' 
        ? string | Date | undefined 
        : Poliza[K];
  };

  const renderCell = (row: PolizaRow, column: { id: ColumnId }) => {
    if (column.id === 'acciones') {
      return (
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEditar?.(row as unknown as Poliza)}
          >
            Editar
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEliminar?.(row as unknown as Poliza)}
          >
            Eliminar
          </Button>
        </div>
      );
    }
    try {
      const columnId = column.id as keyof PolizaRow;
      const value = row[columnId];
      
      if (value === undefined) return '-';
      
      switch (columnId) {
        case 'cliente': {
          const cliente = value as PolizaRow['cliente'];
          return cliente?.nombres ? `${cliente.nombres} ${cliente.apellidos || ''}`.trim() : '-';
        }
        case 'fechaEmision':
        case 'fechaVencimiento': {
          const dateValue = value as string | Date;
          if (!dateValue) return '-';
          
          const date = typeof dateValue === 'string' ? parseISO(dateValue) : new Date(dateValue);
          return isValid(date) ? format(date, 'dd/MM/yyyy') : '-';
        }

      default:
        return value != null ? String(value) : '-';
      }
    } catch (error) {
      console.error(`Error al renderizar celda ${column.id}:`, error);
      return '-';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Listado de Pólizas</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Buscar póliza..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-[200px]"
          />
          <Button variant="outline">Exportar</Button>
          <Button>Nueva Póliza</Button>
        </div>
      </div>
      <DataTable 
        data={filteredPolizas} 
        columns={columns} 
        renderCell={renderCell} 
      />
    </div>
  );
};

// Exportar como predeterminado para compatibilidad con importaciones existentes
export default PolizasListado as React.FC<PolizasProps>;
