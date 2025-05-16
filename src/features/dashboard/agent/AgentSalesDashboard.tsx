import React from "react";
import { SalesTable } from "./SalesTable";

const AgentSalesDashboard: React.FC = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Gestión de Ventas - Aseguradora</h1>
    <SalesTable />
  </div>
);

export default AgentSalesDashboard;
