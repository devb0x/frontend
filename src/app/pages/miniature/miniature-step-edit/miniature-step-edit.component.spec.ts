import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniatureStepEditComponent } from './miniature-step-edit.component';

describe('MiniatureStepEditComponent', () => {
  let component: MiniatureStepEditComponent;
  let fixture: ComponentFixture<MiniatureStepEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniatureStepEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MiniatureStepEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
