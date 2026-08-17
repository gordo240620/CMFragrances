import {
    Component,
    OnInit,
    inject,
    ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { HttpClient } from '@angular/common/http';

import { timeout } from 'rxjs';


@Component({

    selector: 'app-perfumes',

    standalone: true,

    imports: [
        CommonModule,
        FormsModule
    ],

    templateUrl: './perfumes.html',

    styleUrl: './perfumes.css'

})
export class Perfumes implements OnInit {


    // ==========================================
    // HTTP
    // ==========================================

    private http = inject(HttpClient);


    // ==========================================
    // CHANGE DETECTOR
    // ==========================================

    private changeDetector =
        inject(ChangeDetectorRef);


    // ==========================================
    // URL API
    // ==========================================

    private apiUrl =
        'https://cmfragrances-api-rbev.onrender.com/api';


    // ==========================================
    // PERFUMES
    // ==========================================

    perfumes: any[] = [];


    // ==========================================
    // CATEGORÍAS
    // ==========================================

    categorias = [

        {
            id: 2,
            nombre: 'Diseñador'
        },

        {
            id: 3,
            nombre: 'Árabe'
        },

        {
            id: 4,
            nombre: 'Nicho'
        }

    ];


    // ==========================================
    // ESTADOS
    // ==========================================

    cargando = false;

    mensajeError = '';


    // ==========================================
    // FORMULARIO
    // ==========================================

    mostrarFormulario = false;

    guardando = false;

    mensajeFormulario = '';


    // ==========================================
    // CONFIRMACIÓN DE ELIMINACIÓN
    // ==========================================

    mostrarConfirmacionEliminar = false;

    perfumeAEliminar: any = null;

    eliminando = false;

    mostrarNotificacion = false;

    mensajeNotificacion = '';


    // ==========================================
    // MODO DEL FORMULARIO
    // ==========================================

    modoEdicion = false;

    perfumeEditandoId: number | null = null;


    // ==========================================
    // NUEVO / EDITAR PERFUME
    // ==========================================

    nuevoPerfume = {

        nombre: '',

        marca: '',

        descripcion: '',

        concentracion: '',

        contenidoML: 100,

        precio: 0,

        stock: 0,

        imagen: '',

        activo: true,

        categoriaId: 2

    };


    // ==========================================
    // INICIO
    // ==========================================

    ngOnInit(): void {

        console.log(
            '================================'
        );

        console.log(
            'INICIANDO COMPONENTE PERFUMES'
        );

        console.log(
            'CATEGORÍAS DISPONIBLES:',
            this.categorias
        );

        console.log(
            '================================'
        );

        this.cargarPerfumes();

    }


    // ==========================================
    // CARGAR PERFUMES
    // ==========================================

    cargarPerfumes(): void {

        console.log(
            'CARGANDO PERFUMES...'
        );

        this.cargando = true;

        this.mensajeError = '';


        this.http
            .get<any[]>(
                `${this.apiUrl}/Perfumes`
            )

            .pipe(
                timeout(15000)
            )

            .subscribe({

                next: (respuesta) => {

                    console.log(
                        'PERFUMES RECIBIDOS:',
                        respuesta
                    );


                    if (
                        Array.isArray(respuesta)
                    ) {

                        this.perfumes =
                            [...respuesta];

                    }

                    else {

                        this.perfumes = [];

                    }


                    this.cargando = false;


                    this.changeDetector.detectChanges();

                },


                error: (error) => {

                    console.error(
                        'ERROR AL OBTENER PERFUMES:',
                        error
                    );


                    this.cargando = false;


                    if (
                        error.name ===
                        'TimeoutError'
                    ) {

                        this.mensajeError =
                            'El servidor está tardando demasiado en responder.';

                    }

                    else if (
                        error.status === 0
                    ) {

                        this.mensajeError =
                            'No fue posible conectar con el servidor.';

                    }

                    else if (
                        error.status === 401
                    ) {

                        this.mensajeError =
                            'No tienes autorización para consultar los perfumes.';

                    }

                    else if (
                        error.status === 404
                    ) {

                        this.mensajeError =
                            'La ruta de perfumes no existe en la API.';

                    }

                    else {

                        this.mensajeError =
                            'Ocurrió un error al cargar los perfumes.';

                    }


                    this.changeDetector.detectChanges();

                }

            });

    }


    // ==========================================
    // ABRIR FORMULARIO PARA AGREGAR
    // ==========================================

    abrirFormulario(): void {

        this.modoEdicion = false;

        this.perfumeEditandoId = null;

        this.mensajeFormulario = '';

        this.limpiarFormulario();

        this.mostrarFormulario = true;

    }


    // ==========================================
    // EDITAR PERFUME
    // ==========================================

    editarPerfume(perfume: any): void {

        console.log(
            '================================'
        );

        console.log(
            'EDITANDO PERFUME'
        );

        console.log(
            'PERFUME:',
            perfume
        );

        console.log(
            '================================'
        );


        // ======================================
        // ACTIVAR MODO EDICIÓN
        // ======================================

        this.modoEdicion = true;

        this.perfumeEditandoId =
            Number(perfume.id);


        // ======================================
        // LIMPIAR MENSAJE
        // ======================================

        this.mensajeFormulario = '';


        // ======================================
        // CARGAR DATOS EN FORMULARIO
        // ======================================

        this.nuevoPerfume = {

            nombre:
                perfume.nombre ?? '',

            marca:
                perfume.marca ?? '',

            descripcion:
                perfume.descripcion ?? '',

            concentracion:
                perfume.concentracion ?? '',

            contenidoML:
                Number(
                    perfume.contenidoML ?? 100
                ),

            precio:
                Number(
                    perfume.precio ?? 0
                ),

            stock:
                Number(
                    perfume.stock ?? 0
                ),

            imagen:
                perfume.imagen ?? '',

            activo:
                perfume.activo ?? true,

            categoriaId:
                Number(
                    perfume.categoriaId ?? 2
                )

        };


        // ======================================
        // ABRIR FORMULARIO
        // ======================================

        this.mostrarFormulario = true;


        this.changeDetector.detectChanges();

    }


    // ==========================================
    // CERRAR FORMULARIO
    // ==========================================

    cerrarFormulario(): void {

        if (this.guardando) {

            return;

        }


        this.mostrarFormulario = false;

        this.mensajeFormulario = '';

        this.modoEdicion = false;

        this.perfumeEditandoId = null;

    }


    // ==========================================
    // LIMPIAR FORMULARIO
    // ==========================================

    limpiarFormulario(): void {

        this.nuevoPerfume = {

            nombre: '',

            marca: '',

            descripcion: '',

            concentracion: '',

            contenidoML: 100,

            precio: 0,

            stock: 0,

            imagen: '',

            activo: true,

            categoriaId: 2

        };

    }


    // ==========================================
    // GUARDAR PERFUME
    // ==========================================

    guardarPerfume(): void {

        console.log(
            '================================'
        );

        console.log(
            this.modoEdicion
                ? 'ACTUALIZANDO PERFUME...'
                : 'CREANDO PERFUME...'
        );

        console.log(
            'DATOS:',
            this.nuevoPerfume
        );

        console.log(
            '================================'
        );


        this.mensajeFormulario = '';


        // ======================================
        // VALIDACIONES
        // ======================================

        if (
            !this.nuevoPerfume.nombre.trim()
        ) {

            this.mensajeFormulario =
                'Ingresa el nombre del perfume.';

            return;

        }


        if (
            !this.nuevoPerfume.marca.trim()
        ) {

            this.mensajeFormulario =
                'Ingresa la marca del perfume.';

            return;

        }


        if (
            this.nuevoPerfume.contenidoML <= 0
        ) {

            this.mensajeFormulario =
                'El contenido debe ser mayor a 0 ml.';

            return;

        }


        if (
            this.nuevoPerfume.precio <= 0
        ) {

            this.mensajeFormulario =
                'El precio debe ser mayor a 0.';

            return;

        }


        if (
            this.nuevoPerfume.stock < 0
        ) {

            this.mensajeFormulario =
                'El stock no puede ser negativo.';

            return;

        }


        if (
            !this.nuevoPerfume.categoriaId
        ) {

            this.mensajeFormulario =
                'Selecciona una categoría.';

            return;

        }


        this.guardando = true;


        // ======================================
        // PREPARAR DATOS
        // ======================================

        const datos = {

            nombre:
                this.nuevoPerfume.nombre.trim(),

            marca:
                this.nuevoPerfume.marca.trim(),

            descripcion:
                this.nuevoPerfume.descripcion.trim(),

            concentracion:
                this.nuevoPerfume.concentracion.trim(),

            contenidoML:
                Number(
                    this.nuevoPerfume.contenidoML
                ),

            precio:
                Number(
                    this.nuevoPerfume.precio
                ),

            stock:
                Number(
                    this.nuevoPerfume.stock
                ),

            imagen:
                this.nuevoPerfume.imagen.trim(),

            activo:
                this.nuevoPerfume.activo,

            categoriaId:
                Number(
                    this.nuevoPerfume.categoriaId
                )

        };


        // ======================================
        // MODO EDICIÓN
        // ======================================

        if (
            this.modoEdicion &&
            this.perfumeEditandoId !== null
        ) {

            this.actualizarPerfume(
                this.perfumeEditandoId,
                datos
            );

            return;

        }


        // ======================================
        // MODO CREAR
        // ======================================

        this.http
            .post<any>(
                `${this.apiUrl}/Perfumes`,
                datos
            )

            .pipe(
                timeout(15000)
            )

            .subscribe({

                next: (respuesta) => {

                    console.log(
                        'PERFUME CREADO:',
                        respuesta
                    );


                    this.guardando = false;


                    // ==================================
                    // AGREGAR DIRECTAMENTE A LA TABLA
                    // ==================================

                    if (respuesta) {

                        this.perfumes = [

                            respuesta,

                            ...this.perfumes

                        ];

                    }


                    // ==================================
                    // MENSAJE
                    // ==================================

                    this.mensajeFormulario =
                        '¡Perfume agregado correctamente!';


                    this.changeDetector.detectChanges();


                    // ==================================
                    // CERRAR
                    // ==================================

                    setTimeout(() => {

                        this.mostrarFormulario = false;

                        this.mensajeFormulario = '';

                        this.limpiarFormulario();

                        this.changeDetector.detectChanges();

                    }, 1200);

                },


                error: (error) => {

                    console.error(
                        'ERROR AL CREAR PERFUME:',
                        error
                    );


                    this.guardando = false;


                    this.mostrarErrorFormulario(
                        error,
                        'agregar'
                    );


                    this.changeDetector.detectChanges();

                }

            });

    }


    // ==========================================
    // ACTUALIZAR PERFUME
    // ==========================================

    private actualizarPerfume(
        id: number,
        datos: any
    ): void {

        console.log(
            '================================'
        );

        console.log(
            'ACTUALIZANDO PERFUME ID:',
            id
        );

        console.log(
            'DATOS:',
            datos
        );

        console.log(
            '================================'
        );


        this.http
            .put(
                `${this.apiUrl}/Perfumes/${id}`,
                datos
            )

            .pipe(
                timeout(15000)
            )

            .subscribe({

                next: () => {

                    console.log(
                        'PERFUME ACTUALIZADO CORRECTAMENTE'
                    );


                    this.guardando = false;


                    // ==================================
                    // ACTUALIZAR EN LA TABLA
                    // ==================================

                    const indice =
                        this.perfumes.findIndex(
                            p =>
                                Number(p.id) === id
                        );


                    if (indice !== -1) {

                        this.perfumes[indice] = {

                            ...this.perfumes[indice],

                            ...datos,

                            id: id

                        };

                    }


                    // ==================================
                    // MENSAJE
                    // ==================================

                    this.mensajeFormulario =
                        '¡Perfume actualizado correctamente!';


                    this.changeDetector.detectChanges();


                    // ==================================
                    // CERRAR
                    // ==================================

                    setTimeout(() => {

                        this.mostrarFormulario = false;

                        this.mensajeFormulario = '';

                        this.modoEdicion = false;

                        this.perfumeEditandoId = null;

                        this.limpiarFormulario();

                        this.changeDetector.detectChanges();

                    }, 1200);

                },


                error: (error) => {

                    console.error(
                        'ERROR AL ACTUALIZAR PERFUME:',
                        error
                    );


                    this.guardando = false;


                    this.mostrarErrorFormulario(
                        error,
                        'actualizar'
                    );


                    this.changeDetector.detectChanges();

                }

            });

    }


    // ==========================================
    // ABRIR CONFIRMACIÓN DE ELIMINACIÓN
    // ==========================================

    eliminarPerfume(perfume: any): void {

        console.log(
            'ELIMINAR PERFUME:',
            perfume
        );

        this.perfumeAEliminar = perfume;

        this.mostrarConfirmacionEliminar = true;

    }


    // ==========================================
    // CANCELAR ELIMINACIÓN
    // ==========================================

    cancelarEliminar(): void {

        if (this.eliminando) {

            return;

        }

        this.mostrarConfirmacionEliminar = false;

        this.perfumeAEliminar = null;

    }


    // ==========================================
    // CONFIRMAR ELIMINACIÓN
    // ==========================================

    confirmarEliminar(): void {

        if (
            !this.perfumeAEliminar ||
            this.eliminando
        ) {

            return;

        }

        const id =
            Number(
                this.perfumeAEliminar.id
            );

        this.eliminando = true;

        console.log(
            'CONFIRMANDO ELIMINACIÓN DEL PERFUME:',
            this.perfumeAEliminar
        );

        this.http
            .delete(
                `${this.apiUrl}/Perfumes/${id}`
            )
            .pipe(
                timeout(15000)
            )
            .subscribe({

                next: () => {

                    console.log(
                        'PERFUME ELIMINADO CORRECTAMENTE'
                    );

                    this.perfumes =
                        this.perfumes.filter(
                            p =>
                                Number(p.id) !== id
                        );

                    this.mostrarConfirmacionEliminar = false;
                    this.perfumeAEliminar = null;
                    this.eliminando = false;

                    this.mostrarNotificacion = true;
                    this.mensajeNotificacion =
                        '¡Perfume eliminado correctamente!';

                    this.changeDetector.detectChanges();

                    setTimeout(() => {

                        this.mostrarNotificacion = false;
                        this.changeDetector.detectChanges();

                    }, 2500);

                },

                error: (error) => {

                    console.error(
                        'ERROR AL ELIMINAR PERFUME:',
                        error
                    );

                    this.eliminando = false;

                    let mensaje =
                        'Ocurrió un error al eliminar el perfume.';

                    if (error.name === 'TimeoutError') {
                        mensaje =
                            'El servidor está tardando demasiado en responder.';
                    }
                    else if (error.status === 401) {
                        mensaje =
                            'Tu sesión no tiene autorización para eliminar perfumes.';
                    }
                    else if (error.status === 403) {
                        mensaje =
                            'No tienes permisos para eliminar perfumes.';
                    }
                    else if (error.status === 404) {
                        mensaje =
                            'El perfume no fue encontrado.';
                    }
                    else if (error.status === 0) {
                        mensaje =
                            'No fue posible conectar con el servidor.';
                    }

                    this.mensajeFormulario = mensaje;
                    this.changeDetector.detectChanges();

                }

            });

    }


    // ==========================================
    // MENSAJES DE ERROR
    // ==========================================

    private mostrarErrorFormulario(
        error: any,
        accion: string
    ): void {

        if (
            error.name ===
            'TimeoutError'
        ) {

            this.mensajeFormulario =
                'El servidor está tardando demasiado en responder.';

        }

        else if (
            error.status === 0
        ) {

            this.mensajeFormulario =
                'No fue posible conectar con el servidor.';

        }

        else if (
            error.status === 400
        ) {

            this.mensajeFormulario =
                'Los datos enviados no son válidos.';

        }

        else if (
            error.status === 401
        ) {

            this.mensajeFormulario =
                `Tu sesión no tiene autorización para ${accion} perfumes.`;

        }

        else if (
            error.status === 403
        ) {

            this.mensajeFormulario =
                `No tienes permisos para ${accion} perfumes.`;

        }

        else if (
            error.status === 404
        ) {

            this.mensajeFormulario =
                'No se encontró el perfume.';

        }

        else {

            this.mensajeFormulario =
                `Ocurrió un error al ${accion} el perfume.`;

        }

    }

}