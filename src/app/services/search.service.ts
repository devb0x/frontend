import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

import {ArmyInterface} from "../models/army.interface";
import {MiniatureInterface} from "../models/miniature.interface";
import {UserInterface} from "../models/user.interface";

const BACKEND_URL = `${environment.apiUrl}`

@Injectable({
	providedIn: 'root'
})
export class SearchService {
	constructor(
		private http: HttpClient
	) {}

	searchArmies(name: string): Observable<ArmyInterface[]> {
		const params = new HttpParams().set('query', name)
		return this.http.get<ArmyInterface[]>(
			BACKEND_URL + '/army/search-armies',
			{ params }
		)
	}

	searchMiniatures(name: string): Observable<MiniatureInterface[]> {
		const params = new HttpParams().set('query', name)
		return this.http.get<MiniatureInterface[]>(
			BACKEND_URL + '/army/miniature/search-miniatures',
			{ params }
		)
	}

	searchUsers(name: string): Observable<UserInterface[]> {
		const params = new HttpParams().set('query', name)
		return this.http.get<UserInterface[]>(
			BACKEND_URL + '/user/search-users',
			{ params }
		)
	}
}