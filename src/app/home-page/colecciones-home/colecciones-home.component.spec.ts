import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColeccionesHomeComponent } from './colecciones-home.component';

describe('ColeccionesHomeComponent', () => {
  let component: ColeccionesHomeComponent;
  let fixture: ComponentFixture<ColeccionesHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColeccionesHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColeccionesHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
