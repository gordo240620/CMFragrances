import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class PedidoService {

    private http = inject(HttpClient);

    private apiUrl = environment.apiUrl;


    // ==========================================
    // OBTENER TODOS LOS PEDIDOS
    // ==========================================

    obtenerPedidos(): Observable<any[]> {

        return this.http.get<any[]>(
            `${this.apiUrl}/Pedido`
        );

    }


    // ==========================================
    // OBTENER PEDIDO POR ID
    // ==========================================

    obtenerPedido(id: number): Observable<any> {

        return this.http.get<any>(
            `${this.apiUrl}/Pedido/${id}`
        );

    }


    // ==========================================
    // OBTENER TODOS LOS DETALLES DE PEDIDOS
    // ==========================================

    obtenerDetallesPedido(): Observable<any[]> {

        return this.http.get<any[]>(
            `${this.apiUrl}/DetallePedido`
        );

    }


    // ==========================================
    // OBTENER DETALLE DE PEDIDO POR ID
    // ==========================================

    obtenerDetallePedido(id: number): Observable<any> {

        return this.http.get<any>(
            `${this.apiUrl}/DetallePedido/${id}`
        );

    }


    // ==========================================
    // CREAR PEDIDO
    // ==========================================

    crearPedido(data: any): Observable<any> {

        return this.http.post<any>(
            `${this.apiUrl}/Pedido`,
            data
        );

    }


    // ==========================================
    // CREAR DETALLE DE PEDIDO
    // ==========================================

    crearDetallePedido(data: any): Observable<any> {

        return this.http.post<any>(
            `${this.apiUrl}/DetallePedido`,
            data
        );

    }


    // ==========================================
    // ACTUALIZAR PEDIDO
    // ==========================================

    actualizarPedido(
        id: number,
        data: any
    ): Observable<any> {

        return this.http.put<any>(
            `${this.apiUrl}/Pedido/${id}`,
            data
        );

    }


    // ==========================================
    // ELIMINAR PEDIDO
    // ==========================================

    eliminarPedido(id: number): Observable<any> {

        return this.http.delete<any>(
            `${this.apiUrl}/Pedido/${id}`
        );

    }

}