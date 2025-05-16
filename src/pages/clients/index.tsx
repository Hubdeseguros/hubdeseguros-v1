import React from 'react';
import { useClients } from '@/hooks/useClients';
import ClientList from '@/components/clients/ClientList';
import ClientForm from '@/components/clients/ClientForm';
import ClientDetails from '@/components/clients/ClientDetails';

export default function ClientsPage() {
  const { data: clients, loading, error, createClient } = useClients();
  const [selected, setSelected] = React.useState<string | null>(null);

  const selectedClient = clients.find(c => c.id === selected);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Clientes</h1>
      {error && <div className="text-red-500">{error.message}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ClientList clients={clients} onSelect={c => setSelected(c.id)} />
        </div>
        <div>
          <h2 className="font-semibold mb-2">Nuevo Cliente</h2>
          <ClientForm onSubmit={createClient} loading={loading} />
          {selectedClient && (
            <>
              <h2 className="font-semibold mt-6 mb-2">Detalles</h2>
              <ClientDetails client={selectedClient} />
            </>
          )}
        </div>
      </div>
    </div>
  );
} 