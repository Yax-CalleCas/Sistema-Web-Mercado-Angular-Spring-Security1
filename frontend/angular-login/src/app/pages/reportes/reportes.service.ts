import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private apiUrl = environment.urlHost + 'api/v1/reportes';

  constructor(private http: HttpClient) {}

  cajaDiaria(fecha: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/caja-diaria?fecha=${fecha}`);
  }

  deudasPorSocio(socioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/deudas-socio/${socioId}`);
  }
}
