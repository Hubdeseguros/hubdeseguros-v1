import React from "react"
import { Card } from "@/components/ui/card"
import { PolicyTable } from "./PolicyTable"
import { mockPolicies } from "./mockPolicies"
import { useNavigate } from "react-router-dom"

export const PolicyDashboard: React.FC = () => {
  const total = mockPolicies.length
  const activas = mockPolicies.filter((p) => p.status === "Activa").length
  const vencidas = mockPolicies.filter((p) => p.status === "Vencida").length
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card
          className="p-4 cursor-pointer hover:shadow"
          onClick={() => navigate("/dashboard/policy")}
        >
          <div className="text-sm text-muted-foreground">Total de Pólizas</div>
          <div className="text-2xl font-bold">{total}</div>
        </Card>
        <Card
          className="p-4 cursor-pointer hover:shadow"
          onClick={() => navigate("/dashboard/policy?status=Activa")}
        >
          <div className="text-sm text-muted-foreground">Pólizas Activas</div>
          <div className="text-2xl font-bold">{activas}</div>
        </Card>
        <Card
          className="p-4 cursor-pointer hover:shadow"
          onClick={() => navigate("/dashboard/policy?status=Vencida")}
        >
          <div className="text-sm text-muted-foreground">Pólizas Vencidas</div>
          <div className="text-2xl font-bold">{vencidas}</div>
        </Card>
      </div>
      <PolicyTable />
    </div>
  )
} 