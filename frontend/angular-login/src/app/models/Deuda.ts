export interface Deuda {
  id?: number;
  fechaGeneracion?: string;
  monto: number;
  pagado: boolean;
  conceptoId: number;
  puestoId: number;
  socioId: number;
  mesReferencia?: string;
  estado?: string;
  fechaVencimiento?: string;
}
