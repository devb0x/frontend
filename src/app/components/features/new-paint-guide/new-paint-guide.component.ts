import { Component } from '@angular/core'
import { NgIf, NgFor } from "@angular/common"
import { Router, RouterLink } from "@angular/router"
import {
	FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators
} from "@angular/forms"

import { ImageUploadComponent } from "../../../pages/army/army-edit/image-upload/image-upload.component"
import { PaintSelectComponent } from "../paint-select/paint-select.component"

import { DashboardService } from "../../../pages/dashboard/dashboard.service"
import { ToastService } from "../../../services/toast.service"

import { PaintInterface } from "../../../models/paint.interface"

interface PaintGuideResponse {
	message?: string;
	paintGuide?: any; // You can replace `any` with a more specific type
	uploadError?: boolean; // 👈 Optional property
}

@Component({
	selector: 'app-new-paint-guide',
	standalone: true,
	imports: [
		NgIf,
		NgFor,
		RouterLink,
		ReactiveFormsModule,
		ImageUploadComponent,
		PaintSelectComponent
	],
	templateUrl: './new-paint-guide.component.html',
	styleUrl: './new-paint-guide.component.css'
})

export class NewPaintGuideComponent {
	guideForm!: FormGroup
	uploadText: string = 'Add picture';
	selectedPaints: PaintInterface[] = []


	constructor(
		private fb: FormBuilder,
		private dashboardService: DashboardService,
		private toastService: ToastService,
		private router: Router
	) {}

	ngOnInit() {
		this.guideForm = this.fb.group({
			title: ['', Validators.required],
			steps: this.fb.array([
				this.fb.group({
					stepDescription: ['', Validators.required],
					pictures: this.fb.array([]),
				})
			])
		})
	}

	get steps(): FormArray {
		return this.guideForm.get('steps') as FormArray; // Getter for convenience
	}

	getPictureControls(stepIndex: number): FormArray {
		return this.steps.at(stepIndex).get('pictures') as FormArray;
	}

	addStep(): void {
		const stepForm = this.fb.group({
			stepDescription: ['', Validators.required],
			pictures: this.fb.array([])
		});
		this.steps.push(stepForm); // Add new step to FormArray
	}

	onFileSelected(event: Event, stepIndex: number): void {
		const input = event.target as HTMLInputElement;
		const step = this.steps.at(stepIndex) as FormGroup;

		if (input.files) {
			const picturesArray = step.get('pictures') as FormArray;

			Array.from(input.files).forEach((file) => {
				const reader = new FileReader();
				reader.onload = () => {
					picturesArray.push(
						this.fb.control({
							file, // Store the actual file
							previewUrl: reader.result, // Store the generated preview URL
						})
					);
				};
				reader.readAsDataURL(file); // Generate the preview URL
			});

			input.value = ''; // Reset the input field
		}
	}

	removePicture(stepIndex: number, pictureIndex: number): void {
		const step = this.steps.at(stepIndex) as FormGroup;
		const picturesArray = step.get('pictures') as FormArray;

		if (picturesArray) {
			picturesArray.removeAt(pictureIndex); // Remove the picture at the specified index
			console.log(`Removed picture at index ${pictureIndex} from step ${stepIndex}`);
		}
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

	formSubmit() {
		const processedData = {
			title: this.guideForm.value.title,
			steps: this.guideForm.value.steps.map((step: any, index: number) => ({
				number: index + 1,
				stepDescription: step.stepDescription,
				pictures: step.pictures.map((picture: any) => ({
					fileName: picture.file.name,  // Send only the file names here
				})),
			})),
			paintsUsed: this.selectedPaints
		};

		// Extract the files to upload
		const filesToUpload: File[] = [];
		this.guideForm.value.steps.forEach((step: any) => {
			step.pictures.forEach((picture: any) => {
				if (picture.file) {
					filesToUpload.push(picture.file);
				}
			});
		});

		this.dashboardService
			.createNewPaintGuide(processedData, filesToUpload)
			.subscribe(
					(response: PaintGuideResponse) => {
						if (response.uploadError) {
							this.guideForm.reset()
							this.router.navigate(['/dashboard']).then(() => {
								this.toastService.showError("Paint guide created, but picture upload failed.");
							})
						} else {
							this.guideForm.reset()
							this.router.navigate(['/dashboard']).then(() => {
								this.toastService.showSuccess("Paint guide created successfully!");
							})
						}
					},
					(error) => {
						console.log(error)
						this.toastService.showError("Something went wrong. Please try again.");
					}
			)
	}





}
