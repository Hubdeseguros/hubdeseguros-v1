import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { getPromoters } from '@/services/user.service';
import { useAuth } from '@/hooks/use-auth';

export function PromotersList() {
  const [promoters, setPromoters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadPromoters = async () => {
    try {
      setLoading(true);
      // Asumiendo que el usuario tiene un agenciaId
      const agenciaId = user?.user_metadata?.agencia_id;
      if (agenciaId) {
        const data = await getPromoters(agenciaId);
        setPromoters(data);
      }
    } catch (error) {
      console.error('Error cargando promotores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromoters();
  }, []);

  const handleEdit = (promoterId: string) => {
    // Lógica para editar promotor
    console.log('Editar promotor:', promoterId);
  };

  const handleDelete = async (promoterId: string) => {
    if (confirm('¿Está seguro de eliminar este promotor?')) {
      try {
        // Lógica para eliminar promotor
        console.log('Eliminar promotor:', promoterId);
        // Recargar la lista
        await loadPromoters();
      } catch (error) {
        console.error('Error eliminando promotor:', error);
      }
    }
  };

  if (loading) {
    return <div>Cargando promotores...</div>;
  }

  if (promoters.length === 0) {
    return <div>No hay promotores registrados</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promoters.map((promoter) => (
            <TableRow key={promoter.id}>
              <TableCell className="font-medium">{promoter.name}</TableCell>
              <TableCell>{promoter.email}</TableCell>
              <TableCell>{promoter.phone}</TableCell>
              <TableCell>{`${promoter.document_type} - ${promoter.document_number}`}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(promoter.id)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(promoter.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
