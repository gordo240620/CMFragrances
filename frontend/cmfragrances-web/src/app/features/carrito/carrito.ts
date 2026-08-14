import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';


import {
    Carrito as CarritoService,
    ProductoCarrito
} from '../../core/services/carrito';

import { PedidoService } from '../../core/services/pedido';


@Component({
    selector: 'app-carrito',
    standalone: true,
    imports: [DecimalPipe],
    templateUrl: './carrito.html',
    styleUrl: './carrito.css'
})
export class Carrito {


    // ==========================================
    // SERVICIOS
    // ==========================================

    private carritoService =
        inject(CarritoService);

    private pedidoService =
        inject(PedidoService);

    private router =
        inject(Router);


    // ==========================================
    // ESTADO
    // ==========================================

    procesandoPedido = false;


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
    // AUMENTAR CANTIDAD
    // ==========================================

    aumentarCantidad(id: number): void {

        this.carritoService.aumentarCantidad(id);

    }


    // ==========================================
    // DISMINUIR CANTIDAD
    // ==========================================

    disminuirCantidad(id: number): void {

        this.carritoService.disminuirCantidad(id);

    }


    // ==========================================
    // ELIMINAR PRODUCTO
    // ==========================================

    eliminarProducto(id: number): void {

        this.carritoService.eliminarProducto(id);

    }


    // ==========================================
    // VACIAR CARRITO
    // ==========================================

    vaciarCarrito(): void {

        this.carritoService.vaciarCarrito();

    }


    // ==========================================
    // OBTENER ID DEL USUARIO
    // ==========================================

    private obtenerUsuarioId(): number {

        const token =
            localStorage.getItem('token');


        if (!token) {

            return 0;

        }


        try {

            const payload =
                token.split('.')[1];


            const base64 =
                payload
                    .replace(/-/g, '+')
                    .replace(/_/g, '/');


            const decoded =
                JSON.parse(
                    atob(base64)
                );


            const usuarioId =
                decoded[
                    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
                ];


            return Number(usuarioId);

        }
        catch (error) {

            console.error(
                'Error al obtener usuario del token:',
                error
            );

            return 0;

        }

    }


    // ==========================================
    // CONTINUAR CON EL PEDIDO
    // ==========================================

    continuarPedido(): void {


        // ======================================
        // EVITAR DOBLE CLIC
        // ======================================

        if (this.procesandoPedido) {

            return;

        }


        // ======================================
        // VERIFICAR CARRITO
        // ======================================

        if (this.productos.length === 0) {

            alert(
                'Tu carrito está vacío.'
            );

            return;

        }


        // ======================================
        // OBTENER USUARIO
        // ======================================

        const usuarioId =
            this.obtenerUsuarioId();


        if (!usuarioId) {

            alert(
                'No se pudo identificar al usuario. Inicia sesión nuevamente.'
            );

            this.router.navigate([
                '/login'
            ]);

            return;

        }


        // ======================================
        // ACTIVAR PROCESANDO
        // ======================================

        this.procesandoPedido = true;


        console.log(
            '================================'
        );

        console.log(
            'CREANDO PEDIDO'
        );

        console.log(
            'Usuario:',
            usuarioId
        );

        console.log(
            'Total:',
            this.subtotal
        );

        console.log(
            'Productos:',
            this.productos
        );

        console.log(
            '================================'
        );


        // ======================================
        // CREAR PEDIDO
        // ======================================

        const pedido = {

            usuarioId: usuarioId,

            fechaPedido:
                new Date().toISOString(),

            total:
                this.subtotal,

            estado:
                'Pendiente'

        };


        this.pedidoService
            .crearPedido(pedido)
            .subscribe({

                next: (pedidoCreado) => {


                    console.log(
                        'PEDIDO CREADO:',
                        pedidoCreado
                    );


                    // ==================================
                    // OBTENER ID DEL PEDIDO
                    // ==================================

                    const pedidoId =
                        pedidoCreado.id;


                    if (!pedidoId) {

                        console.error(
                            'La API no devolvió el ID del pedido.'
                        );

                        this.procesandoPedido =
                            false;

                        alert(
                            'El pedido fue creado pero no se obtuvo su ID.'
                        );

                        return;

                    }


                    // ==================================
                    // CREAR DETALLES
                    // ==================================

                    const peticiones =
                        this.productos.map(
                            producto => {

                                const detalle = {

                                    pedidoId:
                                        pedidoId,

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


                    // ==================================
                    // GUARDAR TODOS LOS DETALLES
                    // ==================================

                    forkJoin(peticiones)
                        .subscribe({

                            next: (detalles) => {

                                console.log(
                                    'DETALLES CREADOS:',
                                    detalles
                                );


                                // ==========================
                                // LIMPIAR CARRITO
                                // ==========================

                                this.carritoService
                                    .vaciarCarrito();


                                this.procesandoPedido =
                                    false;


                                // ==========================
                                // CONFIRMACIÓN
                                // ==========================

                                alert(
                                    `Pedido #${pedidoId} creado correctamente.`
                                );


                                console.log(
                                    'PEDIDO FINALIZADO:',
                                    pedidoId
                                );

                            },


                            error: (error) => {

                                console.error(
                                    'ERROR AL CREAR DETALLES:',
                                    error
                                );


                                this.procesandoPedido =
                                    false;


                                alert(
                                    'El pedido se creó, pero ocurrió un error al guardar sus productos.'
                                );

                            }

                        });

                },


                error: (error) => {

                    console.error(
                        'ERROR AL CREAR PEDIDO:',
                        error
                    );


                    this.procesandoPedido =
                        false;


                    alert(
                        'No se pudo crear el pedido.'
                    );

                }

            });

    }

}