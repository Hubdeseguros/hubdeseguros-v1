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
import {
  Add,
  Edit,
  Visibility,
  FilterList,
  Assignment,
} from "@mui/icons-material";

interface Claim {
  id: string;
  number: string;
  policyNumber: string;
  client: string;
  type: string;
  date: string;
  status: "pending" | "in_progress" | "approved" | "rejected" | "closed";
  amount: number;
}

const mockClaims: Claim[] = [
  {
    id: "1",
    number: "SIN-2025-0001",
    policyNumber: "POL-2025-0001",
    client: "Juan Pérez",
    type: "Accidente de tránsito",
    date: "2025-04-10",
    status: "pending",
    amount: 3500.0,
  },
  {
    id: "2",
    number: "SIN-2025-0002",
    policyNumber: "POL-2024-0095",
    client: "Roberto Gómez",
    type: "Robo parcial",
    date: "2025-04-05",
    status: "in_progress",
    amount: 1200.0,
  },
  {
    id: "3",
    number: "SIN-2025-0003",
    policyNumber: "POL-2025-0003",
    client: "Carlos Rodríguez",
    type: "Daños por agua",
    date: "2025-03-28",
    status: "approved",
    amount: 2800.5,
  },
  {
    id: "4",
    number: "SIN-2025-0004",
    policyNumber: "POL-2025-0004",
    client: "Ana Martínez",
    type: "Hospitalización",
    date: "2025-03-15",
    status: "closed",
    amount: 5400.75,
  },
  {
    id: "5",
    number: "SIN-2025-0005",
    policyNumber: "POL-2025-0002",
    client: "María López",
    type: "Fallecimiento",
    date: "2025-02-20",
    status: "rejected",
    amount: 50000.0,
  },
  {
    id: "6",
    number: "SIN-2025-0006",
    policyNumber: "POL-2024-0087",
    client: "Laura Sánchez",
    type: "Cancelación de viaje",
    date: "2025-01-05",
    status: "approved",
    amount: 750.25,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "warning";
    case "in_progress":
      return "info";
    case "approved":
      return "success";
    case "rejected":
      return "error";
    case "closed":
      return "default";
    default:
      return "default";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "Pendiente";
    case "in_progress":
      return "En proceso";
    case "approved":
      return "Aprobado";
    case "rejected":
      return "Rechazado";
    case "closed":
      return "Cerrado";
    default:
      return status;
  }
};

export const ClaimsTable: React.FC = () => {
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
            Siniestros
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
              Nuevo Siniestro
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="tabla de siniestros">
            <TableHead>
              <TableRow>
                <TableCell>Número</TableCell>
                <TableCell>Póliza</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockClaims
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((claim) => (
                  <TableRow key={claim.id} hover>
                    <TableCell>{claim.number}</TableCell>
                    <TableCell>{claim.policyNumber}</TableCell>
                    <TableCell>{claim.client}</TableCell>
                    <TableCell>{claim.type}</TableCell>
                    <TableCell>{claim.date}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(claim.status)}
                        color={getStatusColor(claim.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>${claim.amount.toFixed(2)}</TableCell>
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
                      <IconButton size="small" color="info" title="Documentos">
                        <Assignment fontSize="small" />
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
          count={mockClaims.length}
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

export default ClaimsTable;
