import { HttpInterceptorFn } from '@angular/common/http';


export const authInterceptor: HttpInterceptorFn = (req, next) => {

    // ==========================================
    // OBTENER TOKEN
    // ==========================================

    const token = localStorage.getItem('token');


    // ==========================================
    // SI NO HAY TOKEN
    // ==========================================

    if (!token) {

        return next(req);

    }


    // ==========================================
    // AGREGAR JWT A LA PETICIÓN
    // ==========================================

    const requestConToken = req.clone({

        setHeaders: {

            Authorization: `Bearer ${token}`

        }

    });


    // ==========================================
    // ENVIAR PETICIÓN
    // ==========================================

    return next(requestConToken);

};