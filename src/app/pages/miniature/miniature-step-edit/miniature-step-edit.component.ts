import {Component, EventEmitter, Output} from '@angular/core';
import {NgFor, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";

import {MiniatureInterface} from "../../../models/miniature.interface";
import {ArmyInterface} from "../../../models/army.interface";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

import {ImageUploadComponent} from "../../army/army-edit/image-upload/image-upload.component";
import {ConfirmationModalComponent} from "../../../layout/confirmation-modal/confirmation-modal.component";
import {PaintSelectComponent} from "../../../components/features/paint-select/paint-select.component";
import {PaintInterface} from "../../../models/paint.interface";

const BACKEND_URL = `${environment.apiUrl}/army/`

@Component({
	selector: 'app-miniature-step-edit',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		ImageUploadComponent,
		ConfirmationModalComponent,
		PaintSelectComponent,
		NgIf,
		NgFor
	],
	templateUrl: './miniature-step-edit.component.html',
	styleUrls: [
		'../miniature.component.css',
		'./miniature-step-edit.component.css'
	]
})
export class MiniatureStepEditComponent {
	miniature!: MiniatureInterface
	army!: ArmyInterface
	stepForm!: FormGroup
	stepIndex!: number
	stepNumber!: number
	pictureIdToDelete: string | null = null
	selectedPaints: PaintInterface[] = []

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		private http: HttpClient,
	) {}

	ngOnInit() {
		this.route.data.subscribe(data => {
			this.miniature = data['miniatureData']
			this.army = data['armyData']
		})
		this.route.params.subscribe(params => {
			this.stepIndex = +this.route.snapshot.params['stepNumber'] - 1
			this.stepNumber = +this.route.snapshot.params['stepNumber']

			if (this.stepIndex < this.miniature.steps.length) {
				this.stepForm = this.formBuilder.group({
					number: this.stepNumber,
					title: this.miniature.steps[this.stepIndex].title,
					description: this.miniature.steps[this.stepIndex].description,
					// paintsUsed: this.selectedPaints,
					// paintsUsed: this.miniature.steps[this.stepIndex].paintsUsed,
					// pictures: []
				})
				this.selectedPaints = this.miniature.steps[this.stepIndex].paintsUsed
			} else {
				this.router
					.navigate([`/army/${this.army._id}/miniature/edit/${this.miniature._id}`])
					.then(() => console.error('Invalid step number, redirecting..'))
			}
		})
		console.log('miniature = ', this.miniature)
	}

	handlePaintSelected(paint: PaintInterface) {
		const isPaintAlreadySelected = this.selectedPaints.some(
			(selectedPaint) => selectedPaint.type === paint.type &&
				selectedPaint.brand === paint.brand &&
				selectedPaint.name === paint.name
		)
		if (isPaintAlreadySelected) {
			console.log('paint exists already', paint)
			return
		}
		// Update the selectedPaints array
		this.selectedPaints.push(paint);
		console.log('Selected paints updated:', this.selectedPaints);
	}

	handlePaintRemoved(paint: { type: string; name: string }) {
		// Update the selectedPaints array by removing the paint
		this.selectedPaints = this.selectedPaints.filter(p => p.type !== paint.type || p.name !== paint.name);
		console.log('Selected paints updated after removal:', this.selectedPaints);
	}

	formStepSubmit() {
		const token = localStorage.getItem("token")
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

		const stepData = {
			...this.stepForm.value,
			paintsUsed: this.selectedPaints
		}

		console.log(stepData)

		this.http
			.put(
				BACKEND_URL + `${this.army._id}/miniature/edit/${this.miniature._id}/edit-step/${this.stepNumber}`,
				stepData,
				{ headers }
			)
			.subscribe(
				response => {
					console.log('Miniature steps edited', response)
					this.stepForm.reset()
					this.fetchData()
					 // Fetch data again after the step is added
				},
				error => {
					console.error('Error editing step:', error)
				}
			)
	}

	onCancel() {
		const miniatureId = this.route.snapshot.paramMap.get('miniatureId')
		const armyId = this.route.snapshot.paramMap.get('armyId')
		return this.router.navigate([`/army/${armyId}/miniature/edit/${miniatureId}`])
	}

	onDeleteCancel(): void {
		this.pictureIdToDelete = null;
	}

	showDeleteModal(pictureId: string): void {
		this.pictureIdToDelete = pictureId;
	}

	onDeleteConfirm(pictureId: string): void {
		this.onDeleteSubmit(pictureId)
	}

	onDeleteSubmit(pictureId: string) {
		const token = localStorage.getItem("token")
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

		const armyId = this.army._id;
		const miniatureId = this.miniature._id;

		this.http
			.delete(
				`${environment.apiUrl}/deleteFromMiniature/${armyId}/${miniatureId}/${this.stepIndex}/${pictureId}`,
				{ headers }
			)
			.subscribe(
				response => {
					console.log("Deletion from miniature success", response)
					this.pictureIdToDelete = null
					this.fetchData()
				},
				error => {
					console.log(error)
					this.pictureIdToDelete = null
				}
			)
	}

	fetchData() {
		const armyId = this.route.snapshot.paramMap.get('armyId')
		const miniatureId = this.route.snapshot.paramMap.get('miniatureId')

		if (armyId && miniatureId) {
			this.http.get<MiniatureInterface>(`${environment.apiUrl}/army/${armyId}/miniature/${miniatureId}`)
				.subscribe(data => {
					this.miniature = data;
					console.log('Data refreshed', this.miniature);
				}, error => {
					console.error('Error refreshing data', error);
				});
		}
	}

}
