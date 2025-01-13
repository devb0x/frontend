import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HowItWorksComponent } from './how-it-works.component';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {RouterLinkWithHref} from "@angular/router";

fdescribe('HowItWorksComponent', () => {
	let component: HowItWorksComponent;
	let fixture: ComponentFixture<HowItWorksComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HowItWorksComponent, RouterTestingModule],
		}).compileComponents();

		fixture = TestBed.createComponent(HowItWorksComponent);
		component = fixture.componentInstance;
	});

	it('should create the component', () => {
		expect(component).toBeTruthy();
	});

	it('should render the correct number of steps', () => {
		// Arrange
		component.steps = [
			{
				icon: 'icon1.png',
				title: 'Step 1',
				description: 'Description for step 1',
				link: '/step1',
				linkText: 'Learn more',
				dot: '.',
			},
			{
				icon: 'icon2.png',
				title: 'Step 2',
				description: 'Description for step 2',
				link: undefined,
				linkText: '',
				dot: '',
			},
		];

		// Act
		fixture.detectChanges();

		const stepElements = fixture.debugElement.queryAll(By.css('.card'));

		// Assert
		expect(stepElements.length).toBe(2);
	});

	it('should render step titles and descriptions correctly', () => {
		// Arrange
		component.steps = [
			{
				icon: 'icon1.png',
				title: 'Step 1',
				description: 'Description for step 1',
				link: '/step1',
				linkText: 'Learn more',
				dot: '.',
			},
		];

		// Act
		fixture.detectChanges();

		const stepElement = fixture.debugElement.query(By.css('.card'));
		const title = stepElement.query(By.css('.card-title')).nativeElement.textContent;
		const description = stepElement.query(By.css('.card-text')).nativeElement.textContent;

		// Assert
		expect(title).toContain('Step 1');
		expect(description).toContain('Description for step 1');
	});

	it('should render the link if "link" is provided', () => {
		// Arrange
		component.steps = [
			{
				icon: 'icon1.png',
				title: 'Step 1',
				description: 'Description for step 1',
				link: '/step1',
				linkText: 'Learn more',
				dot: '.',
			},
		];

		// Act
		fixture.detectChanges();
		const link = fixture.debugElement.query(By.css('a'));

		// Assert
		expect(link).toBeTruthy();
		expect(link.nativeElement.textContent.trim()).toBe('Learn more');

		const routerLinkInstance = link.injector.get(RouterLinkWithHref);
		expect(routerLinkInstance['commands']).toEqual(['/step1']);
	});

	it('should not render the link if "link" is null', () => {
		// Arrange
		component.steps = [
			{
				icon: 'icon2.png',
				title: 'Step 2',
				description: 'Description for step 2',
				link: undefined,
				linkText: '',
				dot: '',
			},
		];

		// Act
		fixture.detectChanges();

		const link = fixture.debugElement.query(By.css('a'));

		// Assert
		expect(link).toBeNull();
	});
});
