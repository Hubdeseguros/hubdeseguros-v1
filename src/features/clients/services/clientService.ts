import { supabase } from '@/integrations/supabase/client';
import type { 
  Client, 
  ClientFormData, 
  ClientFilters,
  ClientStatus,
  ClientCategory,
  ClientAddress,
  ClientContact,
  ClientDocument,
  ClientPolicy,
  DocumentType
} from '../types/client.types';

// Map database row to typed Client
function mapDbToClient(row: any): Client {
  // Validar que el tipo de documento sea uno de los permitidos
  const validDocumentTypes: DocumentType[] = ['DNI', 'PASAPORTE', 'RUC'];
  const documentType: DocumentType = validDocumentTypes.includes(row.document_type as DocumentType) 
    ? row.document_type as DocumentType 
    : 'DNI'; // Valor por defecto
    
  return {
    id: row.id,
    document_type: documentType,
    document_number: row.document_number,
    first_name: row.first_name,
    last_name: row.last_name,
    business_name: row.business_name,
    birth_date: row.birth_date,
    gender: row.gender,
    email: row.email,
    phone: row.phone,
    mobile: row.mobile,
    address: row.address ? JSON.parse(row.address) : {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    contacts: row.contacts ? JSON.parse(row.contacts) : [],
    documents: row.documents ? JSON.parse(row.documents) : [],
    status: row.status ? JSON.parse(row.status) : { id: '1', name: 'Activo', color: '#10B981' },
    categories: row.categories ? JSON.parse(row.categories) : [],
    policies: row.policies ? JSON.parse(row.policies) : [],
    notes: row.notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
    created_by: row.created_by,
    updated_by: row.updated_by,
    is_business: row.is_business || false
  };
}

// Map client form data to database format
function mapClientFormToDb(data: ClientFormData) {
  // Asegurarse de que el género tenga un valor válido
  const gender: 'M' | 'F' | 'OTRO' = data.gender || 'OTRO';
  
  return {
    document_type: data.documentType,
    document_number: data.documentNumber,
    first_name: data.firstName,
    last_name: data.lastName,
    business_name: data.businessName || null,
    birth_date: data.birthDate || null,
    gender,
    email: data.email,
    phone: data.phone,
    mobile: data.mobile || null,
    address: data.address ? JSON.stringify(data.address) : null,
    is_business: data.isBusiness || false,
    status: JSON.stringify({ id: '1', name: 'Activo', color: '#10B981' }),
    categories: JSON.stringify([]),
    contacts: JSON.stringify([]),
    documents: JSON.stringify([]),
    policies: JSON.stringify([])
  };
}

// Helper function to build query with filters
const buildQueryWithFilters = (query: any, filters: ClientFilters) => {
  let q = query;
  
  if (filters.search) {
    q = q.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,document_number.ilike.%${filters.search}%`);
  }
  
  if (filters.documentNumber) {
    q = q.eq('document_number', filters.documentNumber);
  }
  
  if (filters.status && filters.status.length > 0) {
    q = q.in('status->>name', filters.status);
  }
  
  if (filters.categories && filters.categories.length > 0) {
    filters.categories.forEach(categoryId => {
      q = q.contains('categories', [{ id: categoryId }]);
    });
  }
  
  if (filters.createdAt) {
    q = q.gte('created_at', filters.createdAt.from);
    q = q.lte('created_at', filters.createdAt.to);
  }
  
  if (filters.birthDate) {
    q = q.gte('birth_date', filters.birthDate.from);
    q = q.lte('birth_date', filters.birthDate.to);
  }
  
  if (filters.agentId) {
    q = q.eq('created_by', filters.agentId);
  }
  
  if (filters.isBusiness !== undefined) {
    q = q.eq('is_business', filters.isBusiness);
  }
  
  return q;
};

export const clientService = {
  // Get all clients with optional filters
  async getAll(filters?: ClientFilters): Promise<{ data: Client[]; count: number }> {
    let query = supabase
      .from('clientes')
      .select('*', { count: 'exact' });
    
    if (filters) {
      query = buildQueryWithFilters(query, filters);
    }
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return {
      data: (data ?? []).map(mapDbToClient),
      count: count || 0
    };
  },

  // Get client by ID
  async getById(id: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return mapDbToClient(data);
  },

  // Create a new client
  async create(data: ClientFormData): Promise<Client> {
    // Mapear los datos del formulario al formato de la base de datos
    const now = new Date().toISOString();
    const formData = mapClientFormToDb(data);
    
    const clientData = {
      ...formData,
      estado: true, // Estado como booleano
      created_at: now,
      updated_at: now,
      // Agregar campos requeridos con valores por defecto
      estado_civil: 'SOLTERO' as const,
      agente_id: null
    };

    const { data: result, error } = await supabase
      .from('clientes')
      .insert([{
        // Mapear a los nombres de columna de la base de datos
        tipo_documento: formData.document_type,
        numero_documento: formData.document_number,
        nombre: formData.first_name,
        apellido: formData.last_name,
        razon_social: formData.business_name,
        fecha_nacimiento: formData.birth_date,
        genero: formData.gender,
        email: formData.email,
        telefono: formData.phone,
        celular: formData.mobile,
        direccion: formData.address,
        estado: clientData.estado,
        es_empresa: formData.is_business,
        estado_civil: clientData.estado_civil,
        agente_id: clientData.agente_id,
        created_at: clientData.created_at,
        updated_at: clientData.updated_at
      }])
      .select('*')
      .single();

    if (error) {
      console.error('Error creating client:', error);
      throw error;
    }

    // Mapear la respuesta de la base de datos al tipo Client
    return mapDbToClient(result);
  },

  // Update an existing client
  async update(id: string, data: Partial<ClientFormData>): Promise<Client> {
    // Mapear los datos del formulario al formato de la base de datos
    const formData = mapClientFormToDb(data as ClientFormData);
    
    // Preparar los datos para la actualización
    const updateData: any = {
      tipo_documento: formData.document_type,
      numero_documento: formData.document_number,
      nombre: formData.first_name,
      apellido: formData.last_name,
      razon_social: formData.business_name,
      fecha_nacimiento: formData.birth_date,
      genero: formData.gender,
      email: formData.email,
      telefono: formData.phone,
      celular: formData.mobile,
      direccion: formData.address,
      es_empresa: formData.is_business,
      updated_at: new Date().toISOString()
    };
    
    // Eliminar campos que no se deben actualizar si no se proporcionan
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === null) {
        delete updateData[key];
      }
    });
    
    const { data: updatedData, error } = await supabase
      .from('clientes')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error updating client:', error);
      throw error;
    }
    
    return mapDbToClient(updatedData);
  },

  // Delete a client
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('clientes').delete().eq('id', id);
    if (error) throw error;
  },
  
  // Get client status options
  async getStatusOptions(): Promise<ClientStatus[]> {
    // In a real app, this would come from the database
    return [
      { id: '1', name: 'Activo', value: 'ACTIVE', color: 'bg-green-100 text-green-800' },
      { id: '2', name: 'Inactivo', value: 'INACTIVE', color: 'bg-red-100 text-red-800' },
      { id: '3', name: 'Potencial', value: 'POTENTIAL', color: 'bg-blue-100 text-blue-800' },
      { id: '4', name: 'En proceso', value: 'IN_PROCESS', color: 'bg-yellow-100 text-yellow-800' },
      { id: '5', name: 'Rechazado', value: 'REJECTED', color: 'bg-gray-100 text-gray-800' },
    ];
  },
  
  // Get client category options
  async getCategoryOptions(): Promise<ClientCategory[]> {
    // In a real app, this would come from your database
    return [
      { id: '1', name: 'VIP', color: '#8B5CF6' },
      { id: '2', name: 'Frecuente', color: '#EC4899' },
      { id: '3', name: 'Ocasional', color: '#F59E0B' },
      { id: '4', name: 'Nuevo', color: '#3B82F6' },
    ];
  },
  
  // Get default column visibility
  getDefaultColumnVisibility: (): Record<string, boolean> => ({
    'name': true,
    'document': true,
    'email': true,
    'phone': true,
    'status': true,
    'createdAt': false,
    'birthDate': false,
    'address': false,
    'categories': true,
    'actions': true,
  }),
  
  // Export clients data
  exportClients: async (filters?: ClientFilters): Promise<{ data: Client[]; count: number }> => {
    // In a real app, this would generate a file for download
    // For now, we'll just return the data
    const result = await clientService.getAll(filters);
    return result;
  },
  
  // Get client statistics
  getStatistics: async (): Promise<{
    total: number;
    active: number;
    inactive: number;
    potential: number;
    byCategory: { name: string; count: number; color: string }[];
  }> => {
    // In a real app, this would come from your database
    return {
      total: 0,
      active: 0,
      inactive: 0,
      potential: 0,
      byCategory: []
    };
  }
};
