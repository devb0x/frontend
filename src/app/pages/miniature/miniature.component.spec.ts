import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniatureComponent } from './miniature.component';

describe('MiniatureComponent', () => {
  let component: MiniatureComponent;
  let fixture: ComponentFixture<MiniatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniatureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MiniatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
