import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import {Observable, of, throwError} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {AuthService} from "../../../auth/auth.service";

import {PaintGuideService} from "../../../services/paint-guide.service";
import {PaintGuideInterface} from "../../../models/paint-guide.interface";

@Injectable({
	providedIn: 'root'
})
export class PaintGuideEditGuard implements CanActivate {
	constructor(
		private authService: AuthService,
		private router: Router,
		private paintGuideService: PaintGuideService
	) {}

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> {
		const userId = localStorage.getItem('userId');
		if (!userId) {
			return of(this.router.createUrlTree(['/login']));
		}

		this.authService.getAuthStatusListener()

		const paintGuideId = next.paramMap.get('paintGuideId');
		if (!paintGuideId) {
			console.log('404')

			return of(this.router.createUrlTree(['/404']));
		}

		return this.paintGuideService.getPaintGuide(paintGuideId).pipe(
			map((paintGuide: PaintGuideInterface) => {
				if (!paintGuide) {
					return this.router.createUrlTree(['/404']);
				}
				if (paintGuide.ownerId._id !== userId) {
					console.warn("You're not authorized!")
					return this.router.createUrlTree(['/dashboard']);
				}
				return true;
			}),
			catchError(error => {
				if (error.status === 500) {
					return of(this.router.createUrlTree(['/404']));
				} else {
					// Re-throw the error for other error statuses
					return throwError(error);
				}
			})
		);
	}
}
