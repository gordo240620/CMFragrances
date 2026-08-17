import {
    Component,
    inject,
    ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PedidoService } from '../../../core/services/pedido';


@Component({

    selector: 'app-pedidos',

    standalone: true,

    imports: [
        CommonModule,
        FormsModule
    ],

    templateUrl: './pedidos.html',

    styleUrl: './pedidos.css'

})
export class Pedidos {


    // ==========================================
    // SERVICIOS
    // ==========================================

    private pedidoService =
        inject(PedidoService);


    private cdr =
        inject(ChangeDetectorRef);



    // ==========================================
    // PEDIDOS
    // ==========================================

    pedidos: any[] = [];

    pedidosFiltrados: any[] = [];



    // ==========================================
    // DETALLES DE PEDIDOS
    // ==========================================

    detallesPedido: any[] = [];



    // ==========================================
    // PEDIDO SELECCIONADO
    // ==========================================

    modalVisible = false;

    pedidoSeleccionado: any = null;

    detallesSeleccionados: any[] = [];



    // ==========================================
    // CAMBIO DE ESTADO
    // ==========================================

    estadoEditando = '';

    guardandoEstado = false;

    mensajeEstado = '';



    // ==========================================
    // ESTADOS
    // ==========================================

    cargando = false;

    mensajeError = '';



    // ==========================================
    // FILTROS
    // ==========================================

    busqueda = '';

    estadoSeleccionado = 'Todos';



    // ==========================================
    // INICIALIZAR
    // ==========================================

    ngOnInit(): void {

        console.log(
            'Iniciando página de pedidos...'
        );

        this.cargarPedidos();

    }



    // ==========================================
    // CARGAR PEDIDOS
    // ==========================================

    cargarPedidos(): void {

        this.cargando = true;

        this.mensajeError = '';


        console.log(
            'Solicitando pedidos a la API...'
        );


        this.pedidoService
            .obtenerPedidos()
            .subscribe({

                next: (respuesta) => {

                    console.log(
                        'Pedidos recibidos:',
                        respuesta
                    );


                    this.pedidos =
                        Array.isArray(respuesta)
                            ? respuesta
                            : [];


                    console.log(
                        'PEDIDOS GUARDADOS:',
                        this.pedidos
                    );


                    this.aplicarFiltros();


                    console.log(
                        'PEDIDOS FILTRADOS:',
                        this.pedidosFiltrados
                    );


                    this.cargando = false;


                    this.cdr.detectChanges();


                    // ==================================
                    // CARGAR DETALLES
                    // ==================================

                    this.cargarDetallesPedido();

                },


                error: (error) => {

                    console.error(
                        'Error al obtener pedidos:',
                        error
                    );


                    this.pedidos = [];

                    this.pedidosFiltrados = [];

                    this.cargando = false;


                    this.mensajeError =
                        'No fue posible cargar los pedidos.';


                    this.cdr.detectChanges();

                }

            });

    }



    // ==========================================
    // CARGAR TODOS LOS DETALLES
    // ==========================================

    cargarDetallesPedido(): void {

        console.log(
            'Solicitando detalles de pedidos a la API...'
        );


        this.pedidoService
            .obtenerDetallesPedido()
            .subscribe({

                next: (respuesta) => {

                    console.log(
                        'Detalles de pedidos recibidos:',
                        respuesta
                    );


                    const detalles =
                        Array.isArray(respuesta)
                            ? respuesta
                            : [];


                    // ==================================
                    // NORMALIZAR DETALLES
                    // ==================================

                    this.detallesPedido =
                        detalles.map(
                            detalle =>
                                this.normalizarDetalle(
                                    detalle
                                )
                        );


                    console.log(
                        'DETALLES NORMALIZADOS:',
                        this.detallesPedido
                    );


                    this.cdr.detectChanges();

                },


                error: (error) => {

                    console.error(
                        'Error al obtener detalles:',
                        error
                    );


                    this.detallesPedido = [];


                    this.cdr.detectChanges();

                }

            });

    }



    // ==========================================
    // NORMALIZAR DETALLE
    // ==========================================

