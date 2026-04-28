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

  // Usamos la URL base desde environment
  private apiUrl = `${environment.urlHost}api/v1/users`;

  constructor(private http: HttpClient) { }

  // Obtener mis datos (Perfil)
  getMe(): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/me`).pipe(
      catchError(this.handleError)
    );
  }

  // Listar todos
  getAll(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Buscar por ID
  getById(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Crear usuario
  create(user: UserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(this.apiUrl, user).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar usuario
  update(id: number, user: UserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.apiUrl}/${id}`, user).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * OPCIÓN RECOMENDADA: Toggle Status usando PUT
   * Esto evita problemas de compatibilidad con PATCH en algunos entornos.
   * En Java debe ser @PutMapping("/{id}/status")
   */
  toggleStatus(id: number): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.apiUrl}/${id}/status`, {}).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * OPCIÓN ALTERNATIVA: Desactivar específico
   * En Java debe ser @PutMapping("/desactivar/{id}")
   */
  desactivarUsuario(id: number): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.apiUrl}/desactivar/${id}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Manejador de errores centralizado
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Error de red o CORS:', error.error);
    } else if (error.status === 403) {
      console.error('Acceso denegado (403): Revisa los permisos de tu Token JWT.');
    } else {
      console.error(`Backend retornó código ${error.status}, cuerpo: `, error.error);
    }
    return throwError(() => new Error('Error en la operación de usuario. Intente de nuevo.'));
  }
}
