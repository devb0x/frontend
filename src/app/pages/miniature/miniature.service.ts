import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, BehaviorSubject, map, forkJoin} from 'rxjs';
import { ArmyInterface } from '../../models/army.interface';
import { MiniatureInterface } from '../../models/miniature.interface';
import { environment } from '../../../environments/environment';
import {PictureInterface} from "../../models/picture.interface";

const BACKEND_URL = `${environment.apiUrl}/army/`;

@Injectable({
	providedIn: 'root'
})
export class MiniatureService {
	private miniatureSubject = new BehaviorSubject<MiniatureInterface | null>(null);

	constructor(private http: HttpClient) {}

	getMiniatureData(armyId: string, miniatureId: string): Observable<MiniatureInterface> {
		return this.http.get<ArmyInterface>(BACKEND_URL + armyId).pipe(
			map(army => army.miniatures.find(mini => mini._id === miniatureId)!)
		);
	}

	setMiniatureData(miniature: MiniatureInterface) {
		this.miniatureSubject.next(miniature);
	}

	getMiniatureObservable(): Observable<MiniatureInterface | null> {
		return this.miniatureSubject.asObservable();
	}

	getPicturesByIds(pictureIds: string[]): Observable<PictureInterface[]> {
		const requests = pictureIds.map(id => this.http.get<PictureInterface>(`${BACKEND_URL}/pictures/${id}`));
		return forkJoin(requests);
	}

}
