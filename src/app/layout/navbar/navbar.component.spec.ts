import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from "@angular/common/http";
import { Location } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";
import { AuthService } from "../../auth/auth.service";
import { of } from 'rxjs'

import { NavbarComponent } from './navbar.component';

class MockAuthService extends AuthService {
	private authStatus!: boolean;

	override getAuthStatusListener() {
		return of(this.authStatus); // Return the current auth status as an observable
	}
}


fdescribe('HeaderComponent', () => {
	let component: NavbarComponent;
	let fixture: ComponentFixture<NavbarComponent>;
	let authService: AuthService;
	let router: Router;
	let location: Location;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				NavbarComponent,
				RouterTestingModule.withRoutes([
					{ path: 'login', component: NavbarComponent },
					{ path: 'dashboard', component: NavbarComponent }
				]),
				HttpClientModule
			],
			providers: [
				{provide: AuthService, useClass: MockAuthService}
			]
		}).compileComponents();

		fixture = TestBed.createComponent(NavbarComponent);
		component = fixture.componentInstance;
		authService = TestBed.inject(AuthService) as MockAuthService
		router = TestBed.inject(Router)
		location = TestBed.inject(Location)
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should display the wharmy logo', () => {
		const compiled = fixture.nativeElement
		const img = compiled.querySelector('img')
		expect(img).toBeTruthy()
		expect(img?.getAttribute('src')).toBe('../../../assets/logos/wharmy-logo.png')
		expect(img?.getAttribute('alt')).toBe('wharmy logo')
	})

	it('should display dashboard link when user is authenticated', () => {
		spyOn(authService, 'getAuthStatusListener').and.returnValue(of(true));
		component.ngOnInit(); // Trigger manual initialization
		fixture.detectChanges();

		const compiled = fixture.nativeElement as HTMLElement;
		expect(compiled.querySelector('a[href="/dashboard"]')).toBeTruthy();
	});

	it('should display login link when user is not authenticated', () => {
		spyOn(authService, 'getAuthStatusListener').and.returnValue(of(false));
		component.ngOnInit(); // Trigger manual initialization
		fixture.detectChanges();

		const compiled = fixture.nativeElement as HTMLElement;
		expect(compiled.querySelector('a[href="/login"]')).toBeTruthy();
	});

	it('should not display login link when user is authenticated', () => {
		spyOn(authService, 'getAuthStatusListener').and.returnValue(of(true));
		component.ngOnInit();
		fixture.detectChanges();

		const compiled = fixture.nativeElement as HTMLElement;
		expect(compiled.querySelector('a[href="/login"]')).toBeNull();
	});

	it('should not display dashboard link when user is unauthenticated', () => {
		spyOn(authService, 'getAuthStatusListener').and.returnValue(of(false));
		component.ngOnInit();
		fixture.detectChanges();

		const compiled = fixture.nativeElement as HTMLElement;
		expect(compiled.querySelector('a[href="/dashboard"]')).toBeNull();
	});

	it('should navigate to login page when login link is clicked', async () => {
		spyOn(authService, 'getAuthStatusListener').and.returnValue(of(false));
		component.ngOnInit();
		fixture.detectChanges();

		const compiled = fixture.nativeElement as HTMLElement;
		const loginLink = compiled.querySelector('a[href="/login"]') as HTMLAnchorElement;

		loginLink.click();
		await fixture.whenStable(); // Wait for navigation to stabilize

		expect(location.path()).toBe('/login');
	});

	it('should navigate to dashboard page when dashboard link is clicked', async () => {
		spyOn(authService, 'getAuthStatusListener').and.returnValue(of(true));
		component.ngOnInit();
		fixture.detectChanges();

		const compiled = fixture.nativeElement as HTMLElement;
		const loginLink = compiled.querySelector('a[href="/dashboard"]') as HTMLAnchorElement;

		loginLink.click();
		await fixture.whenStable(); // Wait for navigation to stabilize

		expect(location.path()).toBe('/dashboard');
	});

})
