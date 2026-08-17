import {
    Component,
    OnInit,
    OnDestroy,
    ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';


@Component({
    selector: 'app-catalogo',
    standalone: true,

    imports: [
        CommonModule,
        FormsModule
    ],

    templateUrl: './catalogo.html',
    styleUrl: './catalogo.css'
})
export class Catalogo implements OnInit, OnDestroy {


    // ==========================================
    // PERFUMES
    // ==========================================

    perfumes: any[] = [];

    perfumesFiltrados: any[] = [];


    // ==========================================
    // CATEGORÍAS
    // ==========================================

    categorias: any[] = [];


    // ==========================================
    // FILTROS
    // ==========================================

    textoBusqueda = '';

    categoriaSeleccionada = 0;


    // ==========================================
    // ESTADO
    // ==========================================

    cargando = true;


    // ==========================================
    // API
    // ==========================================

    private apiUrl =
        environment.apiUrl;


    // ==========================================
    // ACTUALIZACIÓN AUTOMÁTICA
    // ==========================================

    private intervaloActualizacion:
        ReturnType<typeof setInterval> | null = null;


    private readonly TIEMPO_ACTUALIZACION =
        10000;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    constructor(
        private http: HttpClient,
        private router: Router,
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
            'CATÁLOGO INICIADO'
        );

        console.log(
            'API:',
            this.apiUrl
        );

        console.log(
            '================================'
        );


        // ======================================
        // CARGA INICIAL
        // ======================================

        this.obtenerPerfumes(true);

        this.obtenerCategorias();


        // ======================================
        // ACTUALIZACIÓN AUTOMÁTICA
        // ======================================

        this.iniciarActualizacionAutomatica();

    }


    // ==========================================
    // INICIAR ACTUALIZACIÓN AUTOMÁTICA
    // ==========================================

    private iniciarActualizacionAutomatica(): void {

        console.log(
            'Actualización automática activada cada 10 segundos.'
        );


        this.intervaloActualizacion =
            setInterval(() => {

                console.log(
                    'Actualizando catálogo automáticamente...'
                );


                this.obtenerPerfumes(false);

            }, this.TIEMPO_ACTUALIZACION);

    }


    // ==========================================
    // DETENER ACTUALIZACIÓN
    // ==========================================

    ngOnDestroy(): void {

        console.log(
            'Destruyendo catálogo...'
        );


        if (
            this.intervaloActualizacion !== null
        ) {

            clearInterval(
                this.intervaloActualizacion
            );

            this.intervaloActualizacion = null;

        }

    }


    // ==========================================
    // OBTENER PERFUMES
    // ==========================================

    obtenerPerfumes(
        mostrarLoading: boolean = false
    ): void {


        // ======================================
        // SOLO MOSTRAR SPINNER EN CARGA INICIAL
        // ======================================

        if (mostrarLoading) {

            this.cargando = true;

        }


        const url =
            `${this.apiUrl}/Perfumes`;


        console.log(
            'Consultando perfumes:',
            url
        );


        this.http
            .get<any[]>(url)

            .subscribe({

                // ==================================
                // RESPUESTA
                // ==================================

                next: (respuesta) => {

                    console.log(
                        'RESPUESTA PERFUMES:',
                        respuesta
                    );


                    // ==================================
                    // GUARDAR TODOS
                    // ==================================

                    this.perfumes =
                        Array.isArray(respuesta)
                            ? [...respuesta]
                            : [];


                    // ==================================
                    // SOLO ACTIVOS
                    // ==================================

                    this.perfumes =
                        this.perfumes.filter(
                            perfume =>
                                perfume.activo === true
                        );


                    console.log(
                        'PERFUMES ACTIVOS:',
                        this.perfumes
                    );


                    // ==================================
                    // APLICAR FILTROS ACTUALES
                    // ==================================

                    this.filtrarPerfumes();


                    // ==================================
                    // TERMINAR CARGA
                    // ==================================

                    this.cargando = false;


                    // ==================================
                    // ACTUALIZAR VISTA
                    // ==================================

                    this.cdr.detectChanges();

                },


                // ==================================
                // ERROR
                // ==================================

                error: (error) => {

                    console.error(
                        '================================'
                    );

                    console.error(
                        'ERROR AL OBTENER PERFUMES'
                    );

                    console.error(
                        error
                    );

                    console.error(
                        '================================'
                    );


                    // ==================================
                    // SOLO MOSTRAR SIN RESULTADOS
                    // SI FUE LA CARGA INICIAL
                    // ==================================

                    if (mostrarLoading) {

                        this.perfumes = [];

                        this.perfumesFiltrados = [];

                        this.cargando = false;

                    }


                    this.cdr.detectChanges();

                }

            });

    }


    // ==========================================
    // OBTENER CATEGORÍAS
    // ==========================================

    obtenerCategorias(): void {

        const url =
            `${this.apiUrl}/Categorias`;


        console.log(
            'Consultando categorías:',
            url
        );


        this.http
            .get<any[]>(url)

            .subscribe({

                next: (respuesta) => {

                    console.log(
                        'CATEGORÍAS RECIBIDAS:',
                        respuesta
                    );


                    this.categorias =
                        Array.isArray(respuesta)
                            ? respuesta
                            : [];


                    this.cdr.detectChanges();

                },


                error: (error) => {

                    console.error(
                        'Error al obtener categorías:',
                        error
                    );


                    this.categorias = [];

                    this.cdr.detectChanges();

                }

            });

    }


    // ==========================================
    // FILTRAR PERFUMES
    // ==========================================

    filtrarPerfumes(): void {

        const texto =
            this.textoBusqueda
                .trim()
                .toLowerCase();


        this.perfumesFiltrados =
            this.perfumes.filter(

                perfume => {


                    // ==================================
                    // NOMBRE
                    // ==================================

                    const nombre =
                        String(
                            perfume.nombre ?? ''
                        )
                            .toLowerCase();


                    const marca =
                        String(
                            perfume.marca ?? ''
                        )
                            .toLowerCase();


                    const coincideTexto =

                        nombre.includes(texto) ||

                        marca.includes(texto);


                    // ==================================
                    // CATEGORÍA
                    // ==================================

                    const coincideCategoria =

                        this.categoriaSeleccionada === 0 ||

                        Number(
                            perfume.categoriaId
                        ) ===
                        Number(
                            this.categoriaSeleccionada
                        );


                    return (

                        coincideTexto &&

                        coincideCategoria

                    );

                }

            );


        this.cdr.detectChanges();

    }


    // ==========================================
    // LIMPIAR FILTROS
    // ==========================================

    limpiarFiltros(): void {

        this.textoBusqueda = '';

        this.categoriaSeleccionada = 0;


        this.perfumesFiltrados =
            [...this.perfumes];


        this.cdr.detectChanges();

    }


    // ==========================================
    // VER DETALLE
    // ==========================================

    verDetalle(id: number): void {

        this.router.navigate([
            '/perfume',
            id
        ]);

    }

}