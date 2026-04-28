export interface PuestoRequest {
  codigo: string;
  ubicacion: string;
  categoria: string;
  socioId: number | null;
  esAsociacion: boolean;
  imagenUrl: string;
  precioAlquiler: number;
  serviciosIncluidos: boolean;
  costoAguaFijo: number;
  costoLuzFijo: number;
}
