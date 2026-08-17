import {
    Component,
    OnInit,
    inject
} from '@angular/core';

import {
    CommonModule
} from '@angular/common';

import {
    Router,
    RouterLink,
    RouterOutlet
} from '@angular/router';

import {
    PedidoService
} from '../../core/services/pedido';


@Component({

    selector: 'app-admin',

    standalone: true,

    imports: [
        CommonModule,
        RouterLink,
        RouterOutlet
    ],

    templateUrl: './admin.html',

    styleUrl: './admin.css'

})
export class Admin implements OnInit {


    // ==========================================
    // ROUTER
    // ==========================================

    private router =
        inject(Router);


    // ==========================================
    // PEDIDOS
    // ==========================================

    private pedidoService =
        inject(PedidoService);


    // ==========================================
    // ESTADÍSTICAS
    // ==========================================

    totalVentas = 0;

    totalPedidos = 0;

    totalPerfumes = 0;


    // ==========================================
    // ACTIVIDAD RECIENTE
    // ==========================================

    pedidosRecientes: any[] = [];


    // ==========================================
    // CARGANDO
    // ==========================================

    cargandoResumen = true;


    // ==========================================
    // ERROR
    // ==========================================

    mensajeError = '';


    // ==========================================
    // INICIO
    // ==========================================

    ngOnInit(): void {

        this.cargarResumen();

    }


    // ==========================================
    // SABER SI ESTAMOS EN PEDIDOS
    // ==========================================

    esPedidos(): boolean {

        return this.router.url ===
            '/admin/pedidos';

    }


    // ==========================================
    // SABER SI ESTAMOS EN PERFUMES
    // ==========================================

    esPerfumes(): boolean {

        return this.router.url ===
            '/admin/perfumes';

    }


    // ==========================================
    // CARGAR RESUMEN GENERAL
    // ==========================================

    cargarResumen(): void {

        this.cargandoResumen = true;

        this.mensajeError = '';


        // ======================================
        // OBTENER PEDIDOS
        // ======================================

        this.pedidoService
            .obtenerPedidos()

            .subscribe({

                next: (pedidos) => {

                    console.log(
                        'Pedidos del resumen:',
                        pedidos
                    );


                    // ==================================
                    // GUARDAR LISTA
                    // ==================================

                    const listaPedidos =
                        Array.isArray(pedidos)
                            ? pedidos
                            : [];


                    // ==================================
                    // TOTAL DE PEDIDOS
                    // ==================================

                    this.totalPedidos =
                        listaPedidos.length;


                    // ==================================
                    // TOTAL DE VENTAS
                    // ==================================

                    this.totalVentas =
                        listaPedidos.reduce(

                            (
                                total,
                                pedido
                            ) => {

                                return total +
                                    Number(
                                        pedido.total ?? 0
                                    );

                            },

                            0

                        );


                    // ==================================
                    // ACTIVIDAD RECIENTE
                    // ==================================

                    this.pedidosRecientes =
                        [...listaPedidos]

                            .sort(
                                (
                                    a,
                                    b
                                ) => {

                                    const fechaA =
                                        new Date(
                                            a.fechaPedido ?? 0
                                        ).getTime();


                                    const fechaB =
                                        new Date(
                                            b.fechaPedido ?? 0
                                        ).getTime();


                                    return fechaB -
                                           fechaA;

                                }
                            )

                            .slice(
                                0,
                                5
                            );


                    console.log(
                        'Pedidos recientes:',
                        this.pedidosRecientes
                    );


                    // ==================================
                    // CARGAR PERFUMES
                    // ==================================

                    this.cargarTotalPerfumes();

                },


                error: (error) => {

                    console.error(
                        'Error al obtener pedidos:',
                        error
                    );


                    this.totalPedidos = 0;

                    this.totalVentas = 0;

                    this.pedidosRecientes = [];


                    this.mensajeError =
                        'No fue posible cargar los pedidos.';


                    this.cargarTotalPerfumes();

                }

            });

    }


    // ==========================================
    // CARGAR TOTAL DE PERFUMES
    // ==========================================

    private cargarTotalPerfumes(): void {

        /*
         * IMPORTANTE:
         *
         * Aquí dejamos HttpClient solamente
         * para perfumes.
         *
         * El problema estaba en consultar
         * Pedidos directamente desde aquí.
         */


        const apiUrl =
            'https://cmfragrances-api-rbev.onrender.com/api';


        fetch(
            `${apiUrl}/Perfumes`
        )

            .then(
                respuesta =>
                    respuesta.json()
            )

            .then(
                perfumes => {

                    const lista =
                        Array.isArray(perfumes)
                            ? perfumes
                            : [];


                    // ==================================
                    // SOLO PERFUMES PUBLICADOS
                    // ==================================

                    this.totalPerfumes =
                        lista.filter(
                            perfume =>
                                perfume.activo === true
                        ).length;


                    this.cargandoResumen =
                        false;

                }
            )

            .catch(
                error => {

                    console.error(
                        'Error al obtener perfumes:',
                        error
                    );


                    this.totalPerfumes = 0;

                    this.cargandoResumen =
                        false;

                }
            );

    }


    // ==========================================
    // FORMATEAR FECHA
    // ==========================================

    formatearFecha(
        fecha: any
    ): string {

        if (!fecha) {

            return '';

        }


        const fechaObj =
            new Date(fecha);


        if (
            isNaN(
                fechaObj.getTime()
            )
        ) {

            return '';

        }


        return fechaObj.toLocaleDateString(
            'es-MX',
            {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }
        );

    }


    // ==========================================
    // CERRAR SESIÓN
    // ==========================================

    cerrarSesion(): void {

        console.log(
            'Cerrando sesión del administrador...'
        );


        // ======================================
        // ELIMINAR TOKEN
        // ======================================

        localStorage.removeItem(
            'token'
        );


        // ======================================
        // ELIMINAR DATOS DE SESIÓN
        // ======================================

        localStorage.removeItem(
            'usuario'
        );


        localStorage.removeItem(
            'rol'
        );


        // ======================================
        // IR AL LOGIN
        // ======================================

        this.router.navigate([
            '/login'
        ]);

    }


    // ==========================================
    // IR A PEDIDOS
    // ==========================================

    verPedidos(): void {

        this.router.navigate([
            '/admin/pedidos'
        ]);

    }

}