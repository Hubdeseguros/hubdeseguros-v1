const { createClient } = require('@supabase/supabase-js');

// Obtener las variables de entorno
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// Verificar que las variables estén definidas
if (!supabaseUrl) {
  console.error('VITE_SUPABASE_URL no está definida');
  process.exit(1);
}

if (!supabaseAnonKey) {
  console.error('VITE_SUPABASE_ANON_KEY no está definida');
  process.exit(1);
}

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
