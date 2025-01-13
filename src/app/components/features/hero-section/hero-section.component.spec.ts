import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroSectionComponent } from './hero-section.component';
import { RouterTestingModule } from '@angular/router/testing';

fdescribe('HeroSectionComponent', () => {
	let component: HeroSectionComponent;
	let fixture: ComponentFixture<HeroSectionComponent>;


	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				HeroSectionComponent, // Import the standalone component here
				RouterTestingModule, // Import RouterTestingModule if your component uses routerLink
			],
		}).compileComponents();

		fixture = TestBed.createComponent(HeroSectionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should render the component', () => {
		expect(component).toBeTruthy();
	});


	it('should contain an h1 tag with the title "Wharmy"', () => {
		const compiled = fixture.nativeElement;
		const h1 = compiled.querySelector('h1');
		expect(h1).toBeTruthy(); // Check if h1 exists
		expect(h1.textContent).toContain('Wharmy'); // Check h1 content
	});

	it('should display the hero image with correct src and alt', () => {
		const compiled = fixture.nativeElement;
		const img = compiled.querySelector('img');
		expect(img).toBeTruthy();
		expect(img?.getAttribute('src')).toBe('../../../../assets/images/hero-section.png');
		expect(img?.getAttribute('alt')).toBe('power sword');
	});

	it('should display the correct subheading text', () => {
		const compiled = fixture.nativeElement;
		const subhead = compiled.querySelector('.hero-section__subhead');
		expect(subhead).toBeTruthy();
		expect(subhead?.textContent?.trim()).toBe(
			'Create, manage, and share your Warhammer army with painting guides and tutorials.'
		);
	});

	it('should have a "Get Started" button with the correct routerLink', () => {
		const compiled = fixture.nativeElement;
		const ctaLink = compiled.querySelector('.hero-section__cta');
		expect(ctaLink).toBeTruthy();
		expect(ctaLink?.getAttribute('routerLink')).toBe('/dashboard');
	});

	it('should have an "Explore Armies" button with the correct routerLink', () => {
		const compiled = fixture.nativeElement;
		const exploreLink = compiled.querySelector('.hero-section__link');
		expect(exploreLink).toBeTruthy();
		expect(exploreLink?.getAttribute('routerLink')).toBe('/armies');
	});
});
