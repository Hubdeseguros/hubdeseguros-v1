import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/lib/supabase';

const AgencyManagement = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [agencyName, setAgencyName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateAgency = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "No estás autenticado",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Verificar si ya tienes 3 agencias
      const { count: agencyCount } = await supabase
        .from('agencies')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', user.id);

      if (agencyCount >= 3) {
        throw new Error('Ya has alcanzado el límite máximo de 3 agencias');
      }

      // Crear la nueva agencia
      const { error: agencyError } = await supabase
        .from('agencies')
        .insert([
          {
            name: agencyName,
            created_by: user.id,
          },
        ]);

      if (agencyError) throw agencyError;

      toast({
        title: "Éxito",
        description: "Agencia creada exitosamente",
      });

      // Limpiar el formulario
      setAgencyName('');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestión de Agencias</h1>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="agencyName">Nombre de la Agencia</Label>
          <Input
            id="agencyName"
            value={agencyName}
            onChange={(e) => setAgencyName(e.target.value)}
            placeholder="Nombre de tu agencia"
          />
        </div>

        <Button
          onClick={handleCreateAgency}
          disabled={loading || !agencyName}
        >
          {loading ? 'Creando...' : 'Crear Agencia'}
        </Button>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">
          Nota: Puedes crear hasta 3 agencias en total. Ya tienes una agencia creada automáticamente al registrarte.
        </p>
      </div>
    </div>
  );
};

export default AgencyManagement;
