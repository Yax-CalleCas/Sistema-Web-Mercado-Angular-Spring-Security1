import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface UserDTO {
  id?: number;
  username: string;
  password?: string;
  role: string;
  enabled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environment.urlHost}api/v1/users`;

  constructor(private http: HttpClient) { }

  // ✅ getMe CORREGIDO: Ahora retorna el Observable
  getMe(): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/me`).pipe(
      catchError(this.handleError)
    );
  }

  getAll(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  create(user: UserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(this.apiUrl, user).pipe(
      catchError(this.handleError)
    );
  }

  update(id: number, user: UserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.apiUrl}/${id}`, user).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  toggleStatus(id: number): Observable<UserDTO> {
    return this.http.patch<UserDTO>(`${this.apiUrl}/${id}/status`, {}).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Error de red o CORS:', error.error);
    } else {
      console.error(`Backend retornó código ${error.status}, cuerpo: `, error.error);
    }
    return throwError(() => new Error('Error en la operación de usuario. Intente de nuevo.'));
  }
}
