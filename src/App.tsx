
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./hooks/useAuth";
import GlobalEffects from "@/components/GlobalEffects";
import { MainLayout } from "./layouts/MainLayout";
import { Toaster } from "@/components/ui/toaster";

// Importar estilos para ocultar la opción de listado de clientes
// import "./styles/hideClientList.css"; // <-- Esta línea ha sido eliminada porque el archivo no existe

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <GlobalEffects />
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
