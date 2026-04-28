import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/auth/login.service';
import { UserService, UserDTO } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css']
})
export class PersonalDetailsComponent implements OnInit {
  errorMessage: string = "";
  user?: UserDTO;
  userLoginOn: boolean = false;
  editMode: boolean = false;

  // Solo los campos que existen en tu base de datos
  registerForm = this.formBuilder.group({
    id: [0],
    username: ['', [Validators.required, Validators.email]],
    role: [''],
    enabled: [true]
  });

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.loginService.userLoginOn.subscribe({
      next: (status) => {
        this.userLoginOn = status;
        if (status) {
          this.loadUserData();
        }
      }
    });
  }

  loadUserData() {
    // IMPORTANTE: Verifica que en user.service.ts el método getMe() tenga el "return"
    this.userService.getMe().subscribe({
      next: (userData: UserDTO) => {
        this.user = userData;
        this.registerForm.patchValue({
          id: userData.id,
          username: userData.username,
          role: userData.role,
          enabled: userData.enabled
        });
      },
      error: (err) => {
        this.errorMessage = "Error al cargar los datos del usuario";
        console.error(err);
      }
    });
  }

  savePersonalDetailsData() {
    if (this.registerForm.valid && this.user?.id) {
      // Usamos el método update de tu servicio
      this.userService.update(this.user.id, this.registerForm.value as UserDTO).subscribe({
        next: () => {
          this.editMode = false;
          this.user = this.registerForm.value as UserDTO;
        },
        error: (err) => console.error(err)
      });
    }
  }
}
