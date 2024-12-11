import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";

const BACKEND_URL = `${environment.apiUrl}/army`

@Injectable({ providedIn: 'root'})
export class ArmyService {
	constructor(private http: HttpClient) {}

	getUserArmies(userId: string): Observable<any> {
		if (!userId) {
			throw new Error("user id is required")
		}

		const token = localStorage.getItem("token")
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

		return this.http.get<any>(
			BACKEND_URL + `/armies?userId=${userId}`,
			{ headers }
		)
	}

	getArmyByMemberNumber(memberNumber: string): Observable<any> {
		if (!memberNumber) {
			throw new Error("memberNumber is required")
		}

		return this.http.get<any>(
			BACKEND_URL + `/armies/${memberNumber}`
		)
	}

	getArmy(id: string): Observable<any> {
		if (!id) {
			throw new Error("army Id is required")
		}

		return this.http.get<any>(
			BACKEND_URL + `/${id}`
		)
	}

	getAllArmies(): Observable<any> {
		return this.http.get<any>(
			BACKEND_URL + `/all`
		)
	}

	getMiniature(armyId: string, miniatureId: string): Observable<any> {
		return this.http.get<any>(
			BACKEND_URL + `/${armyId}/miniature/${miniatureId}`
		)
	}

	deleteArmy(armyId: string): Observable<any> {
		console.log('delete army called in armyService', armyId)
		console.log('Full delete URL:', BACKEND_URL + `/delete/${armyId}`);

		const token = localStorage.getItem("token")
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

		return this.http.delete<any>(
			BACKEND_URL + `/delete/${armyId}`,
			{ headers }
		)
	}

	deleteMiniature(armyId: string, miniatureId: string): Observable<any> {
		const token = localStorage.getItem("token")
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

		return this.http.delete<any>(
			BACKEND_URL + `/delete/${armyId}/miniature/${miniatureId}`,
			{ headers }
		)
	}
}
