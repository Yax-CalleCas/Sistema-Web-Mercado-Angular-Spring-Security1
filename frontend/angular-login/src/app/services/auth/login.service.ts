import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import {LoginRequest} from "./loginRequest";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url = 'http://localhost:8080/auth/login';
  private registerUrl = 'http://localhost:8080/auth/register';
  private socioUrl = 'http://localhost:8080/api/v1/socios/me';

  constructor(private http: HttpClient) {
    // inicializa estado al cargar app
    this.currentUserLoginOn.next(this.hasToken());
    this.currentUserRole.next(this.getRoleFromToken());
  }

  private currentUserLoginOn = new BehaviorSubject<boolean>(false);
  private currentUserRole = new BehaviorSubject<string>('');

  // =========================
  // 🔐 LOGIN
  // =========================

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(this.url, credentials).pipe(
      tap((res) => {
        if (res?.token) {
          sessionStorage.setItem("token", res.token);

          this.currentUserLoginOn.next(true);
          this.currentUserRole.next(this.getRoleFromToken());
        }
      }),
      catchError(this.handleError)
    );
  }

  // =========================
  // 👤 SOCIO
  // =========================

  loadSocio(): Observable<any> {
    const user = this.getUserFromToken();

    if (!user?.sub) {
      console.warn("Token sin 'sub'");
      return of(null);
    }

    return this.http.get(`${this.socioUrl}/${user.sub}`).pipe(
      tap((socio) => {
        localStorage.setItem("usuario", JSON.stringify(socio));
      }),
      catchError((err) => {
        console.warn("Error cargando socio", err);
        return of(null); // 🔥 evita romper el flujo
      })
    );
  }

  // =========================
  // 📝 REGISTER
  // =========================

  register(data: any): Observable<any> {
    return this.http.post<any>(this.registerUrl, data)
      .pipe(catchError(this.handleError));
  }

  logout(): void {
    sessionStorage.clear();
    localStorage.removeItem("usuario");

    this.currentUserLoginOn.next(false);
    this.currentUserRole.next('');
  }

  // =========================
  // 🧠 TOKEN
  // =========================

  getUserFromToken(): any {
    const token = sessionStorage.getItem("token");
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }

  getRoleFromToken(): string {
    const user = this.getUserFromToken();
    return user?.roles ? user.roles[0] : '';
  }

  isAdmin(): boolean {
    return this.getRoleFromToken() === 'ROLE_ADMIN';
  }

  isUser(): boolean {
    return this.getRoleFromToken() === 'ROLE_USER';
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem("token");
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

  get currentRoleValue(): string {
    return this.currentUserRole.value;
  }

  // =========================
  // ⚙️ ERROR
  // =========================

  private handleError(error: HttpErrorResponse) {
    console.error("Backend error:", error.status, error.error);
    return throwError(() => new Error("Error en login"));
  }

  // =========================
  // 🔍 HELPERS
  // =========================

  private hasToken(): boolean {
    return !!sessionStorage.getItem("token");
  }
}
