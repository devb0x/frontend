import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmiesComponent } from './armies.component';

describe('ArmiesComponent', () => {
  let component: ArmiesComponent;
  let fixture: ComponentFixture<ArmiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArmiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArmiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
