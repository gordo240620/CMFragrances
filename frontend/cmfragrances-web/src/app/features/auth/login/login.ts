import { Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Auth } from '../../../core/services/auth';
import { LoginRequest } from '../../../models/login-request.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private authService = inject(Auth);

  private router = inject(Router);

  loginData: LoginRequest = {
    correo: '',
    password: ''
  };

  // Inicio de sesión
  iniciarSesion() {

    this.authService.login(this.loginData).subscribe({

      next: (respuesta) => {

        // Guardar el token
        localStorage.setItem('token', respuesta.token ?? '');

        console.log("Token guardado");

        // Redireccionar al Home
        this.router.navigate(['/home']);

      },

      error: (error) => {

        console.error("Error");
        console.error(error);

      }

    });

  }

}