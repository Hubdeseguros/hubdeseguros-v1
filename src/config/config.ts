// Configuración de la aplicación
export const isDevelopment = process.env.NODE_ENV === 'development';

export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:3000/api' 
  : 'https://api.hubseguros.com';

export const APP_NAME = 'HubSeguros';

export const ROLES = {
  ADMIN: 'ADMIN',
  AGENCIA: 'AGENCIA',
  AGENTE: 'AGENTE',
  CLIENTE: 'CLIENTE'
} as const;
