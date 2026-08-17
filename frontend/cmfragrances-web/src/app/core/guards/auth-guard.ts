import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';


export const authGuard: CanActivateFn = () => {

    const router = inject(Router);


    // ==========================================
    // VERIFICAR TOKEN
    // ==========================================

    const token =
        localStorage.getItem('token');


    // ==========================================
    // SI NO HAY TOKEN
    // ==========================================

    if (!token) {

        console.warn(
            'Usuario no autenticado. Redirigiendo al login.'
        );

        return router.createUrlTree([
            '/login'
        ]);

    }


    // ==========================================
    // USUARIO AUTENTICADO
    // ==========================================

    return true;

};