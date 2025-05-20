import { createClient } from '@supabase/supabase-js';

// Usamos un patrón singleton para evitar múltiples instancias
let supabaseInstance: ReturnType<typeof createClient> | null = null;

/**
 * Obtiene una instancia única del cliente de Supabase
 */
export const getSupabase = () => {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Obtener las variables de entorno
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Verificar que las variables estén definidas
  if (!supabaseUrl) {
    console.error('VITE_SUPABASE_URL no está definida');
    throw new Error('VITE_SUPABASE_URL no está definida');
  }

  if (!supabaseAnonKey) {
    console.error('VITE_SUPABASE_ANON_KEY no está definida');
    throw new Error('VITE_SUPABASE_ANON_KEY no está definida');
  }

  // Inicializar el cliente de Supabase
  const options = {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    }
  };

  // Crear el cliente de Supabase
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, options);
  console.log('Supabase inicializado con URL:', supabaseUrl);
  
  return supabaseInstance;
};

// Exportamos una instancia única para uso en toda la aplicación
export const supabase = getSupabase();

