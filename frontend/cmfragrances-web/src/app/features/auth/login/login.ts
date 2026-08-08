import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Auth } from '../../../core/services/auth';
import { LoginRequest } from '../../../models/login-request.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private authService = inject(Auth);
  private router = inject(Router);

  mostrarPassword = false;

  cargando = false;

  mensajeError = '';

  loginData: LoginRequest = {
    correo: '',
    password: ''
  };

  iniciarSesion(form: NgForm) {

    // Limpiar mensaje anterior
    this.mensajeError = '';

    // Si el formulario es inválido
    if (form.invalid) {

      form.control.markAllAsTouched();

      this.mensajeError = 'Completa correctamente los campos.';

      return;

    }

    // Quitar espacios
    this.loginData.correo = this.loginData.correo.trim();
    this.loginData.password = this.loginData.password.trim();

    this.cargando = true;

    this.authService.login(this.loginData).subscribe({

      next: (respuesta) => {

        this.cargando = false;

        localStorage.setItem('token', respuesta.token ?? '');

        this.router.navigate(['/home']);

      },

      error: (error) => {

        this.cargando = false;

        switch (error.status) {

          case 401:
            this.mensajeError = 'Correo o contraseña incorrectos.';
            break;

          case 0:
            this.mensajeError = 'No fue posible conectar con el servidor.';
            break;

          default:
            this.mensajeError = 'Ocurrió un error inesperado.';
            break;

        }

      }

    });

  }

}