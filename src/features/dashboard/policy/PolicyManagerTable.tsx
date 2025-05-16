
import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  ArrowUpDown,
  ChevronDown,
  Columns,
  File,
  FilePlus,
  Filter,
  Mail,
  Trash2,
  List as ListIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

// Tipos (puedes adaptar luego con los datos reales del backend)
interface Policy {
  id: string;
  policyType: string;
  policyNumber: string;
  insurer: string;
  branch: string;
  risk: string;
  client: string;
  document: string;
  seller: string;
  paymentStatus: string;
  hasClaims: boolean;
  renewable: boolean;
  netPremium: number;
  totalPremium: number;
  policyStatus: string;
  startDate: string;
  endDate: string;
  createdBy: string;
}

const DEFAULT_COLUMNS = [
  'policyType', 'policyNumber', 'insurer', 'branch', 'risk', 'client', 'document',
  'seller', 'paymentStatus', 'hasClaims', 'renewable', 'netPremium', 'totalPremium',
  'policyStatus', 'startDate', 'endDate', 'createdBy', 'actions'
];

const POLICY_STATUS_OPTIONS = [
  { value: "Activa", label: "Activa" },
  { value: "Vencida", label: "Vencida" },
  { value: "Pendiente", label: "Pendiente" },
];

const DUMMY_POLICIES: Policy[] = [
  {
    id: "1", policyType: "Automóvil", policyNumber: "12345", insurer: "Seguros Bolívar",
    branch: "Vehículos", risk: "Todo Riesgo", client: "Juan Pérez", document: "12345678",
    seller: "Ana García", paymentStatus: "Pagado", hasClaims: false, renewable: true,
    netPremium: 1000, totalPremium: 1200, policyStatus: "Activa",
    startDate: "2024-01-01", endDate: "2024-12-31", createdBy: "Admin"
  },
  {
    id: "2", policyType: "Hogar", policyNumber: "67890", insurer: "Allianz",
    branch: "Residencial", risk: "Básico", client: "María López", document: "98765432",
    seller: "Carlos Rodríguez", paymentStatus: "Pendiente", hasClaims: true, renewable: false,
    netPremium: 500, totalPremium: 600, policyStatus: "Vencida",
    startDate: "2023-01-01", endDate: "2023-12-31", createdBy: "Admin"
  },
  {
    id: "3", policyType: "Vida", policyNumber: "11223", insurer: "Sura",
    branch: "Individual", risk: "Accidentes", client: "Pedro Ramirez", document: "54321678",
    seller: "Laura Martinez", paymentStatus: "Pagado", hasClaims: false, renewable: true,
    netPremium: 800, totalPremium: 950, policyStatus: "Activa",
    startDate: "2024-03-01", endDate: "2025-02-28", createdBy: "Admin"
  },
];

// Vacío visual
const EmptyState = () => (
  <div className="flex flex-col items-center py-16">
    <ListIcon className="w-14 h-14 text-gray-400 mb-4" />
    <h2 className="text-xl font-semibold mb-2">No hay pólizas registradas</h2>
    <p className="text-gray-500 mb-1">
      Comienza creando una póliza o importa desde Excel.
    </p>
  </div>
);

const PolicyManagerTable: React.FC = () => {
  const [policies, setPolicies] = useState<Policy[]>(DUMMY_POLICIES);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<{ status?: string }>({});
  const [selectedColumns] = useState(DEFAULT_COLUMNS);
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // --- Filtros simples (Status, search)
  const filtered = useMemo(() => {
    let filtered = [...policies];
    if (filters.status && filters.status !== "") {
      filtered = filtered.filter(p => p.policyStatus === filters.status);
    }
    if (searchTerm) {
      filtered = filtered.filter(p =>
        Object.values(p).some(val =>
          typeof val === "string" && val.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    return filtered;
  }, [policies, searchTerm, filters]);

  // --- Paginación
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  // --- Selección de pólizas
  const handleSelectAll = (checked: boolean) => {
    setSelectedPolicies(checked ? filtered.map(p => p.id) : []);
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedPolicies(checked
      ? [...selectedPolicies, id]
      : selectedPolicies.filter(pid => pid !== id));
  };

  // --- Acciones dummy
  const handleBulkDelete = () => {
    setPolicies(prev => prev.filter(p => !selectedPolicies.includes(p.id)));
    setSelectedPolicies([]);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-200 max-w-7xl mx-auto mt-8 min-h-[500px]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-blue-900">Gestión de Pólizas</h2>
        <div className="flex flex-wrap gap-2">
          <Input
            type="text"
            placeholder="Buscar póliza..."
            className="sm:text-sm min-w-[200px]"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={filters.status || ""}
            onChange={e => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">Todos los estados</option>
            {POLICY_STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Exportar <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <File className="mr-2 h-4 w-4" />
                Exportar a Excel
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FilePlus className="mr-2 h-4 w-4" />
                Exportar pólizas/Anexos a Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="destructive" onClick={handleBulkDelete} disabled={selectedPolicies.length === 0}>
            <Trash2 className="mr-2 h-4 w-4" /> Eliminar seleccionadas
          </Button>
        </div>
      </div>

      <div className="mt-6 relative">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Checkbox
                      checked={selectedPolicies.length === currentItems.length && currentItems.length > 0}
                      onCheckedChange={checked => handleSelectAll(!!checked)}
                      aria-label="Seleccionar todas"
                    />
                  </TableHead>
                  {selectedColumns.map(col => (
                    col !== "actions" &&
                      <TableHead key={col} className="min-w-[100px] text-xs">
                        {col === "policyType" && "Tipo"}
                        {col === "policyNumber" && "Nro Póliza"}
                        {col === "insurer" && "Aseguradora"}
                        {col === "branch" && "Ramo"}
                        {col === "risk" && "Riesgo"}
                        {col === "client" && "Cliente"}
                        {col === "document" && "Documento"}
                        {col === "seller" && "Vendedor"}
                        {col === "paymentStatus" && "Estado Cobros"}
                        {col === "hasClaims" && "Siniestros"}
                        {col === "renewable" && "Renovable"}
                        {col === "netPremium" && "Prima Neta"}
                        {col === "totalPremium" && "Prima Total"}
                        {col === "policyStatus" && "Estado"}
                        {col === "startDate" && "Inicio"}
                        {col === "endDate" && "Fin"}
                        {col === "createdBy" && "Creado por"}
                      </TableHead>
                  ))}
                  <TableHead>Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map(policy => (
                  <TableRow key={policy.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedPolicies.includes(policy.id)}
                        onCheckedChange={checked => handleSelectOne(policy.id, !!checked)}
                        aria-label="Seleccionar póliza"
                      />
                    </TableCell>
                    {selectedColumns.map(col =>
                      col !== "actions" && (
                        <TableCell key={col} className="whitespace-nowrap text-xs">
                          {col === "hasClaims" || col === "renewable"
                            ? (policy[col as keyof Policy] ? "Sí" : "No")
                            : (policy[col as keyof Policy] as any)}
                        </TableCell>
                      ))}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Columns className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem onClick={handleBulkDelete}>Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Paginación visual sencilla */}
        {filtered.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center gap-2 mt-6">
            {[...Array(totalPages)].map((_, idx) => (
              <Button
                key={idx}
                variant={currentPage === idx + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyManagerTable;
