import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintGuideEditComponent } from './paint-guide-edit.component';

describe('PaintGuideEditComponent', () => {
  let component: PaintGuideEditComponent;
  let fixture: ComponentFixture<PaintGuideEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaintGuideEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaintGuideEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
