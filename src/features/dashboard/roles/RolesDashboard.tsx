import React from "react"
import { Card } from "@/components/ui/card"
import { RolesTable } from "./RolesTable"
import { mockRoles } from "./mockRoles"

export const RolesDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total de Roles</div>
          <div className="text-2xl font-bold">{mockRoles.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Permisos Disponibles</div>
          <div className="text-2xl font-bold">{mockRoles.map(r => r.permissions.length).reduce((a, b) => a + b, 0)}</div>
        </Card>
      </div>
      <RolesTable />
    </div>
  )
} 