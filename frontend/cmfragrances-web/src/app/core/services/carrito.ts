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

  private productos: ProductoCarrito[] = [];


  // ==========================================
  // OBTENER PRODUCTOS
  // ==========================================

  obtenerProductos(): ProductoCarrito[] {

    return this.productos;

  }


  // ==========================================
  // AGREGAR PRODUCTO
  // ==========================================

  agregarProducto(producto: ProductoCarrito): void {

    const productoExistente =
      this.productos.find(p => p.id === producto.id);


    if (productoExistente) {

      productoExistente.cantidad++;

    } else {

      this.productos.push({
        ...producto,
        cantidad: producto.cantidad || 1
      });

    }

  }


  // ==========================================
  // AUMENTAR CANTIDAD
  // ==========================================

  aumentarCantidad(id: number): void {

    const producto =
      this.productos.find(p => p.id === id);


    if (producto) {

      producto.cantidad++;

    }

  }


  // ==========================================
  // DISMINUIR CANTIDAD
  // ==========================================

  disminuirCantidad(id: number): void {

    const producto =
      this.productos.find(p => p.id === id);


    if (!producto) {

      return;

    }


    if (producto.cantidad > 1) {

      producto.cantidad--;

    } else {

      this.eliminarProducto(id);

    }

  }


  // ==========================================
  // ELIMINAR PRODUCTO
  // ==========================================

  eliminarProducto(id: number): void {

    this.productos =
      this.productos.filter(p => p.id !== id);

  }


  // ==========================================
  // VACIAR CARRITO
  // ==========================================

  vaciarCarrito(): void {

    this.productos = [];

  }


  // ==========================================
  // CANTIDAD TOTAL
  // ==========================================

  obtenerCantidad(): number {

    return this.productos.reduce(
      (total, producto) =>
        total + producto.cantidad,
      0
    );

  }


  // ==========================================
  // SUBTOTAL
  // ==========================================

  obtenerSubtotal(): number {

    return this.productos.reduce(
      (total, producto) =>
        total + (producto.precio * producto.cantidad),
      0
    );

  }

}