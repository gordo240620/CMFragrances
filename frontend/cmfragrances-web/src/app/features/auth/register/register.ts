import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

import { Auth } from '../../../core/services/auth';
import { RegisterRequest } from '../../../models/register-request.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  mostrarPassword = false;

  mostrarConfirmar = false;

  cargando = false;

  mensajeError = '';

  mensajeExito = '';

  confirmarPassword = '';

  registerData: RegisterRequest = {

    nombre: '',

    apellido: '',

    correo: '',

    telefono: '',

    password: ''

  };

  registrarUsuario() {

    this.mensajeError = '';
    this.mensajeExito = '';

    // Limpiar espacios
    this.registerData.nombre = this.registerData.nombre.trim();
    this.registerData.apellido = this.registerData.apellido.trim();
    this.registerData.correo = this.registerData.correo.trim();
    this.registerData.telefono = this.registerData.telefono?.trim() ?? '';
    this.registerData.password = this.registerData.password.trim();
    this.confirmarPassword = this.confirmarPassword.trim();

    // Validar campos obligatorios
    if (
      !this.registerData.nombre ||
      !this.registerData.apellido ||
      !this.registerData.correo ||
      !this.registerData.password
    ) {

      this.mensajeError = 'Completa todos los campos obligatorios.';
      return;

    }

    // Validar contraseñas
    if (this.registerData.password !== this.confirmarPassword) {

      this.mensajeError = 'Las contraseñas no coinciden.';
      return;

    }

    this.cargando = true;

    this.authService.register(this.registerData).subscribe({

      next: (respuesta) => {

        this.cargando = false;

        this.mensajeExito = respuesta.message || 'Cuenta creada correctamente.';

        // Limpiar formulario
        this.registerData = {

          nombre: '',

          apellido: '',

          correo: '',

          telefono: '',

          password: ''

        };

        this.confirmarPassword = '';

        // Redireccionar al Login
        setTimeout(() => {

          this.router.navigate(['/login']);

        }, 1500);

      },

      error: (error) => {

        this.cargando = false;

        if (error.status === 400) {

          this.mensajeError =
            error.error?.message || 'No fue posible registrar el usuario.';

        }
        else if (error.status === 0) {

          this.mensajeError = 'No fue posible conectar con el servidor.';

        }
        else {

          this.mensajeError = 'Ocurrió un error inesperado.';

        }

      }

    });

  }

}