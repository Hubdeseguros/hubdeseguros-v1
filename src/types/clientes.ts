export interface Cliente {
  id: string;
  nombres: string;
  apellidos: string;
  documento: string;
  fechaNacimiento?: Date;
  fechaConstitucion?: Date;
  celular: string;
  email: string;
  estadoCliente: 'Activo' | 'Inactivo' | 'Prospecto';
  usuarioCreado: string;
  recordatoriosPolizasCobros: string;
  sede: string;
  categorias: string[];
}
