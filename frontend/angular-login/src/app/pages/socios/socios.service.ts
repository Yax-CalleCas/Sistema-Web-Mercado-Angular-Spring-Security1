import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Socio} from "./socios.model";

@Injectable({
  providedIn: 'root'
})
export class SocioService {

  private api = 'http://localhost:8080/api/v1/socios';

  constructor(private http: HttpClient) {}

  listar(): Observable<Socio[]> {
    return this.http.get<Socio[]>(this.api);
  }
// En socios.service.ts
  buscarPorEmail(email: string): Observable<Socio> {
    // Asegúrate que la ruta sea /me/ y no /search/
    return this.http.get<Socio>(`${this.api}/me/${email}`);
  }

  obtener(id: number): Observable<Socio> {
    return this.http.get<Socio>(`${this.api}/${id}`);
  }

  crear(data: Socio): Observable<Socio> {
    return this.http.post<Socio>(this.api, data);
  }

  actualizar(id: number, data: Socio): Observable<Socio> {
    return this.http.put<Socio>(`${this.api}/${id}`, data);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }


}
