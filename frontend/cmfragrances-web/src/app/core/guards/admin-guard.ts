import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = () => {

    const router = inject(Router);

    const token = localStorage.getItem('token');


    // ==========================================
    // NO HAY TOKEN
    // ==========================================

    if (!token) {

        router.navigate(['/login']);

        return false;
    }


    try {

        // ==========================================
        // SEPARAR JWT
        // ==========================================

        const partes = token.split('.');


        if (partes.length !== 3) {

            throw new Error('Token inválido');

        }


        // ==========================================
        // DECODIFICAR PAYLOAD
        // ==========================================

        let payload = partes[1];

        payload = payload
            .replace(/-/g, '+')
            .replace(/_/g, '/');


        while (payload.length % 4 !== 0) {

            payload += '=';

        }


        const datos = JSON.parse(
            atob(payload)
        );


        // ==========================================
        // OBTENER ROL
        // ==========================================

        const rol =

            datos[
                'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
            ]

            ??

            datos['role']

            ??

            datos['http://schemas.microsoft.com/ws/2008/06/identity/claims/Role']

            ??

            null;


        console.log('ROL DEL TOKEN:', rol);


        // ==========================================
        // COMPROBAR ROL
        // ==========================================

        if (
            typeof rol === 'string' &&
            (
                rol.toLowerCase() === 'admin' ||
                rol.toLowerCase() === 'administrador'
            )
        ) {

            return true;

        }


        // ==========================================
        // NO ES ADMIN
        // ==========================================

        console.log('Acceso rechazado. Rol:', rol);

        router.navigate(['/home']);

        return false;


    } catch (error) {

        console.error(
            'Error al validar token:',
            error
        );

        localStorage.removeItem('token');

        router.navigate(['/login']);

        return false;

    }

};