import React from "react"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { usePolicies } from "./usePolicies"

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