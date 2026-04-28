import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // 🔑 1. Obtener el token directamente del sessionStorage
    // Esto evita problemas de sincronización con BehaviorSubject
    const token = sessionStorage.getItem('token');

    // 🔐 2. Si existe el token, clonamos la petición y agregamos el header Authorization
    if (token && token.trim() !== '') {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` // Formato requerido por Spring Security
        }
      });

      // 🚀 3. Enviamos la petición modificada con el token
      return next.handle(authReq);
    }

    // ⚠️ 4. Si no hay token, enviamos la petición original (sin autorización)
    return next.handle(req);
  }
}
