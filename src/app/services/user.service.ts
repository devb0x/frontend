import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

const BACKEND_URL = `${environment.apiUrl}/user`

@Injectable({ providedIn: 'root'})
export class UserService {
	constructor(private http: HttpClient) {}

	getUserIdByMemberNumber(memberNumber: string): Observable<any> {
		return this.http
			.get<any>(BACKEND_URL + `/getUserId/${memberNumber}`)
	}
}
