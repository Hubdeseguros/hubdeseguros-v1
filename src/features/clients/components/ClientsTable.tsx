import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Client, ClientStatus } from '../types/client.types';
import { clientService } from '../services/clientService';

interface ClientsTableProps {
  clients: Client[];
  selectedClients: string[];
  onSelectClient: (clientId: string) => void;
  onSelectAllClients: (checked: boolean) => void;
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
}

export function ClientsTable({
  clients,
  selectedClients,
  onSelectClient,
  onSelectAllClients,
  onEdit,
  onDelete,
}: ClientsTableProps) {
  const [statusOptions, setStatusOptions] = useState<ClientStatus[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadStatusOptions = async () => {
      const options = await clientService.getStatusOptions();
      setStatusOptions(options);
    };
    
    loadStatusOptions();
  }, []);

  const getStatusColor = (statusId: string) => {
    const status = statusOptions.find(s => s.id === statusId);
    return status?.color || '#6B7280';
  };

  const getStatusName = (statusId: string) => {
    const status = statusOptions.find(s => s.id === statusId);
    return status?.name || 'Desconocido';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'PPP', { locale: es });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedClients.length === clients.length && clients.length > 0}
                onCheckedChange={(checked) => onSelectAllClients(checked === true)}
                aria-label="Seleccionar todos"
              />
            </TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Categorías</TableHead>
            <TableHead>Creado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No se encontraron clientes.
              </TableCell>
            </TableRow>
          ) : (
            clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedClients.includes(client.id)}
                    onCheckedChange={() => onSelectClient(client.id)}
                    aria-label={`Seleccionar ${client.firstName} ${client.lastName}`}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${client.firstName}+${client.lastName}`} />
                      <AvatarFallback>
                        {getInitials(client.firstName, client.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {client.firstName} {client.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {client.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div>{client.documentType}</div>
                    <div className="text-sm text-muted-foreground">
                      {client.documentNumber}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>{client.phone || '-'}</div>
                  <div className="text-sm text-muted-foreground">
                    {client.mobile || '-'}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    className="text-xs" 
                    style={{ 
                      backgroundColor: getStatusColor(client.status.id),
                      color: 'white'
                    }}
                  >
                    {getStatusName(client.status.id)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {client.categories.slice(0, 2).map((category) => (
                      <Badge 
                        key={category.id} 
                        variant="outline"
                        className="text-xs"
                        style={{ borderColor: category.color, color: category.color }}
                      >
                        {category.name}
                      </Badge>
                    ))}
                    {client.categories.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{client.categories.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>{formatDate(client.createdAt)}</div>
                  <div className="text-sm text-muted-foreground">
                    por {client.createdBy || 'Sistema'}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(client)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDelete(client.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
