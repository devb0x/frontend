import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {ArmyService} from "../pages/dashboard/army-list/army.service";
import {ArmyInterface} from "../models/army.interface";

@Injectable({
	providedIn: 'root'
})
export class ArmyResolver implements Resolve<ArmyInterface | null> {
	constructor(private armyService: ArmyService) {}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ArmyInterface | null> {
		const armyId = route.paramMap.get('armyId');
		if (!armyId) {
			return of(null); // Return observable of null if armyId is not provided
		}
		return this.armyService.getArmy(armyId).pipe(
			catchError(error => {
				console.error('Error fetching army data:', error);
				return of(null); // Return observable of null in case of error
			})
		);
	}
}
