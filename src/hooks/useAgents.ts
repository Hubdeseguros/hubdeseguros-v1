import { useState, useEffect } from 'react';
import { Agent, AgentFormData } from '@/features/agents/types';
import { agentService } from '@/features/agents/services/agentService';

export const useAgents = () => {
  const [data, setData] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAgents = async () => {
    setLoading(true);
    setError(null);
    try {
      const agents = await agentService.getAll();
      setData(agents);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createAgent = async (agent: AgentFormData) => {
    setLoading(true);
    setError(null);
    try {
      await agentService.create(agent);
      await fetchAgents();
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return {
    data,
    loading,
    error,
    fetchAgents,
    createAgent,
  };
}; 