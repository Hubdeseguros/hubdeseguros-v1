import React, { useState } from "react"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Policy, mockPolicies } from "./mockPolicies"
import { PolicyForm } from "./PolicyForm"
import { toast } from "@/components/ui/use-toast"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { usePolicies } from "./usePolicies"

const statusConfig = {
  Activa: { color: 'green', icon: <CheckCircle className="text-green-600 w-4 h-4" /> },
  Vencida: { color: 'red', icon: <XCircle className="text-red-600 w-4 h-4" /> }
  // Puedes agregar más estados aquí si los agregas en mockPolicies
};

export const PolicyTable: React.FC = () => {
  const { policies, loading, error, deletePolicy } = usePolicies();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Número</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {policies.map((policy) => (
          <TableRow key={policy.id}>
            <TableCell>{policy.number}</TableCell>
            <TableCell>{policy.client}</TableCell>
            <TableCell>{policy.type}</TableCell>
            <TableCell>{policy.status}</TableCell>
            <TableCell>
              <Button variant="destructive" onClick={() => deletePolicy(policy.id)}>
                Eliminar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 