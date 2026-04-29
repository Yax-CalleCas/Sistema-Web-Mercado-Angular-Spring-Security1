import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Puesto } from '../../../models/puesto';
import { PuestoRequest } from '../../../models/puesto-request';

@Injectable({
  providedIn: 'root'
})
export class PuestoService {

  private apiUrl = 'http://localhost:8080/api/puestos';

  constructor(private http: HttpClient) {}

  listar(): Observable<Puesto[]> {
    return this.http.get<Puesto[]>(this.apiUrl);
  }

  listarPaginado(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/page?page=${page}&size=${size}`);
  }

  listarDisponibles(): Observable<Puesto[]> {
    return this.http.get<Puesto[]>(`${this.apiUrl}/disponibles`);
  }

  listarDisponiblesNormales(): Observable<Puesto[]> {
    return this.http.get<Puesto[]>(`${this.apiUrl}/disponibles/normales`);
  }

  listarDisponiblesAsociacion(): Observable<Puesto[]> {
    return this.http.get<Puesto[]>(`${this.apiUrl}/disponibles/asociacion`);
  }

  crear(data: PuestoRequest): Observable<Puesto> {
    return this.http.post<Puesto>(this.apiUrl, data);
  }

  actualizar(id: number, data: PuestoRequest): Observable<Puesto> {
    return this.http.put<Puesto>(`${this.apiUrl}/${id}`, data);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTotalPuestos(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
}
