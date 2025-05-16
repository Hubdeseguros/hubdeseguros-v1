import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Componente que redirige automáticamente de la página de listado 
 * de clientes al CRM
 */
const ClientsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir inmediatamente a CRM
    navigate('/clientes/crm', { replace: true });
  }, [navigate]);

  return null; // No renderizamos nada, solo redirigimos
};

export default ClientsPage;
