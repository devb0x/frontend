import { Component } from '@angular/core'
import { NgFor, NgIf } from "@angular/common"
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { ActivatedRoute, Router, RouterLink } from "@angular/router"

import { PaintGuideInterface } from "../../../models/paint-guide.interface"
import { PaintInterface } from "../../../models/paint.interface"

import { PaintGuideService } from "../../../services/paint-guide.service"
import { ToastService } from "../../../services/toast.service"

import { PaintSelectComponent } from "../../../components/features/paint-select/paint-select.component"

interface PaintGuideResponse {
	message?: string
	paintGuide?: PaintGuideInterface
	uploadError?: boolean
}

@Component({
	selector: 'app-paint-guide-edit',
	standalone: true,
	imports: [
		NgIf,
		NgFor,
		PaintSelectComponent,
		ReactiveFormsModule,
		RouterLink
	],
	templateUrl: './paint-guide-edit.component.html',
	styleUrls: [
		'./paint-guide-edit.component.css',
		'../../../components/features/new-paint-guide/new-paint-guide.component.css'
	]
})
export class PaintGuideEditComponent {
	paintGuideId!: string
	paintGuide$: PaintGuideInterface | null = null
	guideForm!: FormGroup
	uploadText: string = 'Add picture';

	selectedPaints: PaintInterface[] = []
	removedPictures: { pictureId: string, filename: string }[] = [];

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private toastService: ToastService,
		private paintGuideService: PaintGuideService
	) {
		this.guideForm = this.fb.group({
			title: [''],
			steps: this.fb.array([
				this.fb.group({
					stepDescription: ['', Validators.required],
					pictures: this.fb.array([]),
					paintsUsed: []
				})
			])
		})
	}

	ngOnInit(): void {
		this.route.data.subscribe(data => {
			this.paintGuide$ = data['paintGuideData'];
			console.log(this.paintGuide$)
			if (this.paintGuide$ && this.paintGuide$._id) {
				this.paintGuideId = this.paintGuide$._id
				this.guideForm.patchValue({
					title: this.paintGuide$.title || '',
				});

				// Clear existing steps
				this.steps.clear();

				// Populate steps dynamically
				this.paintGuide$.steps.forEach(step => {
					// Ensure a FormArray is created for each step's pictures
					const picturesArray = step.pictures ? step.pictures.map(pic => this.fb.group({
						fileUrl: [pic.fileUrl || ''],
						fileName: [pic.fileName || ''],
						_id: [pic._id]
					})) : [];

					this.steps.push(this.fb.group({
						stepDescription: [step.stepDescription || '', Validators.required],
						pictures: this.fb.array(picturesArray),
					}));
				});

				// Ensure paintsUsed exists and is an array
				if (Array.isArray(this.paintGuide$.paintsUsed)) {
					// If it's a nested array, extract the first element
					let data = this.paintGuide$.paintsUsed.flat(); // Flatten any unnecessary array nesting

					// If data contains a JSON string, parse it
					if (typeof data[0] === 'string') {
						try {
							this.selectedPaints = JSON.parse(data[0]) as PaintInterface[];
						} catch (error) {
							console.error("Error parsing JSON in paintsUsed:", error);
							this.selectedPaints = [];
						}
					} else {
						this.selectedPaints = data as PaintInterface[]; // If it's already an array, assign it directly
					}
				} else {
					this.selectedPaints = [];
				}
			}
		});

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


	getPicturesArray(stepIndex: number): FormArray {
		return this.steps.at(stepIndex).get('pictures') as FormArray;
	}

	handlePaintSelected(paint: PaintInterface) {
		const isPaintAlreadySelected = this.selectedPaints.some(
			(selectedPaint) => selectedPaint.type === paint.type &&
				selectedPaint.brand === paint.brand &&
				selectedPaint.name === paint.name
		)
		if (isPaintAlreadySelected) {
			return
		}
		// Update the selectedPaints array
		this.selectedPaints.push(paint);
	}

	handlePaintRemoved(paint: PaintInterface) {
		// Update the selectedPaints array by removing the paint
		this.selectedPaints = this.selectedPaints.filter((p: PaintInterface) => p.type !== paint.type || p.name !== paint.name);
	}

	removeRemovedPictures(steps: any[]): any[] {
		return steps.map((step: any) => ({
			...step,
			pictures: step.pictures.filter((picture: any) => !this.removedPictures.includes(picture._id || picture.fileName))
		}));
	}


	formSubmit() {
		// Remove the pictures marked for deletion from the steps data
		const stepsWithoutRemovedPictures = this.removeRemovedPictures(this.guideForm.value.steps);
		console.log(stepsWithoutRemovedPictures)

		const processedData = {
			title: this.guideForm.value.title,
			steps: stepsWithoutRemovedPictures.map((step: any, index: number) => ({
				number: index + 1,
				stepDescription: step.stepDescription,
				pictures: step.pictures.map((picture: any) => ({
					fileName: picture.file?.name || picture.fileUrl,  // Handle new files & existing ones
				})),
			})),
			paintsUsed: this.selectedPaints
		};

		const filesToUpload: File[] = [];
		this.guideForm.value.steps.forEach((step: any) => {
			step.pictures.forEach((picture: any) => {
				if (picture.file instanceof File) {
					filesToUpload.push(picture.file);
				}
			});
		});

		this.paintGuideService
			.updatePaintGuide(this.paintGuideId, processedData, filesToUpload, this.removedPictures)
			.subscribe((response: PaintGuideResponse) => {
					if (response.uploadError) {
						this.router.navigate(['/dashboard']).then(() => {
							this.toastService.showError("Paint guide updated, but picture upload failed.");
						});
					} else {
						this.router.navigate(['/dashboard']).then(() => {
							this.toastService.showSuccess("Paint guide updated successfully!.");
						});
					}
				},
				(error) => {
					console.error(error);
					if (error.status === 400) {
						this.toastService.showError("Some Files are identical!");
					} else {
						this.toastService.showError("Something went wrong. Please try again.");
					}
				});
	}

	removePicture(stepIndex: number, pictureIndex: number, pictureId: string, filename: string): void {
		const picturesArray = this.getPicturesArray(stepIndex);

		if (pictureId) {
			this.removedPictures.push({ pictureId, filename }); // Keep track of both ID and filename
		}

		picturesArray.removeAt(pictureIndex);
	}



}
