import React from 'react';
import { Agent } from '@/features/agents/types';

interface Props {
  agent: Agent;
}

const AgentDetails: React.FC<Props> = ({ agent }) => (
  <div className="p-4 bg-white rounded shadow">
    <h2 className="text-xl font-bold mb-2">{agent.first_name} {agent.last_name}</h2>
    <div className="text-gray-700">Email: {agent.email}</div>
    <div className="text-gray-700">Teléfono: {agent.phone}</div>
    <div className="text-gray-700">Licencia: {agent.license_number}</div>
    <div className="text-gray-700">Estado: {agent.status}</div>
    <div className="text-gray-500 text-xs mt-2">Creado: {agent.created_at}</div>
    <div className="text-gray-500 text-xs">Actualizado: {agent.updated_at}</div>
  </div>
);

export default AgentDetails; 