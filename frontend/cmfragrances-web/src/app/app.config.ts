import { ApplicationConfig } from '@angular/core';

import {
    provideRouter,
    withInMemoryScrolling
} from '@angular/router';

import {
    provideHttpClient,
    withInterceptors
} from '@angular/common/http';

import { routes } from './app.routes';

import { authInterceptor } from './core/interceptors/auth.interceptor';


export const appConfig: ApplicationConfig = {

    providers: [

        // ==========================================
        // ROUTER
        // ==========================================

        provideRouter(

            routes,

            withInMemoryScrolling({

                anchorScrolling: 'enabled',

                scrollPositionRestoration: 'enabled'

            })

        ),


        // ==========================================
        // HTTP + JWT INTERCEPTOR
        // ==========================================

        provideHttpClient(

            withInterceptors([

                authInterceptor

            ])

        )

    ]

};