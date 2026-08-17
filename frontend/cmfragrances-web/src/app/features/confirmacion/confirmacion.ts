import {
    Component,
    OnInit,
    OnDestroy,
    inject,
    ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
    ActivatedRoute,
    Router
} from '@angular/router';

import { PedidoService } from '../../core/services/pedido';


@Component({

    selector: 'app-confirmacion',

    standalone: true,

    imports: [
        CommonModule
    ],

    templateUrl: './confirmacion.html',

    styleUrl: './confirmacion.css'

})
export class Confirmacion
    implements OnInit, OnDestroy {


    // ==========================================
    // SERVICIOS
    // ==========================================

    private route =
        inject(ActivatedRoute);

    private router =
        inject(Router);

    private pedidoService =
        inject(PedidoService);

    private cdr =
        inject(ChangeDetectorRef);


    // ==========================================
    // PEDIDO
    // ==========================================

    pedido: any = null;


    // ==========================================
    // ESTADO
    // ==========================================

    cargando = true;

    mensajeError = '';


    // ==========================================
    // ID DEL PEDIDO
    // ==========================================

    idPedido = 0;


    // ==========================================
    // INTERVALO DE ACTUALIZACIÓN
    // ==========================================

    private intervaloActualizacion:
        ReturnType<typeof setInterval> | null = null;


    // ==========================================
    // ÚLTIMO ESTADO CONOCIDO
    // ==========================================

    private ultimoEstado = '';


    // ==========================================
    // ESTADOS DEL PEDIDO
    // ==========================================

    private readonly estadosPedido = [

        'Pagado',

        'Preparando',

        'Enviado',

        'Entregado'

    ];


    // ==========================================
    // NOMBRE DEL CLIENTE
    // ==========================================

    get nombreCliente(): string {

        if (!this.pedido?.usuario) {

            return 'Cliente CM Fragrances';

        }


        if (
            typeof this.pedido.usuario === 'string'
        ) {

            return this.pedido.usuario;

        }


        const nombre =
            this.pedido.usuario.nombre ?? '';

        const apellido =
            this.pedido.usuario.apellido ?? '';


        const nombreCompleto =
            `${nombre} ${apellido}`.trim();


        if (nombreCompleto) {

            return nombreCompleto;

        }


        return 'Cliente CM Fragrances';

    }


    // ==========================================
    // MENSAJE PRINCIPAL SEGÚN ESTADO
    // ==========================================

    get mensajeEstado(): string {

        const estado =
            (this.pedido?.estado ?? '')
                .trim()
                .toLowerCase();


        switch (estado) {

            case 'pagado':

                return 'Hemos recibido tu pedido';


            case 'preparando':

                return 'Estamos preparando tu pedido';


            case 'enviado':

                return 'Tu pedido está en camino';


            case 'entregado':

                return '¡Tu pedido fue entregado!';


            default:

                return 'Estamos preparando tu pedido';

        }

    }


    // ==========================================
    // DESCRIPCIÓN SEGÚN ESTADO
    // ==========================================

    get descripcionEstado(): string {

        const estado =
            (this.pedido?.estado ?? '')
                .trim()
                .toLowerCase();


        switch (estado) {

            case 'pagado':

                return 'Tu pago fue confirmado y estamos procesando tu pedido.';


            case 'preparando':

                return 'Nuestro equipo está preparando cuidadosamente tus fragancias.';


            case 'enviado':

                return 'Tu pedido ya salió y se encuentra en camino hacia ti.';


            case 'entregado':

                return 'Esperamos que disfrutes mucho tus fragancias. ¡Gracias por tu compra!';


            default:

                return 'Estamos preparando tu pedido.';

        }

    }


    // ==========================================
    // TEXTO DEL ESTADO
    // ==========================================

    get textoEstado(): string {

        const estado =
            (this.pedido?.estado ?? '')
                .trim()
                .toLowerCase();


        switch (estado) {

            case 'pagado':

                return 'Pedido recibido';


            case 'preparando':

                return 'En preparación';


            case 'enviado':

                return 'En camino';


            case 'entregado':

                return 'Entregado';


            default:

                return 'Confirmado';

        }

    }


    // ==========================================
    // POSICIÓN DEL ESTADO
    // ==========================================

    private obtenerPosicionEstado(
        estado: string
    ): number {

        const estadoNormalizado =
            (estado ?? '')
                .trim()
                .toLowerCase();


        return this.estadosPedido.findIndex(

            estadoActual =>

                estadoActual.toLowerCase() ===
                estadoNormalizado

        );

    }


    // ==========================================
    // ESTADO VISUAL DEL PASO
    // ==========================================

    estadoPaso(
        estadoPaso: string
    ): 'completed' | 'active' | 'pending' {

        const estadoActual =
            this.pedido?.estado ?? '';


        const posicionActual =
            this.obtenerPosicionEstado(
                estadoActual
            );


        const posicionPaso =
            this.obtenerPosicionEstado(
                estadoPaso
            );


        if (
            posicionActual < 0 ||
            posicionPaso < 0
        ) {

            return 'pending';

        }


        if (
            posicionPaso <
            posicionActual
        ) {

            return 'completed';

        }


        if (
            posicionPaso ===
            posicionActual
        ) {

            return 'active';

        }


        return 'pending';

    }


    // ==========================================
    // PASO COMPLETADO
    // ==========================================

    pasoCompletado(
        estadoPaso: string
    ): boolean {

        const estadoActual =
            this.pedido?.estado ?? '';


        const posicionActual =
            this.obtenerPosicionEstado(
                estadoActual
            );


        const posicionPaso =
            this.obtenerPosicionEstado(
                estadoPaso
            );


        if (
            posicionActual < 0 ||
            posicionPaso < 0
        ) {

            return false;

        }


        return posicionPaso <
            posicionActual;

    }


    // ==========================================
    // INICIALIZAR
    // ==========================================

    ngOnInit(): void {

        console.log(
            '================================'
        );

        console.log(
            'PÁGINA DE CONFIRMACIÓN INICIADA'
        );

        console.log(
            'ACTUALIZACIÓN AUTOMÁTICA ACTIVADA'
        );

        console.log(
            '================================'
        );


        const id = Number(

            this.route
                .snapshot
                .paramMap
                .get('id')

        );


        console.log(
            'ID DEL PEDIDO:',
            id
        );


        if (!id || id <= 0) {

            this.mensajeError =
                'No se encontró un pedido válido.';

            this.cargando = false;

            this.cdr.detectChanges();

            return;

        }


        this.idPedido = id;


        // ======================================
        // PEDIDO INICIAL
        // ======================================

        this.obtenerPedido(id);


        // ======================================
        // ACTUALIZACIÓN AUTOMÁTICA
        // ======================================

        this.iniciarActualizacionAutomatica();

    }


    // ==========================================
    // OBTENER PEDIDO
    // ==========================================

    private obtenerPedido(
        id: number
    ): void {

        this.pedidoService
            .obtenerPedido(id)
            .subscribe({

                next: (respuesta) => {

                    console.log(
                        'PEDIDO RECIBIDO:',
                        respuesta
                    );


                    const nuevoEstado =
                        respuesta?.estado ?? '';


                    // ==================================
                    // DETECTAR CAMBIO
                    // ==================================

                    if (
                        this.ultimoEstado &&
                        this.ultimoEstado !== nuevoEstado
                    ) {

                        console.log(
                            '================================'
                        );

                        console.log(
                            'CAMBIO DE ESTADO DETECTADO'
                        );

                        console.log(
                            'ESTADO ANTERIOR:',
                            this.ultimoEstado
                        );

                        console.log(
                            'NUEVO ESTADO:',
                            nuevoEstado
                        );

                        console.log(
                            '================================'
                        );

                    }


                    this.ultimoEstado =
                        nuevoEstado;


                    // ==================================
                    // ACTUALIZAR PEDIDO
                    // ==================================

                    this.pedido =
                        respuesta;


                    this.cargando =
                        false;


                    this.cdr.detectChanges();

                },


                error: (error) => {

                    console.error(
                        'ERROR AL ACTUALIZAR PEDIDO:',
                        error
                    );


                    if (!this.pedido) {

                        this.cargando =
                            false;

                        this.mensajeError =
                            'No fue posible cargar la información del pedido.';

                        this.cdr.detectChanges();

                    }

                }

            });

    }


    // ==========================================
    // ACTUALIZACIÓN AUTOMÁTICA
    // ==========================================

    private iniciarActualizacionAutomatica(): void {

        this.detenerActualizacionAutomatica();


        console.log(
            'Actualización automática cada 5 segundos.'
        );


        this.intervaloActualizacion =

            setInterval(() => {


                if (!this.idPedido) {

                    return;

                }


                console.log(
                    'Verificando estado del pedido...'
                );


                this.obtenerPedido(
                    this.idPedido
                );


            }, 5000);

    }


    // ==========================================
    // DETENER ACTUALIZACIÓN
    // ==========================================

    private detenerActualizacionAutomatica(): void {

        if (
            this.intervaloActualizacion !== null
        ) {

            clearInterval(
                this.intervaloActualizacion
            );


            this.intervaloActualizacion =
                null;

        }

    }


    // ==========================================
    // VOLVER AL INICIO
    // ==========================================

    volverInicio(): void {

        this.detenerActualizacionAutomatica();


        this.router.navigate([
            '/home'
        ]);

    }


    // ==========================================
    // SEGUIR COMPRANDO
    // ==========================================

    seguirComprando(): void {

        this.detenerActualizacionAutomatica();


        this.router.navigate([
            '/catalogo'
        ]);

    }


    // ==========================================
    // MIS PEDIDOS
    // ==========================================

    verPedidos(): void {

        this.detenerActualizacionAutomatica();


        this.router.navigate([
            '/pedidos'
        ]);

    }


    // ==========================================
    // DESTRUIR COMPONENTE
    // ==========================================

    ngOnDestroy(): void {

        console.log(
            'Cerrando actualización automática.'
        );


        this.detenerActualizacionAutomatica();

    }

}