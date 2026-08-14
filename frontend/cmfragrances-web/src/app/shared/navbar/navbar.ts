import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import {
  Carrito as CarritoService
} from '../../core/services/carrito';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  // ==========================================
  // ROUTER
  // ==========================================

  private router = inject(Router);


  // ==========================================
  // CARRITO
  // ==========================================

  private carritoService = inject(CarritoService);


  // ==========================================
  // CANTIDAD DEL CARRITO
  // ==========================================

  get cantidadCarrito(): number {

    return this.carritoService.obtenerCantidad();

  }


  // ==========================================
  // IR AL CARRITO
  // ==========================================

  irAlCarrito(): void {

    this.router.navigate(['/carrito']);

  }

}