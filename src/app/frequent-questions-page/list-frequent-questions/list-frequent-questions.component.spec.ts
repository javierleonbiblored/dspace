import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFrequentQuestionsComponent } from './list-frequent-questions.component';

describe('ListFrequentQuestionsComponent', () => {
  let component: ListFrequentQuestionsComponent;
  let fixture: ComponentFixture<ListFrequentQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListFrequentQuestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFrequentQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
