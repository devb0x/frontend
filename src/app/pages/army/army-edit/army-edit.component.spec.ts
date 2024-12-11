import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmyEditComponent } from './army-edit.component';

describe('ArmyEditComponent', () => {
  let component: ArmyEditComponent;
  let fixture: ComponentFixture<ArmyEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArmyEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArmyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
