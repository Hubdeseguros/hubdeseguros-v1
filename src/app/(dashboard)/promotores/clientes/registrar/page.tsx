'use client';

import { RegisterClientForm } from '@/components/clients/RegisterClientForm';

export default function RegisterClientPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Registrar Nuevo Cliente</h1>
        <p className="text-muted-foreground">
          Completa el formulario para registrar un nuevo cliente en el sistema.
        </p>
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow">
        <RegisterClientForm />
      </div>
    </div>
  );
}
