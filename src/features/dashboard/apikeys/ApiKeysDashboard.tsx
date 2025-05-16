import React from "react"
import { Card } from "@/components/ui/card"
import { ApiKeysTable } from "./ApiKeysTable"
import { mockApiKeys } from "./mockApiKeys"

export const ApiKeysDashboard: React.FC = () => {
  const total = mockApiKeys.length
  const activos = mockApiKeys.filter((k) => k.status === "Activo").length
  const inactivos = mockApiKeys.filter((k) => k.status === "Inactivo").length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total de Claves</div>
          <div className="text-2xl font-bold">{total}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Activas</div>
          <div className="text-2xl font-bold">{activos}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Inactivas</div>
          <div className="text-2xl font-bold">{inactivos}</div>
        </Card>
      </div>
      <ApiKeysTable />
    </div>
  )
} 