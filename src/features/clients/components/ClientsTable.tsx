import React, { useState } from "react";
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
import { Search, Plus, FileText, Edit, Trash2, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";

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
  {
    id: '2',
    name: 'María López',
    email: 'maria.lopez@example.com',
    phone: '+1 987 654 321',
    status: 'active',
    lastContact: '2025-05-08',
    policies: 2,
  },
  {
    id: '3',
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@example.com',
    phone: '+1 555 123 456',
    status: 'inactive',
    lastContact: '2025-04-15',
    policies: 1,
  },
  {
    id: '4',
    name: 'Ana Martínez',
    email: 'ana.martinez@example.com',
    phone: '+1 444 789 012',
    status: 'pending',
    lastContact: '2025-05-12',
    policies: 0,
  },
  {
    id: '5',
    name: 'Roberto Gómez',
    email: 'roberto.gomez@example.com',
    phone: '+1 333 456 789',
    status: 'active',
    lastContact: '2025-05-01',
    policies: 5,
  }
];

export const ClientsTable: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Determinar la ruta base según el rol del usuario
  const getBaseRoute = () => {
    if (user?.role === 'ADMIN') {
      return '/admin/clientes';
    } else if (user?.role === 'AGENCIA') {
      return '/agencia/clientes';
    } else {
      return '/agente/clientes';
    }
  };

  const handleViewDetails = (clientId: string) => {
    navigate(`${getBaseRoute()}/${clientId}`);
  };

  const handleEditClient = (clientId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`${getBaseRoute()}/editar/${clientId}`);
  };

  const handleCreateClient = () => {
    navigate(`${getBaseRoute()}/nuevo`);
  };

  const handleDeleteClick = (clientId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setClientToDelete(clientId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (clientToDelete) {
      // Aquí iría la lógica para eliminar el cliente
      toast({
        title: "Cliente eliminado",
        description: `El cliente ha sido eliminado correctamente.`,
        variant: "default",
      });
      setIsDeleteDialogOpen(false);
      setClientToDelete(null);
    }
  };

  // Filtrar clientes según el término de búsqueda
  const filteredClients = mockClients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
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
                        title="Editar cliente"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={(e) => handleDeleteClick(client.id, e)}
                        title="Eliminar cliente"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mb-2" />
                    <p>No se encontraron clientes</p>
                    {searchTerm && (
                      <p className="text-sm">Intenta con otros términos de búsqueda</p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Diálogo de confirmación para eliminar cliente */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el cliente
              y todos sus datos asociados del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};


