import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmyListComponent } from './army-list.component';

describe('ArmyListComponent', () => {
  let component: ArmyListComponent;
  let fixture: ComponentFixture<ArmyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArmyListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArmyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
