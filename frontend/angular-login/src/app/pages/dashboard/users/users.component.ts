import { Component, OnInit } from '@angular/core';
import { UserService, UserDTO } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: UserDTO[] = [];
  selectedUser: any = null;
  isEditing: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: (res) => this.users = res,
      error: () => this.showToast('error', 'Error de conexión')
    });
  }

  createNew() {
    this.isEditing = false;
    this.selectedUser = {
      username: '',
      password: '',
      role: 'USER', // ✅ Coincide con tu Enum Java
      enabled: true
    };
  }

  edit(user: UserDTO) {
    this.isEditing = true;
    this.selectedUser = { ...user };
  }

  save() {
    if (this.isEditing) {
      this.userService.update(this.selectedUser.id, this.selectedUser).subscribe({
        next: () => this.success('Actualizado'),
        error: () => this.showToast('error', 'Error al actualizar')
      });
    } else {
      this.userService.create(this.selectedUser).subscribe({
        next: () => this.success('Registrado'),
        error: () => this.showToast('error', 'Error al registrar')
      });
    }
  }

  success(msg: string) {
    this.selectedUser = null;
    this.loadUsers();
    this.showToast('success', msg);
  }

  delete(id: number) {
    Swal.fire({
      title: '¿Eliminar usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'No',
      background: '#ffffff'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.delete(id).subscribe(() => {
          this.loadUsers();
          this.showToast('success', 'Eliminado');
        });
      }
    });
  }

  toggle(id: number) {
    this.userService.toggleStatus(id).subscribe({
      next: () => {
        this.loadUsers();
        this.showToast('success', 'Estado cambiado');
      },
      error: () => {
        this.loadUsers();
        this.showToast('error', 'Error de servidor');
      }
    });
  }

  private showToast(icon: 'success' | 'error', title: string) {
    Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    }).fire({ icon, title });
  }
}
