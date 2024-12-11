import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniatureCardComponent } from './miniature-card.component';

describe('MiniatureCardComponent', () => {
  let component: MiniatureCardComponent;
  let fixture: ComponentFixture<MiniatureCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniatureCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MiniatureCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
