import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-brand-card',
  standalone: true,
  imports: [],
  templateUrl: './brand-card.html',
  styleUrl: './brand-card.css'
})
export class BrandCard {

  @Input() nombre: string = '';

  @Input() logo: string = '';

}