import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniatureEditComponent } from './miniature-edit.component';

describe('MiniatureEditComponent', () => {
  let component: MiniatureEditComponent;
  let fixture: ComponentFixture<MiniatureEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniatureEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MiniatureEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
