import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import {
  Carrito as CarritoService,
  ProductoCarrito
} from '../../core/services/carrito';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class Carrito {

  private carritoService = inject(CarritoService);

  get productos(): ProductoCarrito[] {
    return this.carritoService.obtenerProductos();
  }

  get cantidadTotal(): number {
    return this.carritoService.obtenerCantidad();
  }

  get subtotal(): number {
    return this.carritoService.obtenerSubtotal();
  }

  aumentarCantidad(id: number): void {
    this.carritoService.aumentarCantidad(id);
  }

  disminuirCantidad(id: number): void {
    this.carritoService.disminuirCantidad(id);
  }

  eliminarProducto(id: number): void {
    this.carritoService.eliminarProducto(id);
  }

  vaciarCarrito(): void {
    this.carritoService.vaciarCarrito();
  }
}