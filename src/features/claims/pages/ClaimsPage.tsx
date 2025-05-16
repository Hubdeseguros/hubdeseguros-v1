import React from "react";
import { Box, Breadcrumbs, Container, Link, Typography } from "@mui/material";
import { Home } from "@mui/icons-material";
import ClaimsTable from "../components/ClaimsTable";

const ClaimsPage: React.FC = () => {
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
          <Typography color="text.primary">Siniestros</Typography>
        </Breadcrumbs>
        <Typography variant="h4" component="h1" sx={{ mt: 2, mb: 4 }}>
          Gestión de Siniestros
        </Typography>

        <Box sx={{ mt: 3 }}>
          <ClaimsTable />
        </Box>
      </Box>
    </Container>
  );
};

export default ClaimsPage;
