import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/DataTable';
import { Cliente } from '@/types';
import { format } from 'date-fns';

interface ClientesProps {
  clientes: Cliente[];
  onEditar?: (cliente: Cliente) => void;
  onEliminar?: (cliente: Cliente) => void;
}

export const GestionClientes: React.FC<ClientesProps> = ({ clientes, onEditar, onEliminar }) => {
  const [search, setSearch] = useState('');
  
  const filteredClientes = useMemo(() => {
    if (!clientes) return [];
    if (!search.trim()) return clientes;
    
    const searchTerm = search.toLowerCase().trim();
    return clientes.filter(cliente => 
      (cliente.nombres?.toLowerCase().includes(searchTerm) ?? false) ||
      (cliente.apellidos?.toLowerCase().includes(searchTerm) ?? false) ||
      (cliente.documento?.toLowerCase().includes(searchTerm) ?? false)
    );
  }, [clientes, search]);
  
  const handleExport = () => {
    // Implementar lógica de exportación
    console.log('Exportando clientes...', filteredClientes);
  };
  
  const handleNuevoCliente = () => {
    // Implementar lógica para nuevo cliente
    console.log('Nuevo cliente...');
  };

  const columns = [
    { id: 'nombres', label: 'Nombres', sortable: true },
    { id: 'apellidos', label: 'Apellidos', sortable: true },
    { id: 'documento', label: 'Documento', sortable: true },
    { id: 'email', label: 'Email', sortable: true },
    { id: 'celular', label: 'Celular', sortable: true },
    { id: 'estadoCliente', label: 'Estado', sortable: true },
    { id: 'acciones', label: 'Acciones' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Clientes</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-[200px]"
          />
          <Button variant="outline" onClick={handleExport}>
            Exportar
          </Button>
          <Button onClick={handleNuevoCliente}>
            Nuevo Cliente
          </Button>
        </div>
      </div>

      <div className="rounded-lg border">
        <DataTable
          data={filteredClientes}
          columns={columns}
          renderCell={(row, column) => {
            switch (column.id) {
              case 'acciones':
                return (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditar?.(row)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onEliminar?.(row)}
                    >
                      Eliminar
                    </Button>
                  </div>
                );
              case 'fechaNacimiento':
                return format(row.fechaNacimiento, 'dd/MM/yyyy');
              case 'fechaConstitucion':
                return format(row.fechaConstitucion, 'dd/MM/yyyy');
              default:
                return row[column.id as keyof Cliente];
            }
          }}
        />
      </div>
    </div>
  );
};

export default GestionClientes;
