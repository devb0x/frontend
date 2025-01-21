import { Injectable, inject } from "@angular/core"
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router"

import {AuthService} from "./auth.service";

@Injectable({
	providedIn: 'root'
})
export class PermissionsService {
	constructor(
		private authService: AuthService,
		private router: Router,
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


