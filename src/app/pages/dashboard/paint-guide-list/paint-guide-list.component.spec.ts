import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintGuideListComponent } from './paint-guide-list.component';

describe('PaintGuideListComponent', () => {
  let component: PaintGuideListComponent;
  let fixture: ComponentFixture<PaintGuideListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaintGuideListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaintGuideListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
