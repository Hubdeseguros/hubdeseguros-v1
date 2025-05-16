import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText, Edit, Trash2 } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  lastContact: string;
  policies: number;
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    phone: '+1 234 567 890',
    status: 'active',
    lastContact: '2025-05-10',
    policies: 3,
  },
  // Agrega más clientes de ejemplo según sea necesario
];

export const ClientsTable: React.FC = () => {
  const navigate = useNavigate();

  const handleViewDetails = (clientId: string) => {
    navigate(`/agente/clientes/${clientId}`);
  };

  const handleEditClient = (clientId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/agente/clientes/editar/${clientId}`);
  };

  const handleCreateClient = () => {
    navigate('/agente/clientes/nuevo');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactivo</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Lista de Clientes</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar clientes..."
              className="pl-8 w-[200px] lg:w-[300px]"
            />
          </div>
          <Button onClick={handleCreateClient}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Cliente
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Último contacto</TableHead>
              <TableHead>Pólizas</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockClients.map((client) => (
              <TableRow 
                key={client.id} 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleViewDetails(client.id)}
              >
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    <div>{client.email}</div>
                    <div>{client.phone}</div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(client.status)}</TableCell>
                <TableCell>{new Date(client.lastContact).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    {client.policies} póliza(s)
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleEditClient(client.id, e)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};


