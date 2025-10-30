import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Router } from "@angular/router"

import { Observable } from "rxjs"

import { ToastService } from "./toast.service"

import { environment } from "../../environments/environment"

const BACKEND_URL = `${environment.apiUrl}`

@Injectable({
	providedIn: 'root'
})

export class PaintGuideService {
	constructor(private http: HttpClient) {}

	getPaintGuide(id: string): Observable<any> {
		if (!id) {
			throw new Error("Paint Guide Id is required")
		}

		return this.http.get<any>(
			BACKEND_URL + `/paint-guide/${id}`
		)
	}

	getAllPaintGuides(): Observable<any> {
		return this.http.get<any>(
			BACKEND_URL + `/paint-guide/all`
		)
	}

	getUserPaintGuide(ownerId: string): Observable<any> {
		if (!ownerId) {
			throw new Error("UserId is required")
		}

		const token = localStorage.getItem("token")
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

		return this.http.get<any>(
			BACKEND_URL + `/paint-guide/owner?ownerId=${ownerId}`,
			{ headers }
		)
	}

	updatePaintGuide(paintGuideId: string, paintGuideData: any, files: File[], removedPictures: { pictureId: string, filename: string }[]): Observable<any> {
		const formData = new FormData();
		formData.append("paintGuideData", JSON.stringify(paintGuideData));
		formData.append("removedPictures", JSON.stringify(removedPictures));

		files.forEach((file) => {
			formData.append('pictures', file);  // Same field name as expected in Multer
		});

		const token = localStorage.getItem("token");
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

		return this.http.put<any>(
			BACKEND_URL + `/paint-guide/update/${paintGuideId}`,
			formData,
			{ headers }
		);
	}

	deletePaintGuide(paintGuideId: string) {
		const token = localStorage.getItem("token")
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

		return this.http.delete<any>(
			BACKEND_URL + `/paint-guide/delete/${paintGuideId}`,
			{ headers }
		)
	}

	deletePaintGuideAndNavigate(paintGuideId: string, toastService: ToastService, router: Router) {
		this.deletePaintGuide(paintGuideId)
			.subscribe(
				(response) => {
					console.log('Delete successful', response);
					toastService.showSuccess("Paint Guide successfully deleted!");
					router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
						return router.navigate([`/dashboard`]);
					});
				},
				(error) => {
					console.log('Error deleting paint guide', error);
					toastService.showError("Error deleting the paint guide.");
				}
			);
	}
}