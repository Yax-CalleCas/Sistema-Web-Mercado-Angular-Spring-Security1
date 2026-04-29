import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Deuda} from "../../models/Deuda";

@Injectable({
  providedIn: 'root'
})
export class DeudaService {

  private apiUrl = 'http://localhost:8080/api/v1/deudas';

  constructor(private http: HttpClient) {}

  listar(): Observable<Deuda[]> {
    return this.http.get<Deuda[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  obtenerPorId(id: number): Observable<Deuda> {
    return this.http.get<Deuda>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  crear(deuda: Deuda): Observable<Deuda> {
    return this.http.post<Deuda>(this.apiUrl, deuda)
      .pipe(catchError(this.handleError));
  }

  actualizar(id: number, deuda: Deuda): Observable<Deuda> {
    return this.http.put<Deuda>(`${this.apiUrl}/${id}`, deuda)
      .pipe(catchError(this.handleError));
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  marcarPagado(id: number): Observable<Deuda> {
    return this.http.patch<Deuda>(`${this.apiUrl}/${id}/pagar`, {})
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error API:', error);
    return throwError(() => new Error('Ocurrió un error en el servidor'));
  }
}
