import {
    Component,
    OnDestroy,
    OnInit,
    ChangeDetectorRef
} from '@angular/core';

@Component({
    selector: 'app-hero-slider',
    standalone: true,
    imports: [],
    templateUrl: './hero-slider.html',
    styleUrl: './hero-slider.css'
})
export class HeroSlider implements OnInit, OnDestroy {

    currentSlide = 0;

    private intervalId: ReturnType<typeof setInterval> | undefined;


    constructor(
        private cdr: ChangeDetectorRef
    ) {}


    // ==========================================
    // INICIAR CARRUSEL
    // ==========================================

    ngOnInit(): void {

        console.log('🔥 CARRUSEL INICIADO');

        this.startAutoSlide();

    }


    // ==========================================
    // DETENER CARRUSEL
    // ==========================================

    ngOnDestroy(): void {

        console.log('🛑 CARRUSEL DETENIDO');

        this.stopAutoSlide();

    }


    // ==========================================
    // SIGUIENTE SLIDE
    // ==========================================

    nextSlide(): void {

        this.currentSlide++;

        if (this.currentSlide > 3) {

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

        this.currentSlide--;

        if (this.currentSlide < 0) {

            this.currentSlide = 3;

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

        this.currentSlide = index;

        console.log(
            '📍 IR AL SLIDE:',
            this.currentSlide
        );

        this.cdr.detectChanges();

        this.restartAutoSlide();

    }


    // ==========================================
    // CAMBIO AUTOMÁTICO
    // ==========================================

    private startAutoSlide(): void {

        this.stopAutoSlide();

        this.intervalId = setInterval(() => {

            this.currentSlide++;

            if (this.currentSlide > 3) {

                this.currentSlide = 0;

            }

            console.log(
                '🔄 CAMBIO AUTOMÁTICO:',
                this.currentSlide
            );

            // 🔥 IMPORTANTE
            // Fuerza a Angular a actualizar el HTML

            this.cdr.detectChanges();

        }, 5000);

    }


    // ==========================================
    // DETENER INTERVALO
    // ==========================================

    private stopAutoSlide(): void {

        if (this.intervalId !== undefined) {

            clearInterval(this.intervalId);

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

}