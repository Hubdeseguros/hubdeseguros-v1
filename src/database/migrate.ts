import { supabase } from './config';

async function createTables() {
  try {
    // Crear tablas
    await supabase.rpc('create_agencies_table', {});
    await supabase.rpc('create_roles_table', {});
    await supabase.rpc('create_users_table', {});
    await supabase.rpc('create_users_agency_table', {});
    await supabase.rpc('create_promoters_table', {});
    await supabase.rpc('create_clients_table', {});
    await supabase.rpc('create_policies_table', {});
    await supabase.rpc('create_payments_table', {});
    await supabase.rpc('create_notifications_table', {});
    await supabase.rpc('create_audit_log_table', {});
    await supabase.rpc('create_password_resets_table', {});

    // Insertar roles iniciales
    await supabase.rpc('insert_initial_roles', {});

    console.log('Migración completada exitosamente');
  } catch (error) {
    console.error('Error en la migración:', error);
  }
}

createTables();
