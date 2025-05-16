import React from "react"
import { Card } from "@/components/ui/card"
import { PolicyTable } from "./PolicyTable"
import { useNavigate } from "react-router-dom"

export const PolicyDashboard: React.FC = () => {
  // Usa valores ficticios por ahora, o bien calcula con los datos reales si están disponibles
  const total = 0; // Cambia según tu fuente real de datos en el futuro
  const activas = 0;
  const vencidas = 0;
  const navigate = useNavigate();

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
