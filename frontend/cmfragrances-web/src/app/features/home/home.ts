import { Component } from '@angular/core';

import { PerfumeCard } from '../../shared/components/perfume-card/perfume-card';
import { BrandCard } from '../../shared/components/brand-card/brand-card';
import { HeroSlider } from '../../shared/components/hero-slider/hero-slider';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    PerfumeCard,
    BrandCard,
    HeroSlider
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {}