import {
    Component,
    OnInit,
    ChangeDetectorRef
} from '@angular/core';

import {
    CommonModule
} from '@angular/common';

import {
    HttpClient
} from '@angular/common/http';

import {
    PerfumeCard
} from '../../shared/components/perfume-card/perfume-card';

import {
    BrandCard
} from '../../shared/components/brand-card/brand-card';

import {
    HeroSlider
} from '../../shared/components/hero-slider/hero-slider';

import {
    environment
} from '../../../environments/environment';


@Component({

    selector: 'app-home',

    standalone: true,

    imports: [
        CommonModule,
        PerfumeCard,
        BrandCard,
        HeroSlider
    ],

    templateUrl: './home.html',

    styleUrl: './home.css'

})
export class Home implements OnInit {


    // ==========================================
    // PERFUMES
    // ==========================================

    perfumesArabes: any[] = [];


    // ==========================================
    // ESTADO
    // ==========================================

    cargandoPerfumes = true;

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

        private cdr: ChangeDetectorRef

    ) {}


    // ==========================================
    // INICIO
    // ==========================================

    ngOnInit(): void {

        console.log(
            '================================'
        );

        console.log(
            '🏠 INICIANDO HOME'
        );

        console.log(
            '================================'
        );


        this.cargarPerfumesArabes();

    }


    // ==========================================
    // CARGAR PERFUMES ÁRABES
    // ==========================================

    cargarPerfumesArabes(): void {

        this.cargandoPerfumes = true;

        this.mensajeError = '';


        const url =
            `${this.apiUrl}/Perfumes`;


        console.log(
            '🏠 CARGANDO PERFUMES DEL HOME...'
        );

        console.log(
            'URL:',
            url
        );


        this.http
            .get<any[]>(url)

            .subscribe({

                next: (respuesta) => {

                    console.log(
                        '🏠 PERFUMES RECIBIDOS:',
                        respuesta
                    );


                    const lista =
                        Array.isArray(respuesta)
                            ? respuesta
                            : [];


                    // ==================================
                    // SOLO ACTIVOS
                    // ==================================

                    const activos =
                        lista.filter(
                            perfume =>
                                perfume.activo !== false
                        );


                    console.log(
                        '🏠 PERFUMES ACTIVOS:',
                        activos
                    );


                    // ==================================
                    // FILTRAR CATEGORÍA ÁRABE
                    // ==================================

                    const arabes =
                        activos.filter(
                            perfume => {

                                const categoria =
                                    perfume.categoria?.nombre
                                    ??
                                    perfume.categoriaNombre
                                    ??
                                    perfume.categoria;

                                return String(
                                    categoria ?? ''
                                )
                                .trim()
                                .toLowerCase()
                                === 'árabe';

                            }
                        );


                    console.log(
                        '🏠 PERFUMES ÁRABES:',
                        arabes
                    );


                    // ==================================
                    // GUARDAR MÁXIMO 4
                    // ==================================

                    this.perfumesArabes =
                        arabes.slice(
                            0,
                            4
                        );


                    // ==================================
                    // SI NO ENCONTRÓ ÁRABES
                    // ==================================

                    if (
                        this.perfumesArabes.length === 0
                    ) {

                        console.warn(
                            '⚠️ No se encontraron perfumes de categoría Árabe.'
                        );


                        // Mientras verificamos la estructura
                        // de la categoría, mostramos los
                        // primeros 4 activos.

                        this.perfumesArabes =
                            activos.slice(
                                0,
                                4
                            );

                    }


                    this.cargandoPerfumes =
                        false;


                    console.log(
                        '🏠 PERFUMES FINALES DEL HOME:',
                        this.perfumesArabes
                    );


                    // ==================================
                    // FORZAR ACTUALIZACIÓN
                    // ==================================

                    this.cdr.detectChanges();

                },


                error: (error) => {

                    console.error(
                        '================================'
                    );

                    console.error(
                        '❌ ERROR AL CARGAR PERFUMES DEL HOME'
                    );

                    console.error(
                        error
                    );

                    console.error(
                        '================================'
                    );


                    this.perfumesArabes = [];


                    this.mensajeError =
                        'No fue posible cargar los perfumes.';


                    this.cargandoPerfumes =
                        false;


                    this.cdr.detectChanges();

                }

            });

    }


    // ==========================================
    // RECARGAR
    // ==========================================

    recargarPerfumes(): void {

        this.cargarPerfumesArabes();

    }

}