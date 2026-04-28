export interface Socio {
  id?: number;
  nombres: string;
  apellidos: string;
  dni: string;
  telefono?: string;
  direccion?: string;
  fotoUrl?: string;
  activo?: boolean;
  // Campos necesarios para el SocioRequest del backend
  username?: string;
  password?: string;
  role?: string;
}
