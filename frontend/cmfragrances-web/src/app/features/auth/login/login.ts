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

        // ==========================================
        // LIMPIAR MENSAJE ANTERIOR
        // ==========================================

        this.mensajeError = '';


        // ==========================================
        // VALIDAR FORMULARIO
        // ==========================================

        if (form.invalid) {

            form.control.markAllAsTouched();

            this.mensajeError =
                'Completa correctamente los campos.';

            return;
        }


        // ==========================================
        // QUITAR ESPACIOS
        // ==========================================

        this.loginData.correo =
            this.loginData.correo.trim();

        this.loginData.password =
            this.loginData.password.trim();


        this.cargando = true;


        // ==========================================
        // LOGIN
        // ==========================================

        this.authService.login(this.loginData).subscribe({

            next: (respuesta) => {

                this.cargando = false;


                // ==================================
                // GUARDAR TOKEN
                // ==================================

                const token = respuesta.token ?? '';

                localStorage.setItem(
                    'token',
                    token
                );


                // ==================================
                // VERIFICAR ROL
                // ==================================

                const rol =
                    this.obtenerRolDelToken(token);


                console.log('Rol detectado:', rol);


                // ==================================
                // REDIRECCIÓN SEGÚN ROL
                // ==================================

                if (
                    typeof rol === 'string' &&
                    (
                        rol.toLowerCase() === 'admin' ||
                        rol.toLowerCase() === 'administrador'
                    )
                ) {

                    console.log(
                        'Administrador detectado. Entrando al panel.'
                    );

                    this.router.navigate(['/admin']);

                } else {

                    console.log(
                        'Usuario normal detectado. Entrando al Home.'
                    );

                    this.router.navigate(['/home']);

                }

            },


            error: (error) => {

                this.cargando = false;


                switch (error.status) {

                    case 401:

                        this.mensajeError =
                            'Correo o contraseña incorrectos.';

                        break;


                    case 0:

                        this.mensajeError =
                            'No fue posible conectar con el servidor.';

                        break;


                    default:

                        this.mensajeError =
                            'Ocurrió un error inesperado.';

                        break;

                }

            }

        });

    }


    // ==========================================
    // OBTENER ROL DEL JWT
    // ==========================================

    private obtenerRolDelToken(
        token: string
    ): string | null {

        try {

            // ======================================
            // VALIDAR TOKEN
            // ======================================

            if (!token) {

                return null;

            }


            // ======================================
            // JWT TIENE 3 PARTES
            // HEADER.PAYLOAD.SIGNATURE
            // ======================================

            const partes =
                token.split('.');


            if (partes.length !== 3) {

                return null;

            }


            // ======================================
            // OBTENER PAYLOAD
            // ======================================

            let payload =
                partes[1];


            // ======================================
            // BASE64URL → BASE64
            // ======================================

            payload = payload
                .replace(/-/g, '+')
                .replace(/_/g, '/');


            // ======================================
            // AGREGAR PADDING
            // ======================================

            while (
                payload.length % 4 !== 0
            ) {

                payload += '=';

            }


            // ======================================
            // DECODIFICAR
            // ======================================

            const decodedPayload =
                atob(payload);


            const datos =
                JSON.parse(decodedPayload);


            // ======================================
            // OBTENER CLAIM DEL ROL
            // ======================================

            const rol =
                datos[
                    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
                ]

                ??

                datos['role']

                ??

                datos[
                    'http://schemas.microsoft.com/ws/2008/06/identity/claims/Role'
                ]

                ??

                null;


            console.log(
                'Rol encontrado dentro del JWT:',
                rol
            );


            return rol;

        }

        catch (error) {

            console.error(
                'No se pudo leer el JWT:',
                error
            );

            return null;

        }

    }

}