import { Socio } from "../pages/socios/socios.model";

export interface Puesto {
  id?: number;
  codigo: string;
  ubicacion: string;
  activo: boolean;
  esAsociacion: boolean;
  imagenUrl?: string;
  categoria: string;

  // Atributos financieros
  precioAlquiler: number;
  serviciosIncluidos: boolean;
  costoAguaFijo: number;
  costoLuzFijo: number;

  // Objeto anidado que viene del Backend
  socio?: Socio;
}
