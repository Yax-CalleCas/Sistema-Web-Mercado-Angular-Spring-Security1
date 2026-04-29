import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pago } from '../../models/Pago';

@Injectable({
  providedIn: 'root'
})
export class PagosService {


  private apiUrl = 'http://localhost:8080/api/v1/pagos';

  constructor(private http: HttpClient) {}

  /**
   * Crea la sesión en Stripe
   */
  crearCheckout(request: any): Observable<string> {
    return this.http.post(`${this.apiUrl}/crear-checkout`, request, {
      responseType: 'text'
    });
  }

  /**
   * Confirma el pago al volver de la pasarela
   */
  confirmarPago(sessionId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/confirmar`, {
      params: { session_id: sessionId }
    });
  }

  /**
   * ADMIN: pagos pendientes
   */
  getPagosPendientes(): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.apiUrl}/pendientes`);
  }

  /**
   * ADMIN: aprobar pago
   */
  aprobarPago(pagoId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${pagoId}/aprobar`, {});
  }

  /**
   * Socio: historial
   */
  getPagosPorSocio(socioId: number): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.apiUrl}/socio/${socioId}`);
  }

  /**
   * ADMIN: historial completo
   */
  getHistorialCompleto(): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.apiUrl}/historial-completo`);
  }

  /**
   * Total pagado por socio
   */
  getTotalSocio(socioId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total-socio/${socioId}`);
  }
}
