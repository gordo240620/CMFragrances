import { Component } from '@angular/core';

import { Hero } from '../../shared/components/hero/hero';
import { PerfumeCard } from '../../shared/components/perfume-card/perfume-card';
import { BrandCard } from '../../shared/components/brand-card/brand-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    Hero,
    PerfumeCard,
    BrandCard
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {}