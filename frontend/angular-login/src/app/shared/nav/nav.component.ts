import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/auth/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  loginForm!: FormGroup;
  loginError: string = '';
  userLoginOn: boolean = false;
  userRole: string = '';

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. Suscripción al estado del Login
    this.loginService.userLoginOn.subscribe({
      next: (status) => {
        this.userLoginOn = status;
      }
    });

    // 2. Suscripción al Rol
    this.loginService.userRole.subscribe({
      next: (role) => {
        this.userRole = role;
      }
    });

    // 3. Inicialización del formulario
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get email() { return this.loginForm.get('username')!; }
  get password() { return this.loginForm.get('password')!; }

  login() {
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value).subscribe({
        next: (userData) => {
          console.log('Bienvenido!');
          this.router.navigate(['/dashboard']);
          this.loginForm.reset();
        },
        error: (errorData) => {
          this.loginError = errorData;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.loginError = "Complete los campos correctamente.";
    }
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/iniciar-sesion']);
  }
}
