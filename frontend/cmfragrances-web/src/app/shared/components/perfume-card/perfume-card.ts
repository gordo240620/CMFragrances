import {
    Component,
    Input
} from '@angular/core';

import { Router } from '@angular/router';

import {
    Carrito,
    ProductoCarrito
} from '../../../core/services/carrito';


@Component({

    selector: 'app-perfume-card',

    standalone: true,

    imports: [],

    templateUrl: './perfume-card.html',

    styleUrl: './perfume-card.css'

})
export class PerfumeCard {


    // ==========================================
    // DATOS DEL PERFUME
    // ==========================================

    @Input() id: number = 0;

    @Input() marca: string = '';

    @Input() nombre: string = '';

    @Input() precio: number = 0;

    @Input() imagen: string = '';

    @Input() calificacion: number = 0;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    constructor(

        private router: Router,

        private carrito: Carrito

    ) {}


    // ==========================================
    // VER DETALLE
    // ==========================================

    verDetalle(): void {

        if (!this.id) {

            console.warn(
                'El perfume no tiene un ID válido.'
            );

            return;

        }


        this.router.navigate([
            '/perfume',
            this.id
        ]);

    }


    // ==========================================
    // AGREGAR AL CARRITO
    // ==========================================

    agregarAlCarrito(): void {

        if (!this.id) {

            console.warn(
                'No se puede agregar el perfume porque no tiene ID.'
            );

            return;

        }


        const producto: ProductoCarrito = {

            id: this.id,

            nombre: this.nombre,

            precio: this.precio,

            imagen: this.imagen,

            cantidad: 1

        };


        console.log(
            'AGREGANDO PERFUME DESDE HOME:',
            producto
        );


        this.carrito.agregarProducto(
            producto
        );


        console.log(
            'CARRITO ACTUAL:',
            this.carrito.obtenerProductos()
        );

    }

}