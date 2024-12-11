import { Injectable } from "@angular/core"
import {ActivatedRouteSnapshot, Resolve} from "@angular/router"

import { Observable } from "rxjs"

import { ArmyService } from "../pages/dashboard/army-list/army.service"

@Injectable({ providedIn: 'root' })
export class MiniatureResolver implements Resolve<any> {
	constructor(private armyService: ArmyService) {}

	resolve(route: ActivatedRouteSnapshot): Observable<any> {
		const armyId = route.paramMap.get('armyId')!
		const miniatureId = route.paramMap.get('miniatureId')!

		return this.armyService.getMiniature(armyId, miniatureId)
	}
}