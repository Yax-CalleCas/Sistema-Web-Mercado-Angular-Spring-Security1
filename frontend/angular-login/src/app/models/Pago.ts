import { Puesto } from "./puesto";
import { Socio } from "../pages/socios/socios.model";

export interface Pago {
  id?: number;

  montoTotal: number; // monto del pago
  concepto: string;

  fechaPago: Date; // fecha real del pago
  metodoPago: string;

  puesto?: Puesto; // puesto relacionado
  socio?: Socio;   // socio que pagó
}
