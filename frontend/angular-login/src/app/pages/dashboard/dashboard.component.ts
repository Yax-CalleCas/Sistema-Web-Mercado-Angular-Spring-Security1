import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/auth/login.service';
import { UserService, UserDTO } from 'src/app/services/user/user.service';
import { ReportesService } from "../reportes/reportes.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  // --- ESTADO DE LA INTERFAZ ---
  userLoginOn: boolean = false;
  role: string = '';
  currentUser?: UserDTO;
  loading: boolean = false;

  // --- MÉTRICAS DE USUARIOS ---
  totalUsers: number = 0;
  activeUsers: number = 0;
  inactiveUsers: number = 0;

  // --- MÉTRICAS FINANCIERAS (Inicialización blindada contra errores de Pipe) ---
  stats: any = {
    ingresosTotales: 0,
    porcentajeOcupacion: 0,
    totalPuestos: 0,
    puestosOcupados: 0,
    recaudacionServicios: 0,
    porConcepto: []
  };

  private subs: Subscription[] = [];

  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private router: Router,
    private reportesService: ReportesService
  ) {}

  ngOnInit(): void {
    // 1. Escuchar estado de sesión
    this.subs.push(
      this.loginService.userLoginOn.subscribe(status => this.userLoginOn = status)
    );

    // 2. Escuchar cambios de Rol y decidir qué cargar
    this.subs.push(
      this.loginService.userRole.subscribe(role => {
        this.role = role;
        if (role === 'ROLE_USER' || role === 'USER') {
          this.router.navigate(['/mi-panel-socio']);
        } else if (role === 'ROLE_ADMIN' || role === 'ADMIN') {
          this.loadAdminData();
        }
      })
    );
  }

  /**
   * Carga masiva de datos para el Admin
   */
  loadAdminData(): void {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    this.loading = true;
    this.loadCurrentUser(token);
    this.loadUserStats();
    this.loadFinancialStats();
  }

  loadFinancialStats(): void {
    this.reportesService.getDashboardStats().subscribe({
      next: (data) => {
        if (data) this.stats = data;
        this.loading = false;
      },
      error: (err) => {
        console.error("Error stats financieras:", err);
        this.loading = false;
      }
    });
  }

  loadUserStats(): void {
    this.userService.getAll().subscribe({
      next: (users) => {
        if (users) {
          this.totalUsers = users.length;
          this.activeUsers = users.filter(u => u.enabled).length;
          this.inactiveUsers = users.filter(u => !u.enabled).length;
        }
      },
      error: (err) => console.error("Error stats usuarios:", err)
    });
  }

  loadCurrentUser(token: string): void {
    const username = this.extractUsername(token);
    if (username) {
      this.userService.getUser(username).subscribe({
        next: (user) => this.currentUser = user,
        error: (err) => console.error("Error al obtener perfil:", err)
      });
    }
  }

  private extractUsername(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.username || '';
    } catch (e) {
      return '';
    }
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}
