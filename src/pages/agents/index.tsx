import React from 'react';
import { useAgents } from '@/hooks/useAgents';
import AgentList from '@/components/agents/AgentList';
import AgentForm from '@/components/agents/AgentForm';
import AgentDetails from '@/components/agents/AgentDetails';

export default function AgentsPage() {
  const { data: agents, loading, error, createAgent } = useAgents();
  const [selected, setSelected] = React.useState<string | null>(null);

  const selectedAgent = agents.find(a => a.id === selected);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Agentes</h1>
      {error && <div className="text-red-500">{error.message}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <AgentList agents={agents} onSelect={a => setSelected(a.id)} />
        </div>
        <div>
          <h2 className="font-semibold mb-2">Nuevo Agente</h2>
          <AgentForm onSubmit={createAgent} loading={loading} />
          {selectedAgent && (
            <>
              <h2 className="font-semibold mt-6 mb-2">Detalles</h2>
              <AgentDetails agent={selectedAgent} />
            </>
          )}
        </div>
      </div>
    </div>
  );
} 