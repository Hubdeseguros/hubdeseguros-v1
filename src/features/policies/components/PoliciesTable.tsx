import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Add, Edit, Delete, Visibility, FilterList } from "@mui/icons-material";

interface Policy {
  id: string;
  number: string;
  client: string;
  type: string;
  company: string;
  startDate: string;
  endDate: string;
  status: "active" | "pending" | "expired" | "canceled";
  premium: number;
}

const mockPolicies: Policy[] = [
  {
    id: "1",
    number: "POL-2025-0001",
    client: "Juan Pérez",
    type: "Auto",
    company: "Seguros Atlántica",
    startDate: "2025-01-15",
    endDate: "2026-01-15",
    status: "active",
    premium: 1250.5,
  },
  {
    id: "2",
    number: "POL-2025-0002",
    client: "María López",
    type: "Vida",
    company: "Protección Total",
    startDate: "2025-02-10",
    endDate: "2026-02-10",
    status: "active",
    premium: 350.0,
  },
  {
    id: "3",
    number: "POL-2025-0003",
    client: "Carlos Rodríguez",
    type: "Hogar",
    company: "Seguros Confianza",
    startDate: "2025-03-05",
    endDate: "2026-03-05",
    status: "pending",
    premium: 520.75,
  },
  {
    id: "4",
    number: "POL-2025-0004",
    client: "Ana Martínez",
    type: "Salud",
    company: "MediSeguro",
    startDate: "2025-01-20",
    endDate: "2026-01-20",
    status: "active",
    premium: 980.25,
  },
  {
    id: "5",
    number: "POL-2024-0095",
    client: "Roberto Gómez",
    type: "Auto",
    company: "Seguros Atlántica",
    startDate: "2024-12-10",
    endDate: "2025-12-10",
    status: "active",
    premium: 1450.0,
  },
  {
    id: "6",
    number: "POL-2024-0087",
    client: "Laura Sánchez",
    type: "Viaje",
    company: "Protección Total",
    startDate: "2024-11-15",
    endDate: "2025-05-15",
    status: "expired",
    premium: 245.5,
  },
  {
    id: "7",
    number: "POL-2024-0076",
    client: "Miguel Torres",
    type: "Responsabilidad Civil",
    company: "Seguros Confianza",
    startDate: "2024-10-05",
    endDate: "2025-10-05",
    status: "canceled",
    premium: 780.25,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "success";
    case "pending":
      return "warning";
    case "expired":
      return "error";
    case "canceled":
      return "default";
    default:
      return "default";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "active":
      return "Activa";
    case "pending":
      return "Pendiente";
    case "expired":
      return "Vencida";
    case "canceled":
      return "Cancelada";
    default:
      return status;
  }
};

export const PoliciesTable: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" component="h2">
            Pólizas
          </Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              sx={{ mr: 1 }}
            >
              Filtrar
            </Button>
            <Button variant="contained" startIcon={<Add />} color="primary">
              Nueva Póliza
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="tabla de pólizas">
            <TableHead>
              <TableRow>
                <TableCell>Número</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Aseguradora</TableCell>
                <TableCell>Fecha Inicio</TableCell>
                <TableCell>Fecha Fin</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Prima</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockPolicies
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((policy) => (
                  <TableRow key={policy.id} hover>
                    <TableCell>{policy.number}</TableCell>
                    <TableCell>{policy.client}</TableCell>
                    <TableCell>{policy.type}</TableCell>
                    <TableCell>{policy.company}</TableCell>
                    <TableCell>{policy.startDate}</TableCell>
                    <TableCell>{policy.endDate}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(policy.status)}
                        color={getStatusColor(policy.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>${policy.premium.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        title="Ver detalles"
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="primary" title="Editar">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" title="Eliminar">
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={mockPolicies.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count}`
          }
        />
      </CardContent>
    </Card>
  );
};

export default PoliciesTable;
