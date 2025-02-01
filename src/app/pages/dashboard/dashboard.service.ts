import { Injectable } from "@angular/core"
import { Router } from "@angular/router"
import { HttpClient, HttpHeaders } from "@angular/common/http"

import { environment } from "../../../environments/environment"
import {PaintGuideInterface} from "../../models/paint-guide.interface";
import {PaintInterface} from "../../models/paint.interface";

const BACKEND_URL = `${environment.apiUrl}`

@Injectable({ providedIn: 'root'})
export class DashboardService {

	constructor(private http: HttpClient, private router: Router) {}

	getUserInformation() {
		const userId = localStorage.getItem("userId")
		const token = localStorage.getItem("token")

		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

		return this.http
			.get<any>(
				BACKEND_URL + `/user/getUserInformation?id=${userId}`,
				{ headers }
			)
	}

	createNewArmy(category: string, subCategory: string, name: string) {
		const token = localStorage.getItem("token")
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

		const data = {
			category: category,
			subCategory: subCategory,
			name: name
		}
		return this.http
			.post(
				BACKEND_URL + `/army/new-army`, data, { headers }
			)
	}

	createNewPaintGuide(data: { paintsUsed: any[]; title: string; steps: any[] }, files: File[]) {
		const token = localStorage.getItem("token");
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

		const formData = new FormData();

		formData.append('title', data.title);
		formData.append('paintsUsed', JSON.stringify(data.paintsUsed));

		// Initialize an empty array for steps
		let stepsArray: any = [];

// Loop through each step in data.steps and append it to the stepsArray
		data.steps.forEach((step: any, index: number) => {
			// Push each step's data to the steps array
			stepsArray.push({
				stepDescription: step.stepDescription,
				number: step.number,
				pictures: step.pictures || [] // Make sure pictures are included (if any)
			});
		});

// Append the populated stepsArray to formData
		formData.append('steps', JSON.stringify(stepsArray));

		// Append files
		files.forEach(file => {
			formData.append('files', file, file.name);
		});

		return this.http.post(BACKEND_URL + '/paint-guide/new-paint-guide', formData, { headers });
	}

}