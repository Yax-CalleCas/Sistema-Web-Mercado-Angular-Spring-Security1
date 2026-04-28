import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PagoRequest } from "../../models/PagoRequest";

@Injectable({
  providedIn: 'root'
})
export class PagosService {

  private api = 'http://localhost:8080/api/pagos';

  constructor(private http: HttpClient) {}

  // 💳 Crear checkout (Stripe / MercadoPago)
  crearCheckout(data: PagoRequest) {
    return this.http.post<string>(`${this.api}/crear-checkout`, data);
  }

  // 📄 historial de pagos por socio
  getPagosPorSocio(socioId: number) {
    return this.http.get<any[]>(`${this.api}/socio/${socioId}`);
  }

  // 🧾 historial por puesto (admin)
  getPagosPorPuesto(puestoId: number) {
    return this.http.get<any[]>(`${this.api}/puesto/${puestoId}`);
  }

  // 🔥 ESTE ES EL QUE TE FALTABA (lo usas en SocioComponent)
  alquilar(puestoId: number, socioId: number) {
    const body = {
      puestoId,
      socioId
    };

    return this.http.post<any>(`${this.api}/alquilar`, body);
  }

  // 📊 opcional: pagos pendientes (útil para dashboard)
  getPagosPendientes() {
    return this.http.get<any[]>(`${this.api}/estado/PENDIENTE`);
  }

  // 📊 opcional: pagos aprobados
  getPagosAprobados() {
    return this.http.get<any[]>(`${this.api}/estado/APROBADO`);
  }

  // 🔎 buscar pago por transacción (webhook)
  getPorTransaccion(transaccionId: string) {
    return this.http.get<any>(`${this.api}/transaccion/${transaccionId}`);
  }
}
