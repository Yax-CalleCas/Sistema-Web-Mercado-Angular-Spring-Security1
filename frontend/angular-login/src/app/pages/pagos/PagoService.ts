import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pago } from '../../models/Pago';

@Injectable({
  providedIn: 'root'
})
export class PagosService {
  private apiUrl = 'http://localhost:8080/api/pagos';

  constructor(private http: HttpClient) {}

  /**
   * Crea la sesión en Stripe. Recibe la URL como texto plano.
   */
  crearCheckout(request: any): Observable<string> {
    return this.http.post(`${this.apiUrl}/crear-checkout`, request, {
      responseType: 'text'
    });
  }

  /**
   * Confirma el pago al volver de la pasarela.
   * Este método dispara la lógica automática en Java.
   */
  confirmarPago(sessionId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/confirmar?session_id=${sessionId}`);
  }
  /**
   * ADMIN: Listar todos los pagos que están en estado PENDIENTE
   */
  getPagosPendientes(): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.apiUrl}/pendientes`);
  }

  /**
   * ADMIN: Aprobar manualmente un pago por su ID
   */
  aprobarPago(pagoId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${pagoId}/aprobar`, {});
  }
  /**
   * Historial específico para el Socio logueado.
   */
  getPagosPorSocio(socioId: number): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.apiUrl}/socio/${socioId}`);
  }

  /**
   * REPORTE AUDITORÍA: Obtiene todos los pagos registrados (Solo Admin).
   */
  getHistorialCompleto(): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.apiUrl}/historial-completo`);
  }

  /**
   * Obtiene el total pagado por un socio (usado en las cards del dashboard).
   */
  getTotalSocio(socioId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total-socio/${socioId}`);
  }
}
