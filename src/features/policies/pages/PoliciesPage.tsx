import React from "react";
import { Box, Breadcrumbs, Container, Link, Typography } from "@mui/material";
import { Home } from "@mui/icons-material";
import PoliciesTable from "../components/PoliciesTable";

const PoliciesPage: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
            href="/"
          >
            <Home sx={{ mr: 0.5 }} fontSize="inherit" />
            Inicio
          </Link>
          <Typography color="text.primary">Pólizas</Typography>
        </Breadcrumbs>
        <Typography variant="h4" component="h1" sx={{ mt: 2, mb: 4 }}>
          Gestión de Pólizas
        </Typography>

        <Box sx={{ mt: 3 }}>
          <PoliciesTable />
        </Box>
      </Box>
    </Container>
  );
};

export default PoliciesPage;
