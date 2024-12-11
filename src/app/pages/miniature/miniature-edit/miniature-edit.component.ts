import {Component, EventEmitter, Output} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import { NgFor, NgIf } from "@angular/common"
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { environment } from "../../../../environments/environment"

import { MiniatureInterface } from "../../../models/miniature.interface"
import { ArmyInterface } from "../../../models/army.interface"
import {ImageUploadComponent} from "../../army/army-edit/image-upload/image-upload.component";
import {DividerComponent} from "../../../layout/divider/divider.component";

const BACKEND_URL = `${environment.apiUrl}/army/`

interface UploadResponse {
	message: string
	data: Picture[]
}

interface Picture {
	_id: string
	ownerId: string
	armyId: string
	miniatureId: string
	fileName: string
	fileUrl: string
	uploadDate: Date
}

@Component({
	selector: 'app-miniature-edit',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		NgIf,
		NgFor,
		ImageUploadComponent,
		RouterLink,
		DividerComponent
	],
	templateUrl: './miniature-edit.component.html',
	styleUrl: '../miniature.component.css'
})
export class MiniatureEditComponent {
	@Output() fileUploaded = new EventEmitter<Picture[]>()

	miniature!: MiniatureInterface
	army!: ArmyInterface
	currentStep!: number

	stepForm!: FormGroup
	displayForm: boolean = false
	displayImageUpload: boolean = false

	constructor(
		public route: ActivatedRoute,
		private router: Router,
		private formBuilder: FormBuilder,
		private http: HttpClient
	) {
		this.stepForm = this.formBuilder.group({
			number: 0,
			title: '',
			description: '',
			paintsUsed: [],
			pictures: []
		})
	}

	ngOnInit() {
		this.route.data.subscribe(data => {
			this.miniature = data['miniatureData']
			this.army = data['armyData']
		})
		console.log(this.miniature)
	}

	displayFormStep() {
		this.displayForm = true
	}

	formStepSubmit() {
		const token = localStorage.getItem("token")
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

		// Fetch the latest miniature data manually
		this.refreshMiniatureData().then(() => {
			const stepNumber = this.miniature.steps.length + 1
			this.stepForm.patchValue({ number: this.miniature.steps.length + 1 })
			const stepData = this.stepForm.value
			// console.log('stepForm value: ', this.stepForm.value)

			this.http
				.post(
					BACKEND_URL + `${this.army._id}/miniature/edit/${this.miniature._id}`,
					stepData,
					{ headers }
				)
				.subscribe(
					response => {
						console.log('Miniature steps added', response)
						this.stepForm.reset()
						this.refreshMiniatureData().then(() => {
							this.currentStep = stepNumber
							this.displayForm = false
						}) // Fetch data again after the step is added
					},
					error => {
						console.error('Error adding step:', error)
					}
				)
		})
	}

	refreshMiniatureData() {
		return new Promise<void>((resolve, reject) => {
			this.http.get<any>(BACKEND_URL + `${this.army._id}/miniature/${this.miniature._id}`)
				.subscribe(
					data => {
						this.miniature = data
						console.log('Miniature data refreshed manually')
						resolve()
					},
					error => {
						console.error('Error refreshing miniature data:', error)
						reject(error)
					}
				)
		})
	}

	backToMiniaturePage() {
		return this.router.navigate([`/army/${this.army._id}/miniature/${this.miniature._id}`])
	}

	setAsThumbnail(pictureId: any, armyId: string, miniatureId: any) {
		console.log('pictureId: ',pictureId)
		console.log('armyID: ',armyId)
		console.log('miniatureId: ',miniatureId)
		const thumbnail: string = miniatureId
		//
		const token = localStorage.getItem("token")
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
		//
		this.http
			.put(
				BACKEND_URL + `${this.army._id}/miniature/update-thumbnail/${this.miniature._id}`,
				{ pictureId, armyId, miniatureId },
				{ headers }
			)
			.subscribe(
				response => {
					console.log('Set as thumbnail success', response)
				},
				error => {
					console.log(error)
				}
			)
	}

}
