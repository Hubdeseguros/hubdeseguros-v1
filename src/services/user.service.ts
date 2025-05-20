import { createClient } from '@/utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient();

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
  const tempPassword = uuidv4().substring(0, 12);
  
  // 1. Crear usuario en Auth
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

  // 2. Crear perfil en la tabla de perfiles
  const { error: profileError } = await supabase.from('profiles').insert([
    {
      id: authData.user.id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      document_type: userData.documentType,
      document_number: userData.documentNumber,
      role: 'PROMOTER',
      agencia_id: userData.agenciaId,
    },
  ]);

  if (profileError) {
    console.error('Error al crear perfil:', profileError);
    throw new Error('Error al crear el perfil del promotor');
  }

  // 3. Enviar correo con la contraseña temporal
  // Aquí iría la lógica para enviar el correo con la contraseña temporal
  
  return { userId: authData.user.id };
}

export async function createClient(userData: Omit<CreateUserData, 'role'>) {
  const tempPassword = uuidv4().substring(0, 12);
  
  // 1. Crear usuario en Auth
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

  // 2. Crear perfil en la tabla de perfiles
  const { error: profileError } = await supabase.from('profiles').insert([
    {
      id: authData.user.id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      document_type: userData.documentType,
      document_number: userData.documentNumber,
      role: 'CLIENT',
      promoter_id: userData.promoterId,
    },
  ]);

  if (profileError) {
    console.error('Error al crear perfil de cliente:', profileError);
    throw new Error('Error al crear el perfil del cliente');
  }

  // 3. Enviar correo con la contraseña temporal
  // Aquí iría la lógica para enviar el correo con la contraseña temporal
  
  return { userId: authData.user.id };
}

export async function getPromoters(agenciaId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'PROMOTER')
    .eq('agencia_id', agenciaId);

  if (error) {
    console.error('Error al obtener promotores:', error);
    throw new Error('Error al obtener la lista de promotores');
  }

  return data || [];
}

export async function getClientsByPromoter(promoterId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'CLIENT')
    .eq('promoter_id', promoterId);

  if (error) {
    console.error('Error al obtener clientes:', error);
    throw new Error('Error al obtener la lista de clientes');
  }

  return data || [];
}
