import {
    Component,
    OnDestroy,
    OnInit,
    ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';

import { environment } from '../../../../environments/environment';


@Component({

    selector: 'app-hero-slider',

    standalone: true,

    imports: [
        CommonModule
    ],

    templateUrl: './hero-slider.html',

    styleUrl: './hero-slider.css'

})
export class HeroSlider implements OnInit, OnDestroy {


    // ==========================================
    // LISTA DE PERFUMES
    // ==========================================

    perfumes: any[] = [];


    // ==========================================
    // SLIDE ACTUAL
    // ==========================================

    currentSlide = 0;


    // ==========================================
    // ESTADO
    // ==========================================

    cargando = true;

    mensajeError = '';


    // ==========================================
    // INTERVALO
    // ==========================================

    private intervalId:
        ReturnType<typeof setInterval> | undefined;


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

        private cdr: ChangeDetectorRef,

        private router: Router

    ) {}


    // ==========================================
    // INICIALIZAR
    // ==========================================

    ngOnInit(): void {

        console.log(
            '================================'
        );

        console.log(
            '🔥 CARRUSEL INICIADO'
        );

        console.log(
            '================================'
        );

        this.obtenerPerfumes();

    }


    // ==========================================
    // OBTENER TODOS LOS PERFUMES
    // ==========================================

    obtenerPerfumes(): void {

        this.cargando = true;

        this.mensajeError = '';


        const url =
            `${this.apiUrl}/Perfumes`;


        console.log(
            '🔄 CARGANDO PERFUMES DEL CARRUSEL...'
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
                        '================================'
                    );

                    console.log(
                        '🔥 PERFUMES DEL CARRUSEL:',
                        respuesta
                    );

                    console.log(
                        'TOTAL DE PERFUMES:',
                        respuesta?.length
                    );

                    console.log(
                        '================================'
                    );


                    // ==================================
                    // GUARDAR PERFUMES
                    // ==================================

                    this.perfumes =
                        Array.isArray(respuesta)
                            ? respuesta
                            : [];


                    // ==================================
                    // REINICIAR SLIDE
                    // ==================================

                    this.currentSlide = 0;


                    // ==================================
                    // TERMINAR CARGA
                    // ==================================

                    this.cargando = false;


                    // ==================================
                    // INICIAR CARRUSEL
                    // ==================================

                    if (
                        this.perfumes.length > 1
                    ) {

                        this.startAutoSlide();

                    }


                    this.cdr.detectChanges();

                },


                error: (error) => {

                    console.error(
                        '================================'
                    );

                    console.error(
                        '❌ ERROR AL CARGAR PERFUMES'
                    );

                    console.error(
                        error
                    );

                    console.error(
                        '================================'
                    );


                    this.perfumes = [];

                    this.mensajeError =
                        'No fue posible cargar los perfumes.';

                    this.cargando = false;


                    this.stopAutoSlide();


                    this.cdr.detectChanges();

                }

            });

    }


    // ==========================================
    // OBTENER IMAGEN
    // ==========================================

    obtenerImagen(perfume: any): string {

        if (!perfume?.imagen) {

            return '';

        }


        const imagen =
            String(perfume.imagen).trim();


        // ==================================
        // SI YA ES URL COMPLETA
        // ==================================

        if (
            imagen.startsWith('http://') ||
            imagen.startsWith('https://')
        ) {

            return imagen;

        }


        // ==================================
        // SI YA COMIENZA CON /
        // ==================================

        if (imagen.startsWith('/')) {

            return imagen;

        }


        // ==================================
        // IMAGEN LOCAL
        // ==================================

        return '/' + imagen;

    }


    // ==========================================
    // SIGUIENTE SLIDE
    // ==========================================

    nextSlide(): void {

        if (
            this.perfumes.length === 0
        ) {

            return;

        }


        this.currentSlide++;


        if (
            this.currentSlide >=
            this.perfumes.length
        ) {

            this.currentSlide = 0;

        }


        console.log(
            '➡️ SIGUIENTE SLIDE:',
            this.currentSlide
        );


        this.cdr.detectChanges();

        this.restartAutoSlide();

    }


    // ==========================================
    // SLIDE ANTERIOR
    // ==========================================

    previousSlide(): void {

        if (
            this.perfumes.length === 0
        ) {

            return;

        }


        this.currentSlide--;


        if (
            this.currentSlide < 0
        ) {

            this.currentSlide =
                this.perfumes.length - 1;

        }


        console.log(
            '⬅️ SLIDE ANTERIOR:',
            this.currentSlide
        );


        this.cdr.detectChanges();

        this.restartAutoSlide();

    }


    // ==========================================
    // IR A UN SLIDE
    // ==========================================

    goToSlide(index: number): void {

        if (
            index < 0 ||
            index >= this.perfumes.length
        ) {

            return;

        }


        this.currentSlide = index;


        console.log(
            '📍 IR AL SLIDE:',
            this.currentSlide
        );


        this.cdr.detectChanges();

        this.restartAutoSlide();

    }


    // ==========================================
    // VER PERFUME
    // ==========================================

    verPerfume(id: number): void {

        console.log(
            '👀 ABRIENDO PERFUME:',
            id
        );


        // ==================================
        // VERIFICAR ID
        // ==================================

        if (!id) {

            console.error(
                '❌ No se recibió un ID de perfume.'
            );

            return;

        }


        // ==================================
        // IR AL DETALLE
        // ==================================

        this.router.navigate([
            '/perfume',
            id
        ]);

    }


    // ==========================================
    // INICIAR CAMBIO AUTOMÁTICO
    // ==========================================

    private startAutoSlide(): void {

        this.stopAutoSlide();


        if (
            this.perfumes.length <= 1
        ) {

            return;

        }


        this.intervalId =
            setInterval(() => {

                this.currentSlide++;


                if (
                    this.currentSlide >=
                    this.perfumes.length
                ) {

                    this.currentSlide = 0;

                }


                console.log(
                    '🔄 CAMBIO AUTOMÁTICO:',
                    this.currentSlide
                );


                this.cdr.detectChanges();


            }, 5000);

    }


    // ==========================================
    // DETENER CARRUSEL
    // ==========================================

    private stopAutoSlide(): void {

        if (
            this.intervalId !== undefined
        ) {

            clearInterval(
                this.intervalId
            );

            this.intervalId = undefined;

        }

    }


    // ==========================================
    // REINICIAR INTERVALO
    // ==========================================

    private restartAutoSlide(): void {

        this.stopAutoSlide();

        this.startAutoSlide();

    }


    // ==========================================
    // DESTRUIR COMPONENTE
    // ==========================================

    ngOnDestroy(): void {

        console.log(
            '🛑 CARRUSEL DETENIDO'
        );

        this.stopAutoSlide();

    }

}