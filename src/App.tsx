import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./hooks/useAuth.tsx";
import GlobalEffects from "@/components/GlobalEffects";
import React from "react";

const queryClient = new QueryClient();

interface ErrorFallbackProps {
  error: Error | null;
}

const ErrorFallback = ({ error }: ErrorFallbackProps) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-700 px-8">
    <h2 className="text-3xl font-bold mb-2">¡Algo salió mal!</h2>
    <p className="mb-6">Se ha producido un error al cargar la aplicación.</p>
    <pre className="bg-red-100 p-4 rounded-md max-w-xl overflow-auto">
      {error ? error.toString() : "Error desconocido"}
    </pre>
    <button
      className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
      onClick={() => window.location.reload()}
    >
      Recargar
    </button>
  </div>
);

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Podrías enviar el error a un servicio externo aquí
    console.error("ErrorBoundary atrapó un error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <GlobalEffects />
              <AppRoutes />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
