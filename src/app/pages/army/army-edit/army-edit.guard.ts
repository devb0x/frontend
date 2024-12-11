import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import {Observable, of, throwError} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {AuthService} from "../../../auth/auth.service";
import {ArmyService} from "../../dashboard/army-list/army.service";
import {ArmyInterface} from "../../../models/army.interface";

@Injectable({
	providedIn: 'root'
})
export class ArmyEditGuard implements CanActivate {
	constructor(
		private authService: AuthService,
		private router: Router,
		private armyService: ArmyService
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

		const armyId = next.paramMap.get('armyId');
		if (!armyId) {
			console.log('404')

			return of(this.router.createUrlTree(['/404']));
		}

		return this.armyService.getArmy(armyId).pipe(
			map((army: ArmyInterface) => {
				if (!army) {
					return this.router.createUrlTree(['/404']);
				}
				if (army.ownerId !== userId) {
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

// http://localhost:4200/army/edit/666ea34694cc070dae0c33f4