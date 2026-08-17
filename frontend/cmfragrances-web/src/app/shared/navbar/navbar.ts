import { Component, inject } from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

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

  private carritoService =
    inject(CarritoService);


  // ==========================================
  // MENÚ DE USUARIO
  // ==========================================

  userMenuOpen = false;


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

    this.userMenuOpen = false;

    this.router.navigate([
      '/carrito'
    ]);

  }


  // ==========================================
  // ABRIR / CERRAR MENÚ USUARIO
  // ==========================================

  toggleUserMenu(): void {

    this.userMenuOpen =
      !this.userMenuOpen;

  }


  // ==========================================
  // MIS COMPRAS
  // ==========================================

  irAMisCompras(): void {

    this.userMenuOpen = false;

    this.router.navigate([
      '/mis-compras'
    ]);

  }


  // ==========================================
  // CERRAR SESIÓN
  // ==========================================

  cerrarSesion(): void {

    this.userMenuOpen = false;


    // ------------------------------------------
    // ELIMINAR DATOS DE SESIÓN
    // ------------------------------------------

    localStorage.removeItem('token');

    localStorage.removeItem('authToken');

    localStorage.removeItem('usuario');

    localStorage.removeItem('user');


    sessionStorage.removeItem('token');

    sessionStorage.removeItem('authToken');

    sessionStorage.removeItem('usuario');

    sessionStorage.removeItem('user');


    // ------------------------------------------
    // IMPORTANTE
    // ------------------------------------------
    // NO VACIAMOS EL CARRITO.
    //
    // El carrito permanece intacto.
    //
    // NO colocar:
    //
    // this.carritoService.vaciarCarrito();
    //
    // ------------------------------------------


    // ------------------------------------------
    // REGRESAR AL LOGIN
    // ------------------------------------------

    this.router.navigate([
      '/login'
    ]);

  }

}