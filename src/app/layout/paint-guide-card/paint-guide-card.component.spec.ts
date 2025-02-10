import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintGuideCardComponent } from './paint-guide-card.component';

describe('PaintGuideCardComponent', () => {
  let component: PaintGuideCardComponent;
  let fixture: ComponentFixture<PaintGuideCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaintGuideCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaintGuideCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
