// Using the current supabase client
import { supabase } from '@/integrations/supabase/client';

// Helper to generate a simple temporary password
function generateTempPassword(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export interface CreateUserData {
  name: string;
  email: string;
  phone: string;
  documentType: string;
  documentNumber: string;
  role: 'PROMOTER' | 'CLIENT';
  agenciaId?: string;
  promoterId?: string;
}

export async function createPromoter(userData: Omit<CreateUserData, 'role'>) {
  const tempPassword = generateTempPassword();

  // 1. Crear usuario en Auth (Supabase Auth)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: userData.email,
    password: tempPassword,
    options: {
      data: {
        name: userData.name,
        phone: userData.phone,
        document_number: userData.documentNumber,
        document_type: userData.documentType,
        roles: ['PROMOTER'],
        must_change_password: true,
      },
    },
  });

  if (authError) {
    console.error('Error en autenticación:', authError);
    throw new Error('Error al crear el usuario en autenticación');
  }

  if (!authData.user) {
    throw new Error('No se pudo obtener el usuario creado');
  }

  const userId = authData.user.id;
  const nombre = userData.name || '';
  const email = userData.email;
  const agencia_id = userData.agenciaId || null;

  // 2. Crear registro en 'promotores'
  const { error: promotorError } = await supabase.from('promotores').insert([
    {
      id: userId,
      nombre,
      email,
      agencia_id,
      // creado_por: podría ser incluido si tienes el contexto
    }
  ]);
  if (promotorError) {
    console.error('Error al crear promotor:', promotorError);
    throw new Error('Error al crear el registro del promotor');
  }

  // 3. Enviar correo con la contraseña temporal
  // Aquí iría la lógica para enviar el correo con la contraseña temporal

  return { userId };
}

export async function createClient(userData: Omit<CreateUserData, 'role'>) {
  const tempPassword = generateTempPassword();

  // 1. Crear usuario en Auth (Supabase Auth)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: userData.email,
    password: tempPassword,
    options: {
      data: {
        name: userData.name,
        phone: userData.phone,
        document_number: userData.documentNumber,
        document_type: userData.documentType,
        roles: ['CLIENT'],
        must_change_password: true,
      },
    },
  });

  if (authError) {
    console.error('Error en autenticación:', authError);
    throw new Error('Error al crear el cliente en autenticación');
  }

  if (!authData.user) {
    throw new Error('No se pudo obtener el cliente creado');
  }

  const userId = authData.user.id;
  const nombre = userData.name || '';
  const email = userData.email;
  const promotor_id = userData.promoterId || null;

  // 2. Crear registro en 'clientes'
  const { error: clienteError } = await supabase.from('clientes').insert([
    {
      id: userId,
      nombre,
      email,
      promotor_id,
      // creado_por: podría ser incluido si tienes el contexto
    }
  ]);
  if (clienteError) {
    console.error('Error al crear cliente:', clienteError);
    throw new Error('Error al crear el registro de cliente');
  }

  // 3. Enviar correo con la contraseña temporal
  // Aquí iría la lógica para enviar el correo con la contraseña temporal

  return { userId };
}

// Obtener promotores según agencia
export async function getPromoters(agenciaId: string) {
  const { data, error } = await supabase
    .from('promotores')
    .select('*')
    .eq('agencia_id', agenciaId);

  if (error) {
    console.error('Error al obtener promotores:', error);
    throw new Error('Error al obtener la lista de promotores');
  }

  return data || [];
}

// Obtener clientes según promotor
export async function getClientsByPromoter(promoterId: string) {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('promotor_id', promoterId);

  if (error) {
    console.error('Error al obtener clientes:', error);
    throw new Error('Error al obtener la lista de clientes');
  }

  return data || [];
}
