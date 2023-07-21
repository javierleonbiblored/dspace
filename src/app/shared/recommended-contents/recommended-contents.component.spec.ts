import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedContentsComponent } from './recommended-contents.component';

describe('RecommendedContentsComponent', () => {
  let component: RecommendedContentsComponent;
  let fixture: ComponentFixture<RecommendedContentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendedContentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendedContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
