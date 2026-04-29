

export interface UserDTO {
  id?: number;
  username: string;
  nombres: string;   // <--- AGREGADO
  apellidos: string; // <--- AGREGADO
  role: string;
  enabled: boolean;
}
