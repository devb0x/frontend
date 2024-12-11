import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewArmyComponent } from './new-army.component';

describe('NewArmyComponent', () => {
  let component: NewArmyComponent;
  let fixture: ComponentFixture<NewArmyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewArmyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewArmyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
