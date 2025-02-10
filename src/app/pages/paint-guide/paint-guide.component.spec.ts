import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintGuideComponent } from './paint-guide.component';

describe('PaintGuideComponent', () => {
  let component: PaintGuideComponent;
  let fixture: ComponentFixture<PaintGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaintGuideComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaintGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
