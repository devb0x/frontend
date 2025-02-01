import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPaintGuideComponent } from './new-paint-guide.component';

describe('NewPaintGuideComponent', () => {
  let component: NewPaintGuideComponent;
  let fixture: ComponentFixture<NewPaintGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPaintGuideComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewPaintGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
