import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ClientList = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <p className="text-gray-500">Aquí se mostrará la lista de clientes.</p>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-500">Esta será la sección donde se mostrarán los clientes registrados.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientList;
