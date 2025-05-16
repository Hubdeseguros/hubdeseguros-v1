import React from 'react';
import { Agent } from '@/features/agents/types';
import AgentEmpty from './AgentEmpty';

interface Props {
  agents: Agent[];
  onSelect: (agent: Agent) => void;
}

const AgentList: React.FC<Props> = ({ agents, onSelect }) => {
  if (!agents.length) return <AgentEmpty />;
  return (
    <ul className="divide-y divide-gray-200">
      {agents.map(agent => (
        <li
          key={agent.id}
          className="p-4 hover:bg-gray-50 cursor-pointer"
          onClick={() => onSelect(agent)}
        >
          <div className="font-semibold">{agent.first_name} {agent.last_name}</div>
          <div className="text-sm text-gray-500">{agent.email}</div>
        </li>
      ))}
    </ul>
  );
};

export default AgentList; 