import { useState, useEffect } from 'react';
import { Client, ClientFormData } from '@/features/clients/types';
import { clientService } from '@/features/clients/services/clientService';

export const useClients = () => {
  const [data, setData] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const clients = await clientService.getAll();
      setData(clients);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (client: ClientFormData) => {
    setLoading(true);
    setError(null);
    try {
      await clientService.create(client);
      await fetchClients();
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    data,
    loading,
    error,
    fetchClients,
    createClient,
  };
}; 