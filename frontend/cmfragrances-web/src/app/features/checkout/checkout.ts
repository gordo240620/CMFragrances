import {
    Component,
    inject,
    ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';

import { forkJoin } from 'rxjs';

import {
    Carrito as CarritoService,
    ProductoCarrito
} from '../../core/services/carrito';

import { PedidoService } from '../../core/services/pedido';


@Component({

    selector: 'app-checkout',

    standalone: true,

    imports: [
        CommonModule
    ],

    templateUrl: './checkout.html',

    styleUrl: './checkout.css'

})
export class Checkout {


    // ==========================================
    // SERVICIOS
    // ==========================================

    private carritoService =
        inject(CarritoService);

    private pedidoService =
        inject(PedidoService);

    private router =
        inject(Router);

    private cdr =
        inject(ChangeDetectorRef);


    // ==========================================
    // ESTADO DEL CHECKOUT
    // ==========================================

    procesandoPago = false;

    pagoAprobado = false;

    pagoRechazado = false;

    mensajePago = '';

    pedidoCreado = false;

    idPedido = 0;


    // ==========================================
    // MÉTODO DE PAGO
    // ==========================================

    metodoPago: string = 'tarjeta';


    // ==========================================
    // DATOS DE ENVÍO
    // ==========================================

    nombreCompleto = '';

    telefono = '';

    direccion = '';

    ciudad = '';

    codigoPostal = '';


    // ==========================================
    // DATOS DE TARJETA
    // ==========================================

    numeroTarjeta = '';

    nombreTitular = '';

    fechaVencimiento = '';

    cvv = '';


    // ==========================================
    // PRODUCTOS
    // ==========================================

    get productos(): ProductoCarrito[] {

        return this.carritoService.obtenerProductos();

    }


    // ==========================================
    // CANTIDAD TOTAL
    // ==========================================

    get cantidadTotal(): number {

        return this.carritoService.obtenerCantidad();

    }


    // ==========================================
    // SUBTOTAL
    // ==========================================

    get subtotal(): number {

        return this.carritoService.obtenerSubtotal();

    }


    // ==========================================
    // ENVÍO
    // ==========================================

    get envio(): number {

        if (this.productos.length === 0) {

            return 0;

        }

        return 150;

    }


    // ==========================================
    // TOTAL
    // ==========================================

    get total(): number {

        return this.subtotal + this.envio;

    }


    // ==========================================
    // SELECCIONAR MÉTODO DE PAGO
    // ==========================================

    seleccionarMetodoPago(
        metodo: string
    ): void {

        if (this.procesandoPago) {

            return;

        }

        this.metodoPago = metodo;

        this.mensajePago = '';

        this.pagoRechazado = false;

        this.cdr.detectChanges();

    }


    // ==========================================
    // AUMENTAR CANTIDAD
    // ==========================================

    aumentarCantidad(
        id: number
    ): void {

        this.carritoService.aumentarCantidad(id);

        this.cdr.detectChanges();

    }


    // ==========================================
    // DISMINUIR CANTIDAD
    // ==========================================

    disminuirCantidad(
        id: number
    ): void {

        this.carritoService.disminuirCantidad(id);

        this.cdr.detectChanges();

    }


    // ==========================================
    // ELIMINAR PRODUCTO
    // ==========================================

    eliminarProducto(
        id: number
    ): void {

        this.carritoService.eliminarProducto(id);

        this.cdr.detectChanges();

    }


    // ==========================================
    // VALIDAR DATOS DE ENVÍO
    // ==========================================

    private validarDatosEnvio(): boolean {

        if (!this.nombreCompleto.trim()) {

            this.mensajePago =
                'Ingresa tu nombre completo.';

            return false;

        }


        if (!this.telefono.trim()) {

            this.mensajePago =
                'Ingresa tu número de teléfono.';

            return false;

        }


        if (!this.direccion.trim()) {

            this.mensajePago =
                'Ingresa tu dirección.';

            return false;

        }


        if (!this.ciudad.trim()) {

            this.mensajePago =
                'Ingresa tu ciudad.';

            return false;

        }


        if (!this.codigoPostal.trim()) {

            this.mensajePago =
                'Ingresa tu código postal.';

            return false;

        }


        return true;

    }


    // ==========================================
    // VALIDAR TARJETA
    // ==========================================

    private validarTarjeta(): boolean {

        if (
            this.metodoPago !== 'tarjeta'
        ) {

            return true;

        }


        if (
            !this.numeroTarjeta.trim()
        ) {

            this.mensajePago =
                'Ingresa el número de tarjeta.';

            return false;

        }


        if (
            !this.nombreTitular.trim()
        ) {

            this.mensajePago =
                'Ingresa el nombre del titular.';

            return false;

        }


        if (
            !this.fechaVencimiento.trim()
        ) {

            this.mensajePago =
                'Ingresa la fecha de vencimiento.';

            return false;

        }


        if (
            !this.cvv.trim()
        ) {

            this.mensajePago =
                'Ingresa el CVV.';

            return false;

        }


        return true;

    }


    // ==========================================
    // OBTENER USUARIO DEL TOKEN
    // ==========================================

    private obtenerUsuarioId(): number {

        try {

            const token =
                localStorage.getItem('token');


            if (!token) {

                return 0;

            }


            const partes =
                token.split('.');


            if (partes.length !== 3) {

                return 0;

            }


            let payload =
                partes[1];


            payload =
                payload
                    .replace(/-/g, '+')
                    .replace(/_/g, '/');


            while (
                payload.length % 4 !== 0
            ) {

                payload += '=';

            }


            const datos =
                JSON.parse(
                    atob(payload)
                );


            const usuarioId =
                datos[
                    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
                ]
                ??
                datos[
                    'http://schemas.microsoft.com/ws/2008/06/identity/claims/nameidentifier'
                ]
                ??
                datos['sub']
                ??
                datos['id']
                ??
                datos['usuarioId'];


            const id =
                Number(usuarioId);


            if (
                Number.isFinite(id)
                &&
                id > 0
            ) {

                return id;

            }


            return 0;

        }

        catch (error) {

            console.error(
                'No se pudo obtener el usuario del JWT:',
                error
            );

            return 0;

        }

    }


    // ==========================================
    // PAGAR
    // ==========================================

    pagar(): void {

        // ======================================
        // VERIFICAR CARRITO
        // ======================================

        if (
            this.productos.length === 0
        ) {

            this.mensajePago =
                'Tu carrito está vacío.';

            this.cdr.detectChanges();

            return;

        }


        // ======================================
        // EVITAR DOBLE PAGO
        // ======================================

        if (
            this.procesandoPago
        ) {

            return;

        }


        // ======================================
        // LIMPIAR MENSAJES
        // ======================================

        this.mensajePago = '';

        this.pagoRechazado = false;

        this.pagoAprobado = false;


        // ======================================
        // VALIDAR ENVÍO
        // ======================================

        if (
            !this.validarDatosEnvio()
        ) {

            this.cdr.detectChanges();

            return;

        }


        // ======================================
        // VALIDAR TARJETA
        // ======================================

        if (
            !this.validarTarjeta()
        ) {

            this.cdr.detectChanges();

            return;

        }


        // ======================================
        // OBTENER USUARIO
        // ======================================

        const usuarioId =
            this.obtenerUsuarioId();


        console.log(
            '================================'
        );

        console.log(
            'USUARIO DEL PEDIDO:',
            usuarioId
        );

        console.log(
            '================================'
        );


        if (!usuarioId) {

            this.mensajePago =
                'No se pudo identificar al usuario. Inicia sesión nuevamente.';

            this.cdr.detectChanges();

            return;

        }


        // ======================================
        // INICIAR PROCESAMIENTO
        // ======================================

        this.procesandoPago = true;

        this.mensajePago =
            'Procesando pago...';


        this.cdr.detectChanges();


        console.log(
            '================================'
        );

        console.log(
            'INICIANDO PAGO SIMULADO'
        );

        console.log(
            'MÉTODO:',
            this.metodoPago
        );

        console.log(
            'TOTAL:',
            this.total
        );

        console.log(
            'USUARIO:',
            usuarioId
        );

        console.log(
            'PRODUCTOS:',
            this.productos
        );

        console.log(
            '================================'
        );


        // ======================================
        // SIMULAR PASARELA DE PAGO
        // ======================================

        setTimeout(() => {

            this.simularPago(
                usuarioId
            );

            this.cdr.detectChanges();

        }, 2500);

    }


    // ==========================================
    // SIMULAR PAGO
    // ==========================================

    private simularPago(
        usuarioId: number
    ): void {

        /*
         * Pago completamente simulado.
         *
         * No utilizamos ninguna pasarela real.
         *
         * Después del tiempo de simulación
         * consideramos que el pago fue aprobado.
         */


        this.mensajePago =
            'Pago aprobado. Creando tu pedido...';


        console.log(
            '================================'
        );

        console.log(
            'PAGO SIMULADO APROBADO'
        );

        console.log(
            '================================'
        );


        this.cdr.detectChanges();


        // ======================================
        // CREAR PEDIDO
        // ======================================

        const pedido = {

            usuarioId: usuarioId,

            total: this.total,

            estado: 'Pagado'

        };


        console.log(
            'CREANDO PEDIDO:',
            pedido
        );


        this.pedidoService
            .crearPedido(pedido)
            .subscribe({

                next: (respuesta) => {

                    console.log(
                        '================================'
                    );

                    console.log(
                        'PEDIDO CREADO:',
                        respuesta
                    );

                    console.log(
                        '================================'
                    );


                    // ==================================
                    // OBTENER ID DEL PEDIDO
                    // ==================================

                    this.idPedido =
                        respuesta?.id
                        ??
                        respuesta?.Id
                        ??
                        0;


                    if (!this.idPedido) {

                        console.error(
                            'El pedido fue creado pero no se recibió su ID.'
                        );


                        this.procesandoPago =
                            false;

                        this.pagoRechazado =
                            true;

                        this.pagoAprobado =
                            false;

                        this.mensajePago =
                            'El pedido fue creado, pero no se pudo obtener su identificador.';


                        this.cdr.detectChanges();

                        return;

                    }


                    console.log(
                        'ID DEL PEDIDO:',
                        this.idPedido
                    );


                    // ==================================
                    // CREAR DETALLES
                    // ==================================

                    this.crearDetallesPedido();

                },


                error: (error) => {

                    console.error(
                        '================================'
                    );

                    console.error(
                        'ERROR AL CREAR PEDIDO'
                    );

                    console.error(
                        error
                    );

                    console.error(
                        '================================'
                    );


                    this.procesandoPago =
                        false;

                    this.pagoRechazado =
                        true;

                    this.pagoAprobado =
                        false;

                    this.mensajePago =
                        'No fue posible registrar el pedido. Intenta nuevamente.';


                    this.cdr.detectChanges();

                }

            });

    }


    // ==========================================
    // CREAR DETALLES DEL PEDIDO
    // ==========================================

    private crearDetallesPedido(): void {

        console.log(
            '================================'
        );

        console.log(
            'CREANDO DETALLES DEL PEDIDO'
        );

        console.log(
            'PEDIDO:',
            this.idPedido
        );

        console.log(
            'PRODUCTOS:',
            this.productos
        );

        console.log(
            '================================'
        );


        // ======================================
        // VERIFICAR PRODUCTOS
        // ======================================

        if (
            this.productos.length === 0
        ) {

            this.finalizarPedido();

            return;

        }


        // ======================================
        // CREAR REQUESTS
        // ======================================

        const solicitudes =

            this.productos.map(
                (producto) => {

                    const detalle = {

                        pedidoId:
                            this.idPedido,

                        perfumeId:
                            producto.id,

                        cantidad:
                            producto.cantidad,

                        precio:
                            producto.precio

                    };


                    console.log(
                        'CREANDO DETALLE:',
                        detalle
                    );


                    return this.pedidoService
                        .crearDetallePedido(
                            detalle
                        );

                }
            );


        // ======================================
        // ESPERAR TODOS LOS DETALLES
        // ======================================

        forkJoin(
            solicitudes
        )
        .subscribe({

            next: (respuestas) => {

                console.log(
                    '================================'
                );

                console.log(
                    'TODOS LOS DETALLES CREADOS'
                );

                console.log(
                    'DETALLES RECIBIDOS:',
                    respuestas
                );

                console.log(
                    '================================'
                );


                // ==================================
                // FINALIZAR PEDIDO
                // ==================================

                this.finalizarPedido();

            },


            error: (error) => {

                console.error(
                    '================================'
                );

                console.error(
                    'ERROR AL CREAR DETALLES'
                );

                console.error(
                    error
                );

                console.error(
                    '================================'
                );


                this.procesandoPago =
                    false;

                this.pagoRechazado =
                    true;

                this.pagoAprobado =
                    false;

                this.mensajePago =
                    'El pedido fue creado, pero ocurrió un error al registrar uno de los productos.';


                this.cdr.detectChanges();

            }

        });

    }


    // ==========================================
    // FINALIZAR PEDIDO
    // ==========================================

    private finalizarPedido(): void {

        console.log(
            '================================'
        );

        console.log(
            'PEDIDO FINALIZADO'
        );

        console.log(
            'PEDIDO:',
            this.idPedido
        );

        console.log(
            'ESTADO:',
            'PAGADO'
        );

        console.log(
            '================================'
        );


        // ======================================
        // ACTUALIZAR ESTADO
        // ======================================

        this.procesandoPago =
            false;

        this.pagoAprobado =
            true;

        this.pagoRechazado =
            false;

        this.pedidoCreado =
            true;


        this.mensajePago =
            '¡Pago aprobado! Tu pedido fue creado correctamente.';


        // ======================================
        // VACIAR CARRITO
        // ======================================

        this.carritoService.vaciarCarrito();


        console.log(
            'CARRITO VACIADO'
        );


        // ======================================
        // FORZAR ACTUALIZACIÓN VISUAL
        // ======================================

        this.cdr.detectChanges();


        console.log(
            'VISTA ACTUALIZADA'
        );

    }


    // ==========================================
    // IR A CONFIRMACIÓN
    // ==========================================

    irAConfirmacion(): void {

        // Verificar que el pedido realmente exista
        if (
            !this.pedidoCreado ||
            !this.idPedido
        ) {

            console.warn(
                'No se puede ir a confirmación: pedido no creado.'
            );

            return;

        }


        console.log(
            '================================'
        );

        console.log(
            'NAVEGANDO A CONFIRMACIÓN'
        );

        console.log(
            'ID DEL PEDIDO:',
            this.idPedido
        );

        console.log(
            'RUTA:',
            `/confirmacion/${this.idPedido}`
        );

        console.log(
            '================================'
        );


        // ======================================
        // RUTA CORRECTA
        // ======================================

        this.router.navigate([
            '/confirmacion',
            this.idPedido
        ]);

    }


    // ==========================================
    // VOLVER AL CARRITO
    // ==========================================

    volverCarrito(): void {

        if (
            this.procesandoPago
        ) {

            return;

        }


        this.router.navigate([
            '/carrito'
        ]);

    }

}