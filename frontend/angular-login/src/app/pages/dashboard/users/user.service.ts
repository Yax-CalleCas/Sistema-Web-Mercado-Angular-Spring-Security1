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

  // La URL ahora coincide con @RequestMapping("/api/v1/users")
  private apiUrl = `${environment.urlHost}api/v1/users`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de todos los usuarios registrados (Solo Admin).
   */
  getAll(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * BUSCAR POR USERNAME: Este es el que usa el DashboardComponent.
   * Conecta con @GetMapping("/search/{username}") del UserController.java
   */
  getUser(username: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/search/${username}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene un usuario por su ID único.
   */
  getById(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crea un nuevo usuario.
   */
  create(user: UserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(this.apiUrl, user).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza la información (Put).
   */
  update(id: number, user: UserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.apiUrl}/${id}`, user).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Cambia el estado (Activar/Desactivar).
   * Conecta con @PutMapping("/{id}/status") del UserController.java
   */
  toggleStatus(id: number): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.apiUrl}/${id}/status`, {}).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Elimina un usuario.
   */
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
    } else if (error.status === 404) {
      errorMessage = 'El usuario no existe en la base de datos.';
    }

    console.error(`Error ${error.status}: ${error.message}`);
    return throwError(() => new Error(errorMessage));
  }
}
