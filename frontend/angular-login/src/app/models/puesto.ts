// src/app/models/puesto.ts
import {Socio} from "../pages/socios/socios.model";
export type EstadoPuesto = 'DISPONIBLE' | 'OCUPADO' | 'MANTENIMIENTO';
export interface Puesto {
  id: number; // Quítale el '?' si el ID siempre viene del backend
  codigo: string;
  ubicacion: string;
  activo: boolean;
  esAsociacion: boolean;
  imagenUrl?: string;
  categoria: string;
  descripcion: string;
  fotosGaleria: string;
  precioAlquiler: number;
  serviciosIncluidos: boolean;
  costoAguaFijo: number;
  costoLuzFijo: number;
  socio?: Socio | null; // Permite null para puestos disponibles


  estado: string;
}
