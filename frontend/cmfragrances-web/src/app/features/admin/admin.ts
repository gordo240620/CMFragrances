import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';


@Component({
    selector: 'app-admin',
    standalone: true,

    imports: [
        RouterLink,
        RouterOutlet
    ],

    templateUrl: './admin.html',
    styleUrl: './admin.css'
})
export class Admin {

    private router = inject(Router);


    // ==========================================
    // SABER SI ESTAMOS EN PEDIDOS
    // ==========================================

    esPedidos(): boolean {

        return this.router.url === '/admin/pedidos';

    }

}