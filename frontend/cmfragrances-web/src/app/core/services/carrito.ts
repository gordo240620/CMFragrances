import { Injectable } from '@angular/core';


export interface ProductoCarrito {

  id: number;

  nombre: string;

  precio: number;

  imagen: string;

  cantidad: number;

}


@Injectable({
  providedIn: 'root'
})
export class Carrito {


  // ==========================================
  // CLAVE BASE DEL LOCAL STORAGE
  // ==========================================

  private readonly STORAGE_KEY_BASE =
    'cmfragrances_carrito_usuario_';


  // ==========================================
  // CLAVE DEL CARRITO ANTIGUO
  // ==========================================
  // Esta era la clave que utilizaba el carrito
  // antes de separarlo por usuario.

  private readonly LEGACY_STORAGE_KEY =
    'cmfragrances_carrito';


  // ==========================================
  // PRODUCTOS
  // ==========================================

  private productos: ProductoCarrito[] = [];


  // ==========================================
  // USUARIO ACTUAL
  // ==========================================

  private usuarioActualId: number | null = null;


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor() {

    this.cargarCarrito();

  }


  // ==========================================
  // OBTENER ID DEL USUARIO ACTUAL
  // ==========================================

  private obtenerUsuarioId(): number | null {

    const token =
      localStorage.getItem('token');


    // ------------------------------------------
    // NO HAY SESIÓN
    // ------------------------------------------

    if (!token) {

      return null;

    }


    try {

      const partes =
        token.split('.');


      if (
        partes.length !== 3
      ) {

        return null;

      }


      let payload =
        partes[1];


      // ----------------------------------------
      // BASE64URL → BASE64
      // ----------------------------------------

      payload =
        payload
          .replace(/-/g, '+')
          .replace(/_/g, '/');


      // ----------------------------------------
      // PADDING
      // ----------------------------------------

      while (
        payload.length % 4 !== 0
      ) {

        payload += '=';

      }


      const datos =
        JSON.parse(
          atob(payload)
        );


      // ----------------------------------------
      // OBTENER ID
      // ----------------------------------------

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


      if (
        !usuarioId ||
        usuarioId <= 0 ||
        isNaN(usuarioId)
      ) {

        return null;

      }


      return usuarioId;

    }

    catch (error) {

      console.error(
        'Error obteniendo usuario del carrito:',
        error
      );

      return null;

    }

  }


  // ==========================================
  // OBTENER CLAVE DEL USUARIO
  // ==========================================

  private obtenerStorageKey(): string {

    const usuarioId =
      this.obtenerUsuarioId();


    if (
      usuarioId !== null
    ) {

      return `${this.STORAGE_KEY_BASE}${usuarioId}`;

    }


    // ------------------------------------------
    // CARRITO SIN SESIÓN
    // ------------------------------------------

    return `${this.STORAGE_KEY_BASE}invitado`;

  }


  // ==========================================
  // VERIFICAR SI CAMBIÓ EL USUARIO
  // ==========================================

  private verificarUsuario(): void {

    const usuarioId =
      this.obtenerUsuarioId();


    // ------------------------------------------
    // SI ES EL MISMO USUARIO
    // ------------------------------------------

    if (
      usuarioId === this.usuarioActualId
    ) {

      return;

    }


    // ------------------------------------------
    // CAMBIÓ DE USUARIO
    // ------------------------------------------

    this.usuarioActualId =
      usuarioId;


    this.cargarCarrito();

  }


  // ==========================================
  // CARGAR CARRITO
  // ==========================================

