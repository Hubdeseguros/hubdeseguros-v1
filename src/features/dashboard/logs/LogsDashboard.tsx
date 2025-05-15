import React from "react"
import { Card } from "@/components/ui/card"
import { LogsTable } from "./LogsTable"
import { mockLogs } from "./mockLogs"

export const LogsDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total de Logs</div>
          <div className="text-2xl font-bold">{mockLogs.length}</div>
        </Card>
      </div>
      <LogsTable />
    </div>
  )
} 