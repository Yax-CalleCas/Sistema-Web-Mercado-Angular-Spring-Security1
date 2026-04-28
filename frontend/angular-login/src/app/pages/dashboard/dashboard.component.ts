import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router'; // <--- AGREGADO: Necesario para redirigir
import { LoginService } from 'src/app/services/auth/login.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  userLoginOn: boolean = false;
  role: string = '';
  currentUser: any;

  totalUsers: number = 0;
  activeUsers: number = 0;
  inactiveUsers: number = 0;

  private subs: Subscription[] = [];

  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private router: Router // <--- AGREGADO: Inyectamos el Router
  ) {}

  ngOnInit(): void {
    // 1. ESCUCHAR EL LOGIN STATUS
    this.subs.push(
      this.loginService.userLoginOn.subscribe(status => {
        this.userLoginOn = status;
      })
    );

    // 2. ESCUCHAR EL ROL Y APLICAR REDIRECCIÓN SI ES SOCIO
    this.subs.push(
      this.loginService.userRole.subscribe(role => {
        this.role = role;

        /* LÓGICA DE CONTROL DE ACCESO:
           Si el usuario entra a /dashboard pero su rol es ROLE_USER,
           lo enviamos automáticamente a su panel de socio.
           Esto evita que vea las estadísticas de administración.
        */
        if (role === 'ROLE_USER') {
          console.log('Detectado rol de Socio. Redirigiendo a Mi Panel...');
          this.router.navigate(['/mi-panel-socio']);
        }
      })
    );

    // 3. CARGAR DATOS (Solo si no fue redirigido)
    this.loadCurrentUser();
    this.loadStats();
  }

  loadCurrentUser() {
    this.userService.getAll().subscribe({
      next: (users) => {
        const token = sessionStorage.getItem('token');
        if (token) {
          const usernameFromToken = this.extractUsername(token);
          this.currentUser = users.find(u => u.username === usernameFromToken);
        }
      },
      error: (err) => console.error('Error cargando usuario actual', err)
    });
  }

  loadStats() {
    // Solo cargamos estadísticas si es administrador para ahorrar recursos
    if (this.role === 'ROLE_ADMIN') {
      this.userService.getAll().subscribe({
        next: (users) => {
          this.totalUsers = users.length;
          this.activeUsers = users.filter(u => u.enabled).length;
          this.inactiveUsers = users.filter(u => !u.enabled).length;
        },
        error: (err) => console.error('Error cargando estadísticas', err)
      });
    }
  }

  logout() {
    this.loginService.logout();
  }

  extractUsername(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    } catch {
      return '';
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}
