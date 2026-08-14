import {
    Component,
    OnInit,
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
export class Catalogo implements OnInit {


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

    private apiUrl = environment.apiUrl;


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


        this.obtenerPerfumes();

        this.obtenerCategorias();

    }


    // ==========================================
    // OBTENER PERFUMES
    // ==========================================

    obtenerPerfumes(): void {

        this.cargando = true;


        const url =
            `${this.apiUrl}/Perfumes`;


        console.log(
            'Consultando perfumes:',
            url
        );


        this.http
            .get<any[]>(url)
            .subscribe({

                next: (respuesta) => {

                    console.log(
                        'RESPUESTA PERFUMES:',
                        respuesta
                    );


                    console.log(
                        '¿ES ARRAY?:',
                        Array.isArray(respuesta)
                    );


                    console.log(
                        'CANTIDAD RECIBIDA:',
                        respuesta?.length
                    );


                    // ==================================
                    // GUARDAR TODOS LOS PERFUMES
                    // ==================================

                    this.perfumes =
                        Array.isArray(respuesta)
                            ? respuesta
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


                    console.log(
                        'CANTIDAD ACTIVOS:',
                        this.perfumes.length
                    );


                    // ==================================
                    // MOSTRAR TODOS
                    // ==================================

                    this.perfumesFiltrados =
                        [...this.perfumes];


                    // ==================================
                    // TERMINÓ CARGA
                    // ==================================

                    this.cargando = false;


                    // ==================================
                    // FORZAR ACTUALIZACIÓN DE LA VISTA
                    // ==================================

                    this.cdr.detectChanges();


                    console.log(
                        'PERFUMES FILTRADOS:',
                        this.perfumesFiltrados
                    );

                },


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


                    this.perfumes = [];

                    this.perfumesFiltrados = [];

                    this.cargando = false;


                    // ==================================
                    // ACTUALIZAR VISTA EN CASO DE ERROR
                    // ==================================

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


                    // ==================================
                    // ACTUALIZAR VISTA
                    // ==================================

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


                    const nombre =
                        String(
                            perfume.nombre ?? ''
                        )
                            .toLowerCase();


                    const coincideNombre =
                        nombre.includes(texto);


                    const coincideCategoria =
                        this.categoriaSeleccionada === 0 ||

                        Number(
                            perfume.categoriaId
                        ) ===
                        Number(
                            this.categoriaSeleccionada
                        );


                    return (
                        coincideNombre &&
                        coincideCategoria
                    );

                }

            );


        // ==================================
        // ACTUALIZAR VISTA
        // ==================================

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