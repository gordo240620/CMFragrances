import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-perfume-card',
  standalone: true,
  imports: [],
  templateUrl: './perfume-card.html',
  styleUrl: './perfume-card.css'
})
export class PerfumeCard {

  @Input() nombre: string = '';

  @Input() marca: string = '';

  @Input() precio: number = 0;

  @Input() imagen: string = '';

  @Input() calificacion: number = 5;

}