    private normalizarDetalle(
        detalle: any
    ): any {

        if (!detalle) {

            return {};

        }


        return {

            ...detalle,


            // ==================================
            // ID DEL PEDIDO
            // ==================================

            pedidoId:
                detalle.pedidoId ??
                detalle.PedidoId ??
                detalle.idPedido ??
                detalle.IdPedido ??
                detalle.pedido?.id ??
                detalle.Pedido?.id ??
                detalle.Pedido?.Id ??
                0,


            // ==================================
            // CANTIDAD
            // ==================================

            cantidad:
                Number(
                    detalle.cantidad ??
                    detalle.Cantidad ??
                    0
                ),


            // ==================================
            // PRECIO
            // ==================================

            precio:
                Number(
                    detalle.precio ??
                    detalle.Precio ??
                    detalle.precioUnitario ??
                    detalle.PrecioUnitario ??
                    0
                ),


            // ==================================
            // PERFUME
            // ==================================

            perfume:
                detalle.perfume ??
                detalle.Perfume ??
                detalle.nombrePerfume ??
                detalle.NombrePerfume ??
                detalle.perfumeNombre ??
                detalle.PerfumeNombre ??
                'Perfume'

        };

    }



    // ==========================================
    // OBTENER PRODUCTOS DE UN PEDIDO
    // ==========================================

    obtenerDetallesDelPedido(
        pedidoId: number
    ): any[] {

        return this.detallesPedido.filter(

            detalle => {

                return Number(
                    detalle.pedidoId
                ) === Number(
                    pedidoId
                );

            }

        );

    }



    // ==========================================
    // CONTAR PRODUCTOS DE UN PEDIDO
    // ==========================================

    contarProductos(
        pedidoId: number
    ): number {

        const detalles =
            this.obtenerDetallesDelPedido(
                pedidoId
            );


        return detalles.reduce(

            (
                total,
                detalle
            ) => {

                return total +
                    Number(
                        detalle.cantidad ?? 0
                    );

            },

            0

        );

    }



    // ==========================================
    // TEXTO DE PRODUCTOS
    // ==========================================

    textoProductos(
        pedidoId: number
    ): string {

        const cantidad =
            this.contarProductos(
                pedidoId
            );


        if (cantidad === 0) {

            return '—';

        }


        if (cantidad === 1) {

            return '1 producto';

        }


        return `${cantidad} productos`;

    }



    // ==========================================
    // FILTRAR PEDIDOS
    // ==========================================

    aplicarFiltros(): void {

        const texto =
            this.busqueda
                .trim()
                .toLowerCase();


        this.pedidosFiltrados =
            this.pedidos.filter(

                pedido => {

                    const nombreUsuario =
                        this.obtenerNombreUsuario(
                            pedido
                        );


                    const coincideBusqueda =

                        !texto ||

                        String(
                            pedido.id
                        )
                            .toLowerCase()
                            .includes(texto) ||

                        nombreUsuario
                            .toLowerCase()
                            .includes(texto);


                    const coincideEstado =

                        this.estadoSeleccionado ===
                            'Todos' ||

                        pedido.estado ===
                            this.estadoSeleccionado;


                    return (
                        coincideBusqueda &&
                        coincideEstado
                    );

                }

            );


        console.log(
            'Resultado de aplicarFiltros:',
            this.pedidosFiltrados
        );

    }



    // ==========================================
    // BUSCAR
    // ==========================================

    buscar(): void {

        this.aplicarFiltros();

    }



    // ==========================================
    // TOTAL DE PEDIDOS
    // ==========================================

    get totalPedidos(): number {

        return this.pedidos.length;

    }



    // ==========================================
    // PEDIDOS PENDIENTES
    // ==========================================

    get pedidosPendientes(): number {

        return this.pedidos.filter(

            pedido =>
                pedido.estado ===
                'Pendiente'

        ).length;

    }



    // ==========================================
    // PEDIDOS ENVIADOS
    // ==========================================

    get pedidosEnviados(): number {

        return this.pedidos.filter(

            pedido =>
                pedido.estado ===
                'Enviado'

        ).length;

    }



    // ==========================================
    // TOTAL DE VENTAS REAL
    // ==========================================

    get totalVentas(): number {

        return this.detallesPedido.reduce(

            (
                total,
                detalle
            ) => {

                return total +
                    this.calcularSubtotalDetalle(
                        detalle
                    );

            },

            0

        );

    }



    // ==========================================
    // LIMPIAR FILTROS
    // ==========================================

    limpiarFiltros(): void {

        this.busqueda = '';

        this.estadoSeleccionado = 'Todos';

        this.aplicarFiltros();

    }



    // ==========================================
    // OBTENER NOMBRE DEL USUARIO
    // ==========================================

