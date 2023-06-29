import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeContentComponent } from './type-content.component';

describe('TypeContentComponent', () => {
  let component: TypeContentComponent;
  let fixture: ComponentFixture<TypeContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
