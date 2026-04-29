import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2'; // Opcional: para alertas bonitas

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ocurrió un error inesperado';

        // 1. Extraer información detallada del error
        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente (ej. red caída)
          errorMessage = `Error: ${error.error.message}`;
        } else {

          const serverMessage = error.error?.message || error.message;

          switch (error.status) {
            case 401:
              errorMessage = 'Sesión expirada. Por favor, inicia sesión de nuevo.';
              // Aquí podrías redirigir al login: this.router.navigate(['/login']);
              break;
            case 403:
              errorMessage = 'No tienes permisos para acceder a este recurso (403 Forbidden).';
              break;
            case 404:
              errorMessage = 'No se encontró el recurso solicitado (404).';
              break;
            case 500:
              errorMessage = 'Error interno en el servidor. Inténtalo más tarde.';
              break;
            default:
              errorMessage = `Error ${error.status}: ${serverMessage}`;
          }
        }

        // 2. Log detallado en consola para ti (el desarrollador)
        console.error('--- ERROR INTERCEPTADO ---');
        console.error('URL:', req.url);
        console.error('Status:', error.status);
        console.error('Mensaje:', errorMessage);
        console.error('Cuerpo completo:', error.error);
        console.error('--------------------------');



        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