    obtenerNombreUsuario(
        pedido: any
    ): string {

        if (!pedido) {

            return 'Cliente';

        }


        const usuario =
            pedido.usuario;


        // ==================================
        // SI VIENE COMO TEXTO
        // ==================================

        if (
            typeof usuario ===
            'string'
        ) {

            return usuario;

        }


        // ==================================
        // SI VIENE COMO OBJETO
        // ==================================

        if (
            usuario &&
            typeof usuario ===
            'object'
        ) {

            const nombre =
                usuario.nombre ??
                usuario.Nombre ??
                usuario.nombreCompleto ??
                usuario.NombreCompleto;


            if (nombre) {

                return String(nombre);

            }


            // ==================================
            // NOMBRE + APELLIDO
            // ==================================

            const nombreBase =
                usuario.nombre ??
                usuario.Nombre ??
                '';


            const apellido =
                usuario.apellido ??
                usuario.Apellido ??
                usuario.apellidos ??
                usuario.Apellidos ??
                '';


            const nombreCompleto =
                `${nombreBase} ${apellido}`.trim();


            if (nombreCompleto) {

                return nombreCompleto;

            }


            // ==================================
            // CORREO
            // ==================================

            const correo =
                usuario.correo ??
                usuario.Correo ??
                '';


            if (correo) {

                return String(correo);

            }

        }


        // ==================================
        // CAMPOS DIRECTOS DEL PEDIDO
        // ==================================

        if (pedido.usuarioNombre) {

            return String(
                pedido.usuarioNombre
            );

        }


        if (pedido.nombreUsuario) {

            return String(
                pedido.nombreUsuario
            );

        }


        if (pedido.nombre) {

            return String(
                pedido.nombre
            );

        }


        return 'Cliente';

    }



    // ==========================================
    // OBTENER NOMBRE DEL CLIENTE SELECCIONADO
    // ==========================================

    obtenerNombreCliente(): string {

        return this.obtenerNombreUsuario(
            this.pedidoSeleccionado
        );

    }



    // ==========================================
    // VER PEDIDO
    // ==========================================

    verPedido(
        id: number
    ): void {

        console.log(
            'Abriendo pedido:',
            id
        );


        const pedidoLocal =
            this.pedidos.find(

                pedido =>
                    Number(pedido.id) ===
                    Number(id)

            );


        this.detallesSeleccionados =
            this.obtenerDetallesDelPedido(
                id
            );


        console.log(
            'DETALLES DEL PEDIDO:',
            this.detallesSeleccionados
        );


        this.pedidoService
            .obtenerPedido(id)
            .subscribe({

                next: (pedido) => {

                    console.log(
                        'Pedido seleccionado:',
                        pedido
                    );


                    this.pedidoSeleccionado =
                        pedido ??
                        pedidoLocal;


                    if (
                        !this.pedidoSeleccionado
                    ) {

                        this.pedidoSeleccionado =
                            pedidoLocal;

                    }


                    // ==================================
                    // PREPARAR CAMBIO DE ESTADO
                    // ==================================

                    this.estadoEditando =
                        this.pedidoSeleccionado?.estado ??
                        'Pendiente';


                    this.mensajeEstado = '';

                    this.guardandoEstado = false;


                    // ==================================
                    // ABRIR MODAL
                    // ==================================

                    this.modalVisible = true;


                    this.cdr.detectChanges();

                },


                error: (error) => {

                    console.error(
                        'Error al consultar pedido:',
                        error
                    );


                    if (pedidoLocal) {

                        this.pedidoSeleccionado =
                            pedidoLocal;


                        this.detallesSeleccionados =
                            this.obtenerDetallesDelPedido(
                                id
                            );


                        this.estadoEditando =
                            this.pedidoSeleccionado?.estado ??
                            'Pendiente';


                        this.mensajeEstado = '';

                        this.guardandoEstado = false;


                        this.modalVisible = true;


                        this.cdr.detectChanges();

                    }

                    else {

                        alert(
                            'No fue posible consultar el pedido.'
                        );

                    }

                }

            });

    }



    // ==========================================
    // CAMBIAR ESTADO
    // ==========================================

    cambiarEstado(
        estado: string
    ): void {

        this.estadoEditando =
            estado;

        this.mensajeEstado = '';

    }



    // ==========================================
    // GUARDAR ESTADO DEL PEDIDO
    // ==========================================

