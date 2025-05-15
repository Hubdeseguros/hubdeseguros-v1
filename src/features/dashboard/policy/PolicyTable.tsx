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

const statusConfig = {
  Activa: { color: 'green', icon: <CheckCircle className="text-green-600 w-4 h-4" /> },
  Vencida: { color: 'red', icon: <XCircle className="text-red-600 w-4 h-4" /> }
  // Puedes agregar más estados aquí si los agregas en mockPolicies
};

export const PolicyTable: React.FC = () => {
  const [policies] = useState<Policy[]>(mockPolicies);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Número</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {policies.map((policy) => {
          const config = statusConfig[policy.status] || { color: 'gray', icon: null };
          return (
            <TableRow key={policy.id}>
              <TableCell>{policy.number}</TableCell>
              <TableCell>{policy.client}</TableCell>
              <TableCell>{policy.type}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-${config.color}-100 text-${config.color}-700`}>
                  {config.icon}
                  {policy.status}
                </span>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
} 