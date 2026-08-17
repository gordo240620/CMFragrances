import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';


export interface Perfume {

    id: number;

    nombre: string;

    marca: string;

    descripcion: string;

    concentracion: string;

    contenidoML: number;

    precio: number;

    stock: number;

    imagen: string;

    activo: boolean;

    categoriaId: number;

    categoria: string;

}


export interface PerfumeRequest {

    nombre: string;

    marca: string;

    descripcion: string;

    concentracion: string;

    contenidoML: number;

    precio: number;

    stock: number;

    imagen: string;

    activo: boolean;

    categoriaId: number;

}


@Injectable({
    providedIn: 'root'
})
export class PerfumeService {


    // ==========================================
    // HTTP
    // ==========================================

    private http =
        inject(HttpClient);


    // ==========================================
    // URL DE LA API
    // ==========================================

    private apiUrl =
        environment.apiUrl;


    // ==========================================
    // OBTENER TODOS LOS PERFUMES
    // ==========================================

    obtenerPerfumes(): Observable<Perfume[]> {

        return this.http.get<Perfume[]>(

            `${this.apiUrl}/Perfumes`

        );

    }


    // ==========================================
    // OBTENER PERFUME POR ID
    // ==========================================

    obtenerPerfume(
        id: number
    ): Observable<Perfume> {

        return this.http.get<Perfume>(

            `${this.apiUrl}/Perfumes/${id}`

        );

    }


    // ==========================================
    // CREAR PERFUME
    // ==========================================

    crearPerfume(
        perfume: PerfumeRequest
    ): Observable<Perfume> {

        return this.http.post<Perfume>(

            `${this.apiUrl}/Perfumes`,

            perfume

        );

    }


    // ==========================================
    // ACTUALIZAR PERFUME
    // ==========================================

    actualizarPerfume(
        id: number,
        perfume: PerfumeRequest
    ): Observable<void> {

        return this.http.put<void>(

            `${this.apiUrl}/Perfumes/${id}`,

            perfume

        );

    }


    // ==========================================
    // ELIMINAR PERFUME
    // ==========================================

    eliminarPerfume(
        id: number
    ): Observable<void> {

        return this.http.delete<void>(

            `${this.apiUrl}/Perfumes/${id}`

        );

    }

}