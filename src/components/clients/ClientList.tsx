import React from "react";
import { Client } from "@/features/clients/types";
import ClientEmpty from "./ClientEmpty";

interface Props {
  clients: Client[];
  onSelect: (client: Client) => void;
}

const ClientList: React.FC<Props> = ({ clients, onSelect }) => {
  if (!clients.length) return <ClientEmpty />;
  return (
    <ul className="divide-y divide-gray-200">
      {clients.map((client) => (
        <li
          key={client.id}
          className="p-4 hover:bg-gray-50 cursor-pointer"
          onClick={() => onSelect(client)}
        >
          <div className="font-semibold">
            {client.first_name} {client.last_name}
          </div>
          <div className="text-sm text-gray-500">{client.email}</div>
        </li>
      ))}
    </ul>
  );
};

export default ClientList;
