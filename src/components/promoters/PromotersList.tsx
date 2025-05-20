import React from 'react';
// Corregir import (de "@/hooks/use-auth" a "@/hooks/useAuth")
import { useAuth } from '@/hooks/useAuth';

const PromotersList = () => {
  const { user } = useAuth();
  
  // Datos de ejemplo para la lista de promotores
  const promoters = [
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan.perez@example.com',
      phone: '+1234567890',
      status: 'Activo',
      clients: 24,
      policies: 36
    },
    {
      id: '2',
      name: 'María González',
      email: 'maria.gonzalez@example.com',
      phone: '+0987654321',
      status: 'Activo',
      clients: 18,
      policies: 27
    },
    {
      id: '3',
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@example.com',
      phone: '+1122334455',
      status: 'Inactivo',
      clients: 12,
      policies: 15
    }
  ];

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Promotores</h2>
        <p className="text-sm text-gray-500">Gestión de promotores activos</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clientes
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pólizas
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {promoters.map((promoter) => (
              <tr key={promoter.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-800 font-medium">{promoter.name.charAt(0)}</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{promoter.name}</div>
                      <div className="text-sm text-gray-500">ID: {promoter.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{promoter.email}</div>
                  <div className="text-sm text-gray-500">{promoter.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    promoter.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {promoter.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {promoter.clients}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {promoter.policies}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href="#" className="text-blue-600 hover:text-blue-900 mr-3">Ver</a>
                  <a href="#" className="text-blue-600 hover:text-blue-900 mr-3">Editar</a>
                  <a href="#" className="text-red-600 hover:text-red-900">Eliminar</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">3</span> de <span className="font-medium">3</span> promotores
          </div>
          <div>
            <button
              type="button"
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Ver todos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotersList;
