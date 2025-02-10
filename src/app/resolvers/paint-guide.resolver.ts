import { Injectable } from "@angular/core"
import { PaintGuideService } from "../services/paint-guide.service"
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from "@angular/router";
import {Observable, of, tap} from "rxjs";
import {PaintGuideInterface} from "../models/paint-guide.interface";
import {catchError} from "rxjs/operators";

@Injectable({
	providedIn: 'root'
})

export class PaintGuideResolver implements Resolve<PaintGuideInterface | null>{
	constructor(private paintGuideService: PaintGuideService, private router: Router) {}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PaintGuideInterface | null> {
		const paintGuideId = route.paramMap.get('paintGuideId')
		if(!paintGuideId) {
			return of(null)
		}
		return this.paintGuideService.getPaintGuide(paintGuideId).pipe(
			tap((paintGuide) => {
				if (!paintGuide) {
					this.router.navigate(['/404']); // Redirect if API returns null
				}
			}),
			catchError((error) => {
				console.error('Error fetching paint guide:', error);
				this.router.navigate(['/404']); // Redirect on error
				return of(null);
			})
		);
	}

}