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
	uploadText: string = 'Add picture'
	selectedPaints: PaintInterface[] = []
	isStepValid: boolean = false

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

	previousStepValide() {
		let stepIndex = this.guideForm.value.steps.length - 1
		console.log(stepIndex)
		if (this.guideForm.value.steps[stepIndex].stepDescription !== '' || undefined) {
			this.isStepValid = false
		} else (
			this.isStepValid = true
		)
	}

	addStep(): void {
		if (this.isStepValid) {
			const stepForm = this.fb.group({
				stepDescription: ['', Validators.required],
				pictures: this.fb.array([]),
			});
			this.steps.push(stepForm);

			// Start listening to the new step's description changes
			const lastStep = this.steps.at(this.steps.length - 1) as FormGroup;
			lastStep.get('stepDescription')?.valueChanges.subscribe((value) => {
				this.isStepValid = value.trim() !== ''; // Update validity based on input
			});

			this.isStepValid = false
		}
	}

	onStepDescriptionChange(index: number): void {
		const step = this.guideForm.get(`steps.${index}`) as FormGroup;
		if (step) {
			const description = step.get('stepDescription')?.value;
			this.isStepValid = !!(description && description.trim() !== '');
		}
	}

	onFileSelected(event: Event, stepIndex: number): void {
		const input = event.target as HTMLInputElement;

		if (!input.files || input.files.length === 0) return;

		const selectedFiles = Array.from(input.files);

		// Get all existing filenames from all steps
		const allExistingFileNames: string[] = this.steps.controls
			.flatMap(step => (step.get('pictures') as FormArray).value.map((pic: any) => pic.fileName));

		// Filter out duplicate files across ALL steps
		const newFiles = selectedFiles.filter(file => !allExistingFileNames.includes(file.name));

		if (newFiles.length < selectedFiles.length) {
			this.toastService.showError('Some files were skipped because they have duplicate names.');
		}

		// Process only new files
		const step = this.steps.at(stepIndex) as FormGroup;
		const picturesArray = step.get('pictures') as FormArray;

		newFiles.forEach((file) => {
			const reader = new FileReader();
			reader.onload = () => {
				picturesArray.push(
					this.fb.group({
						file, // Store the actual file
						previewUrl: reader.result, // Store the generated preview URL
						fileUrl: '', // Keep the structure consistent with existing pictures
						fileName: file.name // Store the file name
					})
				);
			};
			reader.readAsDataURL(file); // Generate the preview URL
		});

		input.value = ''; // Reset the input field
	}

	removePicture(stepIndex: number, pictureIndex: number): void {
		const step = this.steps.at(stepIndex) as FormGroup;
		const picturesArray = step.get('pictures') as FormArray;

		if (picturesArray) {
			picturesArray.removeAt(pictureIndex); // Remove the picture at the specified index
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
			}))
			.filter((step: any) => step.stepDescription && step.stepDescription.trim() !== '')
				.map((step: any, index: number) => ({
					...step,
					number: index + 1 // Reassign the numbers after filtering
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
						console.error(error)
						this.toastService.showError("Something went wrong. Please try again.");
					}
			)
	}
}
