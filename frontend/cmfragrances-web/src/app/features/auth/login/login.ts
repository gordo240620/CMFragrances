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


    // ==========================================
    // SERVICIOS
    // ==========================================

    private authService = inject(Auth);

    private router = inject(Router);


    // ==========================================
    // ESTADO
    // ==========================================

    mostrarPassword = false;

    cargando = false;

    mensajeError = '';


    // ==========================================
    // DATOS LOGIN
    // ==========================================

    loginData: LoginRequest = {

        correo: '',

        password: ''

    };


    // ==========================================
    // INICIAR SESIÓN
    // ==========================================

    iniciarSesion(form: NgForm) {

        // ==========================================
        // LIMPIAR MENSAJE
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

        this.authService
            .login(this.loginData)
            .subscribe({

                next: (respuesta) => {

                    this.cargando = false;


                    // ==================================
                    // GUARDAR TOKEN
                    // ==================================

                    const token =
                        respuesta.token ?? '';


                    localStorage.setItem(
                        'token',
                        token
                    );


                    // ==================================
                    // OBTENER DATOS DEL JWT
                    // ==================================

                    const datosToken =
                        this.obtenerDatosDelToken(token);


                    console.log(
                        'Datos del JWT:',
                        datosToken
                    );


                    // ==================================
                    // OBTENER ID DEL USUARIO
                    // ==================================

                    const usuarioId =
                        this.obtenerUsuarioId(
                            datosToken
                        );


                    console.log(
                        'Usuario ID detectado:',
                        usuarioId
                    );


                    // ==================================
                    // GUARDAR ID DEL USUARIO
                    // ==================================

                    if (
                        usuarioId !== null &&
                        usuarioId > 0
                    ) {

                        localStorage.setItem(
                            'usuarioId',
                            usuarioId.toString()
                        );

                    }


                    // ==================================
                    // GUARDAR INFORMACIÓN DEL USUARIO
                    // ==================================

                    const usuario = {

                        id: usuarioId,

                        correo:
                            this.loginData.correo,

                        rol:
                            this.obtenerRolDelToken(
                                token
                            )

                    };


                    localStorage.setItem(
                        'usuario',
                        JSON.stringify(usuario)
                    );


                    // ==================================
                    // OBTENER ROL
                    // ==================================

                    const rol =
                        this.obtenerRolDelToken(
                            token
                        );


                    console.log(
                        'Rol detectado:',
                        rol
                    );


                    // ==================================
                    // REDIRECCIÓN
                    // ==================================

                    if (

                        typeof rol === 'string' &&

                        (
                            rol.toLowerCase() === 'admin' ||

                            rol.toLowerCase() ===
                                'administrador'
                        )

                    ) {

                        console.log(
                            'Administrador detectado. Entrando al panel.'
                        );


                        this.router.navigate([
                            '/admin'
                        ]);

                    }

                    else {

                        console.log(
                            'Usuario normal detectado. Entrando al Home.'
                        );


                        this.router.navigate([
                            '/home'
                        ]);

                    }

                },


                // ==================================
                // ERROR
                // ==================================

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
    // DECODIFICAR JWT
    // ==========================================

    private obtenerDatosDelToken(
        token: string
    ): any | null {

        try {

            // ======================================
            // VALIDAR TOKEN
            // ======================================

            if (!token) {

                return null;

            }


            // ======================================
            // JWT TIENE 3 PARTES
            // ======================================

            const partes =
                token.split('.');


            if (
                partes.length !== 3
            ) {

                return null;

            }


            // ======================================
            // PAYLOAD
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
            // PADDING
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


            return JSON.parse(
                decodedPayload
            );

        }

        catch (error) {

            console.error(
                'No se pudo leer el JWT:',
                error
            );

            return null;

        }

    }


    // ==========================================
    // OBTENER ID DEL USUARIO
    // ==========================================

    private obtenerUsuarioId(
        datos: any
    ): number | null {

        if (!datos) {

            return null;

        }


        // ======================================
        // POSIBLES CLAIMS DEL ID
        // ======================================

        const id =

            datos['usuarioId']

            ??

            datos['userId']

            ??

            datos['UsuarioId']

            ??

            datos['UserId']

            ??

            datos['id']

            ??

            datos['Id']

            ??

            datos['sub']

            ??

            datos[
                'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
            ]

            ??

            datos[
                'http://schemas.microsoft.com/ws/2008/06/identity/claims/nameidentifier'
            ]

            ??

            null;


        if (
            id === null ||
            id === undefined
        ) {

            console.warn(
                'No se encontró el ID del usuario dentro del JWT.'
            );

            return null;

        }


        const numeroId =
            Number(id);


        if (
            isNaN(numeroId) ||
            numeroId <= 0
        ) {

            console.warn(
                'El ID encontrado en el JWT no es válido:',
                id
            );

            return null;

        }


        return numeroId;

    }


    // ==========================================
    // OBTENER ROL DEL JWT
    // ==========================================

    private obtenerRolDelToken(
        token: string
    ): string | null {

        const datos =
            this.obtenerDatosDelToken(
                token
            );


        if (!datos) {

            return null;

        }


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

}