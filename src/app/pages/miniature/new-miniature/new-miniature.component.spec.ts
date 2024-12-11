import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMiniatureComponent } from './new-miniature.component';

describe('NewMiniatureComponent', () => {
	let component: NewMiniatureComponent;
	let fixture: ComponentFixture<NewMiniatureComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NewMiniatureComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(NewMiniatureComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
