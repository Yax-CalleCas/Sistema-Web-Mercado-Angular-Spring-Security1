import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {

    //  1. Obtener el token del sessionStorage
    const token = sessionStorage.getItem('token');

    //  2. Si existe el token → permite acceso
    if (token && token.trim() !== '') {
      return true;
    }

    // 3. Si NO hay token → redirige al login
    this.router.navigate(['/iniciar-sesion']);
    return false;
  }
}
