import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/auth/login.service';
import {SocioService} from "../socios/socios.service";

@Component({
  selector: 'app-panel-socio',
  templateUrl: './panel-socio.component.html',
  styleUrls: ['./panel-socio.component.css']
})
export class PanelSocioComponent implements OnInit {

  tab: string = 'catalogo';
  socioActual: any = null;
  loading: boolean = true;

  constructor(
    private socioService: SocioService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.verificarYRecuperarSesion();
  }

  verificarYRecuperarSesion(): void {
    this.loading = true;

    // 1. Intentamos leer el objeto ya guardado
    const socioLocal = localStorage.getItem('usuario');

    if (socioLocal && socioLocal !== 'null') {
      this.socioActual = JSON.parse(socioLocal);
      this.loading = false;
      console.log("Sesión cargada desde LocalStorage");
    } else {
      // 2. Si no hay objeto, pero hay TOKEN, lo buscamos en el servidor
      const token = sessionStorage.getItem('token');
      if (token) {
        this.cargarDesdeServidor(token);
      } else {
        console.error("No hay ni objeto ni token.");
        this.loading = false;
      }
    }
  }

  cargarDesdeServidor(token: string): void {
    try {
      // Decodificamos el email del token (parte central del JWT)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email = payload.sub;

      console.log("Recuperando datos para:", email);

      this.socioService.buscarPorEmail(email).subscribe({
        next: (socio) => {
          this.socioActual = socio;
          // Guardamos para la próxima vez
          localStorage.setItem('usuario', JSON.stringify(socio));
          this.loading = false;
        },
        error: (err) => {
          console.error("Error al recuperar socio del servidor", err);
          this.loading = false;
        }
      });
    } catch (e) {
      console.error("Error decodificando token", e);
      this.loading = false;
    }
  }

  setTab(nombre: string): void {
    this.tab = nombre;
  }

  logout(): void {
    this.loginService.logout();
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}
