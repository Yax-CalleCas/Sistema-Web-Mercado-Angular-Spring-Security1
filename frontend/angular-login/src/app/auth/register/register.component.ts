import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {LoginService} from "../../services/auth/login.service";


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerError: string = "";

  registerForm = this.fb.group({
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    dni: ['', [Validators.required, Validators.maxLength(8)]],
    telefono: [''],
    direccion: [''],
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) {}

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.registerError = "";

    this.loginService.register(this.registerForm.value).subscribe({
      next: (res) => {
        console.log("Registro exitoso", res);

        // si backend devuelve token
        if (res.token) {
          sessionStorage.setItem("token", res.token);
        }

        this.router.navigate(['/iniciar-sesion']);
      },
      error: (err) => {
        console.error(err);
        this.registerError = err.message || "Error al registrar usuario";
      }
    });
  }
}
