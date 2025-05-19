import { Cliente } from './clientes';

export interface Poliza {
  id: string;
  numeroPoliza: string;
  cliente: Cliente;
  tipoPoliza: 'Vida' | 'Salud' | 'Auto' | 'Hogar';
  fechaEmision: Date;
  fechaVencimiento: Date;
  estado: 'Activa' | 'Vencida' | 'Cancelada';
  prima: number;
  moneda: 'PEN' | 'USD';
  agente: {
    id: string;
    nombres: string;
    apellidos: string;
  };
}
