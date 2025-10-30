import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintGuidesComponent } from './paint-guides.component';

describe('PaintGuidesComponent', () => {
  let component: PaintGuidesComponent;
  let fixture: ComponentFixture<PaintGuidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaintGuidesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaintGuidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
