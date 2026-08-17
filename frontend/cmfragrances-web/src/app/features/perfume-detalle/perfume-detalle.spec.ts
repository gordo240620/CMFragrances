import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfumeDetalle } from './perfume-detalle';

describe('PerfumeDetalle', () => {
  let component: PerfumeDetalle;
  let fixture: ComponentFixture<PerfumeDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfumeDetalle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfumeDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
