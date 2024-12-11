import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintSelectComponent } from './paint-select.component';

describe('PaintSelectComponent', () => {
  let component: PaintSelectComponent;
  let fixture: ComponentFixture<PaintSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaintSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaintSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
