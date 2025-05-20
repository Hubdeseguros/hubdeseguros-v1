import { createClient } from '@supabase/supabase-js';

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
export const supabase = createClient(supabaseUrl, supabaseAnonKey, options);

console.log('Supabase inicializado con URL:', supabaseUrl);

