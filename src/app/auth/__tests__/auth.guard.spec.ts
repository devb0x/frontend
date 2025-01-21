import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from "@angular/common/http";

import { AuthService } from '../auth.service';
import { AuthGuard } from '../auth.guard';

fdescribe('AuthGuard', () => {
	let authService: jasmine.SpyObj<AuthService>;
	let router: jasmine.SpyObj<Router>;

	beforeEach(() => {
		const authServiceSpy = jasmine.createSpyObj('AuthService', ['getIsAuth']);
		const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule,
				HttpClientModule
			],
			providers: [
				{ provide: AuthService, useValue: authServiceSpy },
				{ provide: Router, useValue: routerSpy },
			],
		});

		authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
		router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
	});

	it('should allow navigation when user is authenticated', () => {
		authService.getIsAuth.and.returnValue(true); // Simulate authentication
		const result = TestBed.runInInjectionContext(() => AuthGuard(null as any, null as any)); // Pass placeholders for route and state
		expect(result).toBeTrue(); // Assert that the guard allows navigation
	});

	it('should block navigation and redirect to /login when user is not authenticated', () => {
		authService.getIsAuth.and.returnValue(false);

		const result = TestBed.runInInjectionContext(() => AuthGuard(null as any, null as any));
		expect(result).toBeFalse();
		expect(router.navigate).toHaveBeenCalledWith(['/login']);
	});
});
