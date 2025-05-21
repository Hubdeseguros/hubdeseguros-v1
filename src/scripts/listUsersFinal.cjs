const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://iaccbdtawauxhowxlgzu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhY2NiZHRhd2F1eGhvd3hsZ3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MDQ2MjMsImV4cCI6MjA2MzI4MDYyM30.2hc1OtgOI8wD4xoXpQOqClZw7VrYQxG8RK6cwDFYNhw';

// Inicializar el cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  }
});

async function listUsers() {
  try {
    // Obtener todos los usuarios
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Error al obtener usuarios:', usersError.message);
      return;
    }

    if (!users) {
      console.log('No hay usuarios registrados');
      return;
    }

    console.log('\n=== Usuarios Registrados ===');
    console.log(`Total de usuarios: ${users.length}\n`);

    for (const user of users) {
      console.log(`Usuario:`);
      console.log(`- Email: ${user.email}`);
      console.log(`- ID: ${user.id}`);
      console.log(`- Roles:`);
      
      // Obtener roles del usuario
      const { data: userMetadata, error: metadataError } = 
        await supabase.auth.admin.getUserById(user.id);

      if (metadataError) {
        console.log(`  - Error al obtener metadata: ${metadataError.message}`);
      } else if (userMetadata?.user?.user_metadata?.role) {
        console.log(`  - Rol: ${userMetadata.user.user_metadata.role}`);
      } else {
        console.log('  - Sin rol asignado');
      }

      console.log('');
    }
  } catch (error) {
    console.error('Error general:', error);
  }
}

// Ejecutar la función
listUsers();
