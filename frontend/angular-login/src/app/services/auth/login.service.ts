import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { LoginRequest } from "./loginRequest";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url = 'http://localhost:8080/auth/login';
  private registerUrl = 'http://localhost:8080/auth/register';
  private socioUrl = 'http://localhost:8080/api/v1/socios'; // Ajustado para ser dinámico

  // BehaviorSubjects para mantener el estado reactivo
  private currentUserLoginOn = new BehaviorSubject<boolean>(this.hasToken());
  private currentUserRole = new BehaviorSubject<string>(this.getRoleFromToken());

  constructor(private http: HttpClient) { }

  // =========================
  // 🔐 LOGIN (Sincronizado)
  // =========================

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(this.url, credentials).pipe(
      tap((res) => {
        if (res?.token) {
          // 1. Guardar en almacenamiento físico inmediatamente
          sessionStorage.setItem("token", res.token);

          // 2. Notificar a los observadores (Esto dispara los Guards y Redirecciones)
          this.currentUserLoginOn.next(true);
          const role = this.getRoleFromToken();
          this.currentUserRole.next(role);

          console.log("Login exitoso. Rol detectado:", role);
        }
      }),
      catchError(this.handleError)
    );
  }

  // =========================
  // 👤 SOCIO (Carga perfil por email/sub)
  // =========================

  loadSocio(): Observable<any> {
    const user = this.getUserFromToken();

    if (!user || !user.sub) {
      return of(null);
    }

    // Usamos el 'sub' (email) para buscar los datos del socio
    return this.http.get(`${this.socioUrl}/search/${user.sub}`).pipe(
      tap((socio) => {
        localStorage.setItem("usuario", JSON.stringify(socio));
      }),
      catchError((err) => {
        console.error("Error cargando perfil de socio:", err);
        return of(null);
      })
    );
  }

  // =========================
  // 📝 REGISTRO
  // =========================

  register(data: any): Observable<any> {
    return this.http.post<any>(this.registerUrl, data).pipe(
      catchError(this.handleError)
    );
  }

  // =========================
  // 🚪 LOGOUT
  // =========================

  logout(): void {
    sessionStorage.removeItem("token");
    localStorage.removeItem("usuario");

    this.currentUserLoginOn.next(false);
    this.currentUserRole.next('');
  }

  // =========================
  // 🧠 LÓGICA DE TOKEN
  // =========================

  getUserFromToken(): any {
    const token = sessionStorage.getItem("token");
    if (!token || token === "undefined") return null;

    try {
      return jwtDecode(token);
    } catch (e) {
      console.error("Error decodificando JWT:", e);
      return null;
    }
  }

  getRoleFromToken(): string {
    const user = this.getUserFromToken();
    if (!user) return '';

    // Soporta tanto 'roles' (lista) como 'role' (string único)
    if (Array.isArray(user.roles) && user.roles.length > 0) {
      return user.roles[0];
    }
    return user.role || '';
  }

  isAdmin(): boolean {
    const role = this.getRoleFromToken();
    return role === 'ROLE_ADMIN' || role === 'ADMIN';
  }

  isUser(): boolean {
    const role = this.getRoleFromToken();
    return role === 'ROLE_USER' || role === 'USER';
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  // =========================
  // 📡 OBSERVABLES
  // =========================

  get userLoginOn(): Observable<boolean> {
    return this.currentUserLoginOn.asObservable();
  }

  get userRole(): Observable<string> {
    return this.currentUserRole.asObservable();
  }

  // =========================
  // ⚙️ MANEJO DE ERRORES
  // =========================

  private handleError(error: HttpErrorResponse) {
    let msg = "Error en la operación";
    if (error.status === 401) {
      msg = "Credenciales inválidas";
    } else if (error.status === 403) {
      msg = "No tiene permisos suficientes";
    }
    return throwError(() => new Error(msg));
  }

  private hasToken(): boolean {
    const token = sessionStorage.getItem("token");
    return !!token && token !== "undefined" && token.length > 10;
  }
}
