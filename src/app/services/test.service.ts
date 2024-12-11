import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({ providedIn: 'root' })
export class TestService {
	constructor(private http: HttpClient) {}

	fetchPost(): Observable<any> {
		return this.http.get<any>('https://jsonplaceholder.typicode.com/posts/1');
	}
}
