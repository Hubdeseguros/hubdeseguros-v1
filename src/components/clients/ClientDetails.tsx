
import React from 'react';
import { Client } from '@/features/clients/types';

interface Props {
  client: Client;
}

const ClientDetails: React.FC<Props> = ({ client }) => (
  <div className="p-4 bg-white rounded shadow">
    <h2 className="text-xl font-bold mb-2">{client.first_name} {client.last_name}</h2>
    <div className="text-gray-700">Email: {client.email}</div>
    <div className="text-gray-700">Teléfono: {client.phone}</div>
    <div className="text-gray-700">Documento: {client.document_number} ({client.document_type})</div>
    <div className="text-gray-700">
      Dirección: {client.address
        ? `${client.address.street}, ${client.address.city}, ${client.address.state}, ${client.address.postalCode}, ${client.address.country}`
        : 'No especificada'}
    </div>
    <div className="text-gray-700">
      Estado: {typeof client.status === 'string'
        ? client.status
        : client.status?.name || 'No especificado'}
    </div>
    <div className="text-gray-500 text-xs mt-2">Creado: {client.created_at}</div>
    <div className="text-gray-500 text-xs">Actualizado: {client.updated_at}</div>
  </div>
);

export default ClientDetails;
