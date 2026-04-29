import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/auth/login.service';
import { LoginRequest } from 'src/app/services/auth/loginRequest';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginError: string = "";

  loginForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    // Si ya tiene sesión, redirigir según su rol guardado
    if (this.loginService.isLoggedIn()) {
      this.redirectByRole();
    }
  }

  get email() {
    return this.loginForm.controls.username;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  login() {
    if (this.loginForm.valid) {
      this.loginError = "";
      const credentials = this.loginForm.getRawValue() as LoginRequest;

      this.loginService.login(credentials).subscribe({
        next: () => {
          // 1. Identificamos el rol apenas logueamos
          if (this.loginService.isAdmin()) {
            // Es ADMIN: No buscamos perfil de socio, vamos directo al dashboard
            this.router.navigate(['/dashboard']);
          }
          else if (this.loginService.isUser()) {
            // Es SOCIO: Intentamos cargar su perfil de socio
            this.loginService.loadSocio().subscribe({
              next: () => {
                // Perfil cargado con éxito, vamos a su panel
                this.router.navigate(['/mi-panel-socio']);
              },
              error: (err) => {
                // El usuario existe pero no tiene registro en la tabla de SOCIOS
                console.error("Error: Usuario sin perfil de socio", err);
                this.loginError = "No se encontró un perfil de socio vinculado a esta cuenta.";
                this.loginService.logout(); // Opcional: Cerrar sesión si el perfil es obligatorio
              }
            });
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          // Si el error viene del interceptor con un mensaje personalizado, lo usamos
          this.loginError = error.message || "Credenciales incorrectas.";
        }
      });

    } else {
      this.loginForm.markAllAsTouched();
    }
  }
//repartimos roles

  private redirectByRole(): void {
    if (this.loginService.isAdmin()) {
      this.router.navigate(['/dashboard']);
    } else if (this.loginService.isUser()) {
      this.router.navigate(['/mi-panel-socio']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