  private cargarCarrito(): void {

    try {

      const storageKey =
        this.obtenerStorageKey();


      const carritoGuardado =
        localStorage.getItem(
          storageKey
        );


      // ======================================
      // SI EXISTE CARRITO DEL USUARIO
      // ======================================

      if (carritoGuardado) {

        const productos =
          JSON.parse(
            carritoGuardado
          );


        if (
          Array.isArray(productos)
        ) {

          this.productos =
            productos;

        }

        else {

          this.productos = [];

        }


        return;

      }


      // ======================================
      // MIGRAR CARRITO ANTIGUO
      // ======================================
      // Si todavía existe el carrito antiguo
      // y estamos entrando con un usuario,
      // lo asignamos a ese usuario una sola vez.

      const usuarioId =
        this.obtenerUsuarioId();


      if (
        usuarioId !== null
      ) {

        const carritoAntiguo =
          localStorage.getItem(
            this.LEGACY_STORAGE_KEY
          );


        if (
          carritoAntiguo
        ) {

          const productosAntiguos =
            JSON.parse(
              carritoAntiguo
            );


          if (
            Array.isArray(
              productosAntiguos
            )
          ) {

            this.productos =
              productosAntiguos;


            localStorage.setItem(

              storageKey,

              JSON.stringify(
                this.productos
              )

            );


            // --------------------------------
            // ELIMINAR CARRITO COMPARTIDO
            // --------------------------------

            localStorage.removeItem(
              this.LEGACY_STORAGE_KEY
            );


            console.log(
              'Carrito anterior asignado al usuario:',
              usuarioId
            );


            return;

          }

        }

      }


      // ======================================
      // NO EXISTE CARRITO
      // ======================================

      this.productos = [];

    }

    catch (error) {

      console.error(
        'Error al cargar el carrito:',
        error
      );

      this.productos = [];

    }

  }


  // ==========================================
  // GUARDAR CARRITO
  // ==========================================

  private guardarCarrito(): void {

    try {

      this.verificarUsuario();


      const storageKey =
        this.obtenerStorageKey();


      localStorage.setItem(

        storageKey,

        JSON.stringify(
          this.productos
        )

      );

    }

    catch (error) {

      console.error(
        'Error al guardar el carrito:',
        error
      );

    }

  }


  // ==========================================
  // OBTENER PRODUCTOS
  // ==========================================

  obtenerProductos(): ProductoCarrito[] {

    this.verificarUsuario();


    return this.productos;

  }


  // ==========================================
  // AGREGAR PRODUCTO
  // ==========================================

  agregarProducto(
    producto: ProductoCarrito
  ): void {

    this.verificarUsuario();


    const productoExistente =
      this.productos.find(
        p => p.id === producto.id
      );


    if (productoExistente) {

      productoExistente.cantidad++;

    }

    else {

      this.productos.push({

        ...producto,

        cantidad:
          producto.cantidad || 1

      });

    }


    // ======================================
    // GUARDAR CAMBIOS
    // ======================================

    this.guardarCarrito();

  }


  // ==========================================
  // AUMENTAR CANTIDAD
  // ==========================================

  aumentarCantidad(
    id: number
  ): void {

    this.verificarUsuario();


    const producto =
      this.productos.find(
        p => p.id === id
      );


    if (producto) {

      producto.cantidad++;

      this.guardarCarrito();

    }

  }


  // ==========================================
  // DISMINUIR CANTIDAD
  // ==========================================

  disminuirCantidad(
    id: number
  ): void {

    this.verificarUsuario();


    const producto =
      this.productos.find(
        p => p.id === id
      );


    if (!producto) {

      return;

    }


    if (
      producto.cantidad > 1
    ) {

      producto.cantidad--;

      this.guardarCarrito();

    }

    else {

      this.eliminarProducto(id);

    }

  }


  // ==========================================
  // ELIMINAR PRODUCTO
  // ==========================================

  eliminarProducto(
    id: number
  ): void {

    this.verificarUsuario();


    this.productos =
      this.productos.filter(
        p => p.id !== id
      );


    this.guardarCarrito();

  }


  // ==========================================
  // VACIAR CARRITO
  // ==========================================
  // ESTA FUNCIÓN SÍ SE CONSERVA.
  // Se utiliza cuando realmente queremos
  // vaciar el carrito, por ejemplo después
  // de crear un pedido.

  vaciarCarrito(): void {

    this.verificarUsuario();


    this.productos = [];


    const storageKey =
      this.obtenerStorageKey();


    localStorage.removeItem(
      storageKey
    );

  }


  // ==========================================
  // CANTIDAD TOTAL
  // ==========================================

  obtenerCantidad(): number {

    this.verificarUsuario();


    return this.productos.reduce(

      (
        total,
        producto
      ) =>

        total +
        producto.cantidad,

      0

    );

  }


  // ==========================================
  // SUBTOTAL
  // ==========================================

  obtenerSubtotal(): number {

    this.verificarUsuario();


    return this.productos.reduce(

      (
        total,
        producto
      ) =>

        total +
        (
          producto.precio *
          producto.cantidad
        ),

      0

    );

  }

}