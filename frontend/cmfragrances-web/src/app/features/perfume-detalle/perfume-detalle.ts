import {
    Component,
    OnInit,
    ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { HttpClient } from '@angular/common/http';

import {
    ActivatedRoute,
    Router
} from '@angular/router';

import { environment } from '../../../environments/environment';

import {
    Carrito,
    ProductoCarrito
} from '../../core/services/carrito';


@Component({

    selector: 'app-perfume-detalle',

    standalone: true,

    imports: [
        CommonModule
    ],

    templateUrl: './perfume-detalle.html',

    styleUrl: './perfume-detalle.css'

})
export class PerfumeDetalle implements OnInit {


    // ==========================================
    // PERFUME
    // ==========================================

    perfume: any = null;


    // ==========================================
    // ESTADO
    // ==========================================

    cargando = true;

    mensajeError = '';


    // ==========================================
    // API
    // ==========================================

    private apiUrl =
        environment.apiUrl;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    constructor(

        private http: HttpClient,

        private route: ActivatedRoute,

        private router: Router,

        private carrito: Carrito,

        private cdr: ChangeDetectorRef

    ) {}


    // ==========================================
    // INICIALIZAR
    // ==========================================

    ngOnInit(): void {

        console.log(
            '================================'
        );

        console.log(
            'DETALLE DEL PERFUME INICIADO'
        );

        console.log(
            'API:',
            this.apiUrl
        );


        const id = Number(

            this.route
                .snapshot
                .paramMap
                .get('id')

        );


        console.log(
            'ID DEL PERFUME:',
            id
        );


        if (!id) {

            this.mensajeError =
                'No se encontró el ID del perfume.';

            this.cargando = false;

            this.cdr.detectChanges();

            return;

        }


        this.obtenerPerfume(id);

    }


    // ==========================================
    // OBTENER PERFUME
    // ==========================================

    obtenerPerfume(id: number): void {

        this.cargando = true;

        this.mensajeError = '';

        this.perfume = null;


        const url =
            `${this.apiUrl}/Perfumes/${id}`;


        console.log(
            'Consultando perfume:',
            url
        );


        this.http
            .get<any>(url)
            .subscribe({

                next: (respuesta) => {

                    console.log(
                        '================================'
                    );

                    console.log(
                        'PERFUME RECIBIDO:',
                        respuesta
                    );

                    console.log(
                        'NOMBRE:',
                        respuesta?.nombre
                    );

                    console.log(
                        'PRECIO:',
                        respuesta?.precio
                    );

                    console.log(
                        'IMAGEN:',
                        respuesta?.imagen
                    );


                    // ==================================
                    // GUARDAR PERFUME
                    // ==================================

                    this.perfume =
                        respuesta;


                    // ==================================
                    // TERMINAR CARGA
                    // ==================================

                    this.cargando =
                        false;


                    console.log(
                        'CARGANDO:',
                        this.cargando
                    );

                    console.log(
                        'PERFUME EN COMPONENTE:',
                        this.perfume
                    );


                    // ==================================
                    // ACTUALIZAR VISTA
                    // ==================================

                    this.cdr.detectChanges();

                },


                error: (error) => {

                    console.error(
                        '================================'
                    );

                    console.error(
                        'ERROR AL OBTENER PERFUME'
                    );

                    console.error(
                        error
                    );

                    console.error(
                        '================================'
                    );


                    this.perfume =
                        null;


                    this.mensajeError =
                        'No fue posible cargar el perfume.';


                    this.cargando =
                        false;


                    this.cdr.detectChanges();

                }

            });

    }


    // ==========================================
    // VOLVER AL CATÁLOGO
    // ==========================================

    volverCatalogo(): void {

        this.router.navigate([
            '/catalogo'
        ]);

    }


    // ==========================================
    // AGREGAR AL CARRITO
    // ==========================================

    agregarAlCarrito(): void {

        // ======================================
        // VERIFICAR QUE EXISTA EL PERFUME
        // ======================================

        if (!this.perfume) {

            return;

        }


        // ======================================
        // VERIFICAR STOCK
        // ======================================

        if (this.perfume.stock <= 0) {

            alert(
                'Este perfume está agotado.'
            );

            return;

        }


        // ======================================
        // CREAR PRODUCTO PARA EL CARRITO
        // ======================================

        const producto: ProductoCarrito = {

            id: this.perfume.id,

            nombre: this.perfume.nombre,

            precio: this.perfume.precio,

            imagen: this.perfume.imagen,

            cantidad: 1

        };


        console.log(
            'AGREGANDO AL CARRITO:',
            producto
        );


        // ======================================
        // AGREGAR AL SERVICIO
        // ======================================

        this.carrito.agregarProducto(
            producto
        );


        // ======================================
        // CONFIRMACIÓN
        // ======================================

        console.log(
            'CARRITO ACTUAL:',
            this.carrito.obtenerProductos()
        );


        console.log(
            'CANTIDAD TOTAL:',
            this.carrito.obtenerCantidad()
        );


        console.log(
            'SUBTOTAL:',
            this.carrito.obtenerSubtotal()
        );


        alert(
            `${this.perfume.nombre} se agregó al carrito.`
        );

    }

}