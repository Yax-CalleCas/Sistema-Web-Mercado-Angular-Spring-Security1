import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocioReporteDTO } from "../../models/SocioReporteDTO";

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private apiUrl = 'http://localhost:8080/api/v1/reportes';

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard`);
  }

  getSociosReport(): Observable<SocioReporteDTO[]> {
    return this.http.get<SocioReporteDTO[]>(`${this.apiUrl}/socios`);
  }

  // 🔥 NUEVOS MÉTODOS
  guardarCierre(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/guardar-cierre`, {});
  }

  getHistorialReportes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historial`);
  }
}
