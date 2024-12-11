import { Injectable, inject } from "@angular/core"
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router"

import {AuthService} from "./auth.service";
import {ArmyService} from "../pages/dashboard/army-list/army.service";

@Injectable({
	providedIn: 'root'
})
class PermissionsService {
	constructor(
		private authService: AuthService,
		private router: Router,
		private armyService: ArmyService
	) {}

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean {
		const isAuth = this.authService.getIsAuth()
		if (!isAuth) {
			this.router.navigate(['/login'])
		}
		return isAuth
	}

}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
	return inject(PermissionsService).canActivate(next, state)
}


