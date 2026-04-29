import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface UserDTO {
  id?: number;
  username: string;
  nombres: string;
  apellidos: string;
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

  getAll(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getUser(username: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/search/${username}`).pipe(
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


  toggleStatus(id: number): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.apiUrl}/${id}/status`, {}).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido en el servicio de usuarios';
    if (error.status === 401) {
      errorMessage = 'No autorizado. El token no es válido.';
    } else if (error.status === 403) {
      errorMessage = 'Prohibido. No tienes permisos de Administrador.';
    }
    return throwError(() => new Error(errorMessage));
  }
}
