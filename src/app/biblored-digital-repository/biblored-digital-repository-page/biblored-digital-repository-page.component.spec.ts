import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BibloredDigitalRepositoryPageComponent } from './biblored-digital-repository-page.component';

describe('BibloredDigitalRepositoryPageComponent', () => {
  let component: BibloredDigitalRepositoryPageComponent;
  let fixture: ComponentFixture<BibloredDigitalRepositoryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BibloredDigitalRepositoryPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BibloredDigitalRepositoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
