import { UserPlus, Users, FileText, AlertTriangle, TrendingUp, Search, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SummaryCard } from "@/components/dashboard/SummaryCard";



export default function ClientesVacio() {
  // Datos de ejemplo para las tarjetas de resumen
  const summaryData = [
    {
      title: "Total Clientes",
      value: "0",
      icon: <Users className="w-5 h-5 text-blue-600" />,
      trend: "neutral" as const,
      trendValue: "Sin datos previos"
    },
    {
      title: "Pólizas Activas",
      value: "0",
      icon: <FileText className="w-5 h-5 text-green-600" />,
      trend: "neutral" as const,
      trendValue: "Sin datos previos"
    },
    {
      title: "Siniestros",
      value: "0",
      icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
      trend: "neutral" as const,
      trendValue: "Sin datos previos"
    },
    {
      title: "Crecimiento",
      value: "0%",
      icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
      trend: "neutral" as const,
      trendValue: "Sin datos previos"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-sm text-gray-500">
            Gestiona tus clientes y su información relevante
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <UserPlus className="w-4 h-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryData.map((item, index) => (
          <SummaryCard
            key={index}
            title={item.title}
            value={item.value}
            icon={item.icon}
            trend={item.trend}
            trendValue={item.trendValue}
          />
        ))}
      </div>

      {/* Contenido principal */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar clientes..."
                className="pl-8 w-full"
              />
            </div>
            <div className="flex space-x-2 w-full sm:w-auto">
              <Button variant="outline" className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Cliente
              </Button>
            </div>
          </div>

          <div className="border rounded-lg p-8 text-center">
            <UserPlus className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">¡Aún no tienes clientes!</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Agrega tu primer cliente y comienza a construir tu cartera. Gestiona fácilmente sus pólizas y siniestros desde aquí.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <UserPlus className="w-4 h-4 mr-2" />
              Agregar Cliente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

