import { Routes } from '@angular/router';


import { Login } from './features/auth/login/login';


import { Register } from './features/auth/register/register';


import { Home } from './features/home/home';


import { MainLayout } from './layouts/main-layout/main-layout';


import { Carrito } from './features/carrito/carrito';


import { Admin } from './features/admin/admin';


import { Pedidos } from './features/pedidos/pedidos/pedidos';


import { Perfumes } from './features/admin/perfumes/perfumes';


import { Catalogo } from './features/catalogo/catalogo';


import { PerfumeDetalle } from './features/perfume-detalle/perfume-detalle';


import { Checkout } from './features/checkout/checkout';


import { Confirmacion } from './features/confirmacion/confirmacion';


import { MisCompras } from './features/mis-compras/mis-compras';


import { adminGuard } from './core/guards/admin-guard';


import { authGuard } from './core/guards/auth-guard';



export const routes: Routes = [


    // ==========================================
    // LOGIN
    // ==========================================

    {

        path: '',

        redirectTo: 'login',

        pathMatch: 'full'

    },


    // ==========================================
    // AUTENTICACIÓN
    // ==========================================

    {

        path: 'login',

        component: Login

    },


    {

        path: 'register',

        component: Register

    },


    // ==========================================
    // PANEL ADMINISTRADOR
    // ==========================================

    {

        path: 'admin',

        component: Admin,

        canActivate: [adminGuard],


        children: [


            // ==================================
            // PERFUMES
            // ==================================

            {

                path: 'perfumes',

                component: Perfumes

            },


            // ==================================
            // PEDIDOS
            // ==================================

            {

                path: 'pedidos',

                component: Pedidos

            }


        ]

    },


    // ==========================================
    // LAYOUT PRINCIPAL
    // ==========================================

    {

        path: '',

        component: MainLayout,

        canActivate: [authGuard],


        children: [


            // ==================================
            // HOME
            // ==================================

            {

                path: 'home',

                component: Home

            },


            // ==================================
            // CATÁLOGO
            // ==================================

            {

                path: 'catalogo',

                component: Catalogo

            },


            // ==================================
            // DETALLE DEL PERFUME
            // ==================================

            {

                path: 'perfume/:id',

                component: PerfumeDetalle

            },


            // ==================================
            // CHECKOUT
            // ==================================

            {

                path: 'checkout',

                component: Checkout

            },


            // ==================================
            // CONFIRMACIÓN DEL PEDIDO
            // ==================================

            {

                path: 'confirmacion/:id',

                component: Confirmacion

            },


            // ==================================
            // MIS COMPRAS
            // ==================================

            {

                path: 'mis-compras',

                component: MisCompras

            },


            // ==================================
            // CARRITO
            // ==================================

            {

                path: 'carrito',

                component: Carrito

            }


        ]

    },


    // ==========================================
    // RUTA NO ENCONTRADA
    // ==========================================

    {

        path: '**',

        redirectTo: 'login'

    }

];