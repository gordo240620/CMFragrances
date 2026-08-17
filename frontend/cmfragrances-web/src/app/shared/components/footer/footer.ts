import { Component } from '@angular/core';

import { Router } from '@angular/router';


@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [],
    templateUrl: './footer.html',
    styleUrl: './footer.css'
})
export class Footer {


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    constructor(
        private router: Router
    ) {}


    // ==========================================
    // IR AL CATÁLOGO
    // ==========================================

    irAlCatalogo(): void {

        this.router.navigate([
            '/catalogo'
        ]);

    }

}