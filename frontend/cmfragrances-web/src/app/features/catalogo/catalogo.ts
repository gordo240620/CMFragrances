import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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

  perfumes: any[] = [];

  perfumesFiltrados: any[] = [];

  categorias: any[] = [];

  textoBusqueda = '';

  categoriaSeleccionada = 0;

  cargando = true;

  private apiUrl = 'http://localhost:5037/api';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.obtenerPerfumes();

    this.obtenerCategorias();

  }


  obtenerPerfumes(): void {

    this.http
      .get<any[]>(`${this.apiUrl}/Perfumes`)
      .subscribe({

        next: (respuesta) => {

          this.perfumes = respuesta.filter(
            perfume => perfume.activo
          );

          this.perfumesFiltrados = [...this.perfumes];

          this.cargando = false;

        },

        error: (error) => {

          console.error(
            'Error al obtener perfumes:',
            error
          );

          this.cargando = false;

        }

      });

  }


  obtenerCategorias(): void {

    this.http
      .get<any[]>(`${this.apiUrl}/Categorias`)
      .subscribe({

        next: (respuesta) => {

          this.categorias = respuesta;

        },

        error: (error) => {

          console.error(
            'Error al obtener categorías:',
            error
          );

        }

      });

  }


  filtrarPerfumes(): void {

    const texto = this.textoBusqueda
      .trim()
      .toLowerCase();

    this.perfumesFiltrados = this.perfumes.filter(
      perfume => {

        const coincideNombre =
          perfume.nombre
            .toLowerCase()
            .includes(texto);

        const coincideCategoria =
          this.categoriaSeleccionada === 0 ||
          perfume.categoriaId ===
          Number(this.categoriaSeleccionada);

        return coincideNombre &&
               coincideCategoria;

      }
    );

  }


  limpiarFiltros(): void {

    this.textoBusqueda = '';

    this.categoriaSeleccionada = 0;

    this.perfumesFiltrados = [
      ...this.perfumes
    ];

  }


  verDetalle(id: number): void {

    this.router.navigate([
      '/perfume',
      id
    ]);

  }

}