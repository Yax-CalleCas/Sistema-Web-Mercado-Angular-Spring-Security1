import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/auth/login.service';
import { LoginRequest } from 'src/app/services/auth/loginRequest';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
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

      const credentials = this.loginForm.getRawValue() as LoginRequest;

      this.loginService.login(credentials).subscribe({
        next: () => {
          this.loginError = "";

          // 🔥 REDIRECCIÓN INMEDIATA (no depende del backend extra)
          this.redirectByRole();

          // 🔥 CARGA DE PERFIL SIN BLOQUEAR
          this.loginService.loadSocio().subscribe({
            next: () => {},
            error: (err) => {
              console.warn("No se pudo cargar el socio", err);
            }
          });
        },
        error: () => {
          this.loginError = "Credenciales incorrectas.";
        }
      });

    } else {
      this.loginForm.markAllAsTouched();
    }
  }

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
