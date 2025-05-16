import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, FileText, Calendar, Phone, Mail, MapPin, User } from 'lucide-react';

// Mock data - en una aplicación real, esto vendría de una API
const mockClient = {
  id: '1',
  name: 'Juan Pérez',
  email: 'juan.perez@example.com',
  phone: '+1 234 567 890',
  address: 'Calle Falsa 123, Ciudad, País',
  status: 'active' as const,
  joinDate: '2024-01-15',
  policies: [
    { id: 'POL-001', type: 'Seguro de Auto', status: 'active', startDate: '2024-01-20', endDate: '2025-01-19' },
    { id: 'POL-002', type: 'Seguro de Hogar', status: 'active', startDate: '2024-03-10', endDate: '2025-03-09' },
  ],
};

const ClientDetailPage: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();

  // En una aplicación real, harías una llamada a la API aquí
  const client = mockClient;

  if (!client) {
    return <div>Cliente no encontrado</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
        <div className="space-x-2">
          <Button variant="outline" asChild>
            <Link to={`/agente/clientes/editar/${clientId}`}>
              <Edit className="mr-2 h-4 w-4" /> Editar
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{client.name}</h2>
                  <Badge className={client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {client.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Información de contacto</h3>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{client.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Cliente desde {new Date(client.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pólizas del Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              {client.policies.length > 0 ? (
                <div className="space-y-4">
                  {client.policies.map((policy) => (
                    <div key={policy.id} className="border rounded-lg p-4 hover:bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{policy.type}</h3>
                          <p className="text-sm text-muted-foreground">
                            {policy.id} • {policy.status === 'active' ? 'Activa' : 'Inactiva'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">
                            {new Date(policy.startDate).toLocaleDateString()} - {new Date(policy.endDate).toLocaleDateString()}
                          </p>
                          <Button variant="ghost" size="sm" className="mt-1">
                            <FileText className="mr-2 h-4 w-4" /> Ver detalles
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Este cliente no tiene pólizas registradas.</p>
                  <Button variant="link" className="mt-2">
                    Ofrecer nueva póliza
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>No hay actividad reciente para mostrar.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailPage;
