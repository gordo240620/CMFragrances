import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';

import { forkJoin } from 'rxjs';

import { PedidoService } from '../../core/services/pedido';


@Component({
  selector: 'app-mis-compras',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './mis-compras.html',

  styleUrl: './mis-compras.css'
})
export class MisCompras implements OnInit {


  // ==========================================
  // SERVICIOS
  // ==========================================

  private pedidoService =
    inject(PedidoService);

  private router =
    inject(Router);

  private cdr =
    inject(ChangeDetectorRef);


  // ==========================================
  // DATOS
  // ==========================================

  pedidos: any[] = [];

  detallesPedidos: any[] = [];


  // ==========================================
  // ESTADO
  // ==========================================

  cargando = true;

  mensajeError = '';


  // ==========================================
  // INICIAR
  // ==========================================

  ngOnInit(): void {

    console.log(
      '======================================'
    );

    console.log(
      'MIS COMPRAS'
    );

    console.log(
      '======================================'
    );


    this.cargarPedidos();

  }


  // ==========================================
  // OBTENER USUARIO DEL JWT ACTUAL
  // ==========================================

  private obtenerUsuarioIdActual(): number | null {

    const token =
      localStorage.getItem('token');


    console.log(
      'TOKEN ACTUAL:',
      token
        ? 'EXISTE'
        : 'NO EXISTE'
    );


    if (!token) {

      console.error(
        'No existe token de sesión.'
      );

      return null;

    }


    try {

      const partes =
        token.split('.');


      if (
        partes.length !== 3
      ) {

        console.error(
          'El token no tiene formato JWT válido.'
        );

        return null;

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


      console.log(
        'JWT ACTUAL:',
        datos
      );


      const id =

        datos[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ]

        ??

        datos[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/nameidentifier'
        ]

        ??

        datos['usuarioId']

        ??

        datos['userId']

        ??

        datos['id']

        ??

        datos['sub']

        ??

        null;


      const usuarioId =
        Number(id);


      console.log(
        '======================================'
      );

      console.log(
        'USUARIO ID ACTUAL:',
        usuarioId
      );

      console.log(
        '======================================'
      );


      if (
        !usuarioId ||
        usuarioId <= 0 ||
        isNaN(usuarioId)
      ) {

        console.error(
          'No se pudo obtener un usuarioId válido.'
        );

        return null;

      }


      return usuarioId;

    }

    catch (error) {

      console.error(
        'Error leyendo el JWT:',
        error
      );

      return null;

    }

  }


  // ==========================================
  // CARGAR PEDIDOS
  // ==========================================

  cargarPedidos(): void {

    this.cargando = true;

    this.mensajeError = '';


    const usuarioId =
      this.obtenerUsuarioIdActual();


    // ==========================================
    // SEGURIDAD
    // ==========================================

    if (
      usuarioId === null
    ) {

      this.pedidos = [];

      this.detallesPedidos = [];

      this.cargando = false;

      this.mensajeError =
        'No se pudo identificar al usuario.';

      this.cdr.detectChanges();

      return;

    }


    console.log(
      'Cargando compras del usuario:',
      usuarioId
    );


    // ==========================================
    // PEDIDOS + DETALLES
    // ==========================================

    forkJoin({

      pedidos:
        this.pedidoService
          .obtenerPedidos(),

      detalles:
        this.pedidoService
          .obtenerDetallesPedido()

    })
    .subscribe({

      next: (respuesta) => {

        const todosLosPedidos =
          Array.isArray(
            respuesta.pedidos
          )
            ? respuesta.pedidos
            : [];


        const todosLosDetalles =
          Array.isArray(
            respuesta.detalles
          )
            ? respuesta.detalles
            : [];


        console.log(
          'TODOS LOS PEDIDOS:',
          todosLosPedidos
        );


        // ======================================
        // FILTRAR SOLO USUARIO ACTUAL
        // ======================================

        this.pedidos =
          todosLosPedidos.filter(
            (pedido: any) => {

              const pedidoUsuarioId =
                Number(
                  pedido?.usuarioId ??
                  pedido?.UsuarioId ??
                  0
                );


              console.log(
                `Pedido #${pedido?.id} → usuarioId ${pedidoUsuarioId}`
              );


              return (
                pedidoUsuarioId ===
                usuarioId
              );

            }
          );


        // ======================================
        // ORDENAR
        // ======================================

        this.pedidos.sort(
          (a, b) => {

            return Number(
              b?.id ??
              b?.Id ??
              0
            )
            -
            Number(
              a?.id ??
              a?.Id ??
              0
            );

          }
        );


        // ======================================
        // DETALLES
        // ======================================

        const idsPedidosUsuario =
          this.pedidos.map(
            (pedido: any) =>
              Number(
                pedido?.id ??
                pedido?.Id ??
                0
              )
          );


        this.detallesPedidos =
          todosLosDetalles.filter(
            (detalle: any) => {

              const pedidoId =
                Number(
                  detalle?.pedidoId ??
                  detalle?.PedidoId ??
                  0
                );


              return idsPedidosUsuario
                .includes(pedidoId);

            }
          );


        console.log(
          '======================================'
        );

        console.log(
          'USUARIO ACTUAL:',
          usuarioId
        );

        console.log(
          'PEDIDOS DEL USUARIO:',
          this.pedidos
        );

        console.log(
          'DETALLES DEL USUARIO:',
          this.detallesPedidos
        );

        console.log(
          '======================================'
        );


        this.cargando = false;

        this.cdr.detectChanges();

      },


      error: (error) => {

        console.error(
          'Error cargando compras:',
          error
        );


        this.pedidos = [];

        this.detallesPedidos = [];

        this.cargando = false;

        this.mensajeError =
          'No fue posible cargar tus compras.';

        this.cdr.detectChanges();

      }

    });

  }


  // ==========================================
  // ID PEDIDO
  // ==========================================

  obtenerIdPedido(
    pedido: any
  ): number {

    return Number(
      pedido?.id ??
      pedido?.Id ??
      pedido?.pedidoId ??
      pedido?.PedidoId ??
      0
    );

  }


  // ==========================================
  // DETALLES DE PEDIDO
  // ==========================================

  obtenerDetallesPedido(
    pedido: any
  ): any[] {

    const pedidoId =
      this.obtenerIdPedido(
        pedido
      );


    return this.detallesPedidos.filter(
      (detalle: any) => {

        return Number(
          detalle?.pedidoId ??
          detalle?.PedidoId ??
          0
        ) === pedidoId;

      }
    );

  }


  // ==========================================
  // CANTIDAD DE PRODUCTOS
  // ==========================================

  obtenerCantidadProductos(
    pedido: any
  ): number {

    return this
      .obtenerDetallesPedido(pedido)
      .reduce(
        (
          total: number,
          detalle: any
        ) => {

          return total +
            Number(
              detalle?.cantidad ??
              detalle?.Cantidad ??
              0
            );

        },
        0
      );

  }


  // ==========================================
  // NÚMERO DE ARTÍCULOS
  // ==========================================

  obtenerNumeroArticulos(
    pedido: any
  ): number {

    return this
      .obtenerDetallesPedido(pedido)
      .length;

  }


  // ==========================================
  // ESTADO
  // ==========================================

  obtenerEstado(
    pedido: any
  ): string {

    return (
      pedido?.estado ??
      pedido?.Estado ??
      'Pendiente'
    );

  }


  // ==========================================
  // CLASE ESTADO
  // ==========================================

  claseEstado(
    pedido: any
  ): string {

    const estado =
      this
        .obtenerEstado(pedido)
        .toLowerCase()
        .trim();


    switch (estado) {

      case 'pagado':
        return 'estado-pagado';

      case 'preparando':
        return 'estado-preparando';

      case 'enviado':
        return 'estado-enviado';

      case 'entregado':
        return 'estado-entregado';

      case 'cancelado':
        return 'estado-cancelado';

      case 'pendiente':
        return 'estado-pendiente';

      default:
        return 'estado-pendiente';

    }

  }


  // ==========================================
  // FECHA
  // ==========================================

  formatearFecha(
    pedido: any
  ): string {

    const fecha =
      pedido?.fechaPedido ??
      pedido?.FechaPedido ??
      pedido?.fecha ??
      pedido?.Fecha;


    if (!fecha) {

      return 'Fecha no disponible';

    }


    const fechaObj =
      new Date(fecha);


    if (
      isNaN(
        fechaObj.getTime()
      )
    ) {

      return 'Fecha no disponible';

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
  // TOTAL
  // ==========================================

  obtenerTotal(
    pedido: any
  ): number {

    return Number(
      pedido?.total ??
      pedido?.Total ??
      0
    );

  }


  // ==========================================
  // VER PEDIDO
  // ==========================================

  verPedido(
    pedido: any
  ): void {

    const id =
      this.obtenerIdPedido(
        pedido
      );


    if (
      !id ||
      id <= 0
    ) {

      return;

    }


    this.router.navigate([
      '/confirmacion',
      id
    ]);

  }


  // ==========================================
  // SEGUIR COMPRANDO
  // ==========================================

  seguirComprando(): void {

    this.router.navigate([
      '/catalogo'
    ]);

  }


  // ==========================================
  // VOLVER AL INICIO
  // ==========================================

  volverInicio(): void {

    this.router.navigate([
      '/home'
    ]);

  }

}