    guardarEstado(): void {

        // ==========================================
        // VALIDAR PEDIDO
        // ==========================================

        if (
            !this.pedidoSeleccionado
        ) {

            return;

        }


        // ==========================================
        // VALIDAR ESTADO
        // ==========================================

        if (!this.estadoEditando) {

            this.mensajeEstado =
                'Selecciona un estado válido.';

            return;

        }


        // ==========================================
        // SI NO CAMBIÓ
        // ==========================================

        if (
            this.estadoEditando ===
            this.pedidoSeleccionado.estado
        ) {

            this.mensajeEstado =
                'El pedido ya tiene este estado.';

            return;

        }


        // ==========================================
        // ACTIVAR LOADING
        // ==========================================

        this.guardandoEstado = true;

        this.mensajeEstado = '';


        // ==========================================
        // CONSTRUIR DATOS
        // ==========================================

        const datosActualizacion = {

            id:
                Number(
                    this.pedidoSeleccionado.id
                ),

            usuarioId:
                Number(
                    this.pedidoSeleccionado.usuarioId
                ),

            fechaPedido:
                this.pedidoSeleccionado.fechaPedido,

            total:
                Number(
                    this.pedidoSeleccionado.total ?? 0
                ),

            estado:
                this.estadoEditando

        };


        console.log(
            'Actualizando pedido:',
            datosActualizacion
        );


        // ==========================================
        // ACTUALIZAR API
        // ==========================================

        this.pedidoService
            .actualizarPedido(

                Number(
                    this.pedidoSeleccionado.id
                ),

                datosActualizacion

            )
            .subscribe({

                next: (respuesta) => {

                    console.log(
                        'Pedido actualizado:',
                        respuesta
                    );


                    // ==================================
                    // ACTUALIZAR PEDIDO SELECCIONADO
                    // ==================================

                    this.pedidoSeleccionado =
                        respuesta ??
                        {
                            ...this.pedidoSeleccionado,
                            estado:
                                this.estadoEditando
                        };


                    // ==================================
                    // ACTUALIZAR ESTADO LOCAL
                    // ==================================

                    this.pedidoSeleccionado.estado =
                        this.estadoEditando;


                    // ==================================
                    // ACTUALIZAR LISTA LOCAL
                    // ==================================

                    const indice =
                        this.pedidos.findIndex(

                            pedido =>
                                Number(pedido.id) ===
                                Number(
                                    this.pedidoSeleccionado.id
                                )

                        );


                    if (
                        indice !== -1
                    ) {

                        this.pedidos[indice] = {

                            ...this.pedidos[indice],

                            estado:
                                this.estadoEditando

                        };

                    }


                    // ==================================
                    // APLICAR FILTROS
                    // ==================================

                    this.aplicarFiltros();


                    // ==================================
                    // MENSAJE
                    // ==================================

                    this.mensajeEstado =
                        'Estado actualizado correctamente.';


                    this.guardandoEstado =
                        false;


                    this.cdr.detectChanges();


                    // ==================================
                    // RECARGAR PEDIDOS
                    // ==================================

                    this.cargarPedidos();

                },


                error: (error) => {

                    console.error(
                        'Error al actualizar estado:',
                        error
                    );


                    this.guardandoEstado =
                        false;


                    this.mensajeEstado =
                        'No fue posible actualizar el estado del pedido.';


                    this.cdr.detectChanges();

                }

            });

    }



    // ==========================================
    // CERRAR MODAL
    // ==========================================

    cerrarModal(): void {

        this.modalVisible = false;

        this.pedidoSeleccionado = null;

        this.detallesSeleccionados = [];

        this.estadoEditando = '';

        this.mensajeEstado = '';

        this.guardandoEstado = false;

    }



    // ==========================================
    // CALCULAR SUBTOTAL DE UN DETALLE
    // ==========================================

    calcularSubtotalDetalle(
        detalle: any
    ): number {

        const precio =
            Number(
                detalle?.precio ??
                detalle?.Precio ??
                detalle?.precioUnitario ??
                detalle?.PrecioUnitario ??
                0
            );


        const cantidad =
            Number(
                detalle?.cantidad ??
                detalle?.Cantidad ??
                0
            );


        return precio * cantidad;

    }



    // ==========================================
    // CALCULAR TOTAL REAL DE UN PEDIDO
    // ==========================================

    calcularTotalPedido(
        pedidoId: number
    ): number {

        const detalles =
            this.obtenerDetallesDelPedido(
                pedidoId
            );


        return detalles.reduce(

            (
                total,
                detalle
            ) => {

                return total +
                    this.calcularSubtotalDetalle(
                        detalle
                    );

            },

            0

        );

    }



    // ==========================================
    // TOTAL REAL DEL DETALLE
    // ==========================================

    get totalDetalle(): number {

        if (
            !this.detallesSeleccionados ||
            this.detallesSeleccionados.length === 0
        ) {

            return 0;

        }


        return this.detallesSeleccionados.reduce(

            (
                total,
                detalle
            ) => {

                return total +
                    this.calcularSubtotalDetalle(
                        detalle
                    );

            },

            0

        );

    }



    // ==========================================
    // CANTIDAD TOTAL DE PRODUCTOS
    // ==========================================

    get cantidadTotalDetalle(): number {

        return this.detallesSeleccionados.reduce(

            (
                total,
                detalle
            ) => {

                return total +
                    Number(
                        detalle.cantidad ??
                        detalle.Cantidad ??
                        0
                    );

            },

            0

        );

    }

}