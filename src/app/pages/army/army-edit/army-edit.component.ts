import { Component } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router"
import {ArmyInterface} from "../../../models/army.interface";
import {Location, NgIf, NgFor } from "@angular/common";
import {DropdownComponent} from "../../../layout/dropdown/dropdown.component";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {ImageUploadComponent} from "./image-upload/image-upload.component";
import {ConfirmationModalComponent} from "../../../layout/confirmation-modal/confirmation-modal.component";
import {NewMiniatureComponent} from "../../miniature/new-miniature/new-miniature.component";
import {MiniatureInterface} from "../../../models/miniature.interface";
import {ToastService} from "../../../services/toast.service";


const BACKEND_URL = `${environment.apiUrl}/army/`

@Component({
	selector: 'app-army-edit',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		DropdownComponent,
		NgIf,
		NgFor,
		RouterLink,
		ImageUploadComponent,
		ConfirmationModalComponent,
		NewMiniatureComponent
	],
	templateUrl: './army-edit.component.html',
	styleUrl: '../army.component.css'
})
export class ArmyEditComponent {
	armyId!: string
	army$: ArmyInterface | null = null
	armyForm!: FormGroup

	selectedFile: File | null = null
	pictureIdToDelete: string | null = null

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private location: Location,
		private http: HttpClient,
		private formBuilder: FormBuilder,
		private toastService: ToastService
	) {
		this.armyForm = this.formBuilder.group({
			description: [''],
			lore: ['']
		});

	}

	ngOnInit(): void {
		this.route.data.subscribe(data => {
			this.army$ = data['armyData']; // Access resolved army data
			if (this.army$ && this.army$._id) {
				this.armyId = this.army$._id;

				this.armyForm.patchValue({
					description: this.army$.description || '',
					lore: this.army$.lore || ''
				})
			}
		});
		console.log(this.army$)
	}

	cancelEditHandler(): void {
		if (confirm('Are you sure you want to cancel the edit? Unsaved changes will be lost.')) {
			this.location.back();
		}
	}

	formSubmit() {
		const id = this.army$?._id
		const updatedData: any = {}

		if (!this.army$ || !this.army$._id) {
			console.error('Invalid army data');
			return;
		}
		const token = localStorage.getItem("token")
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

		if (this.armyForm.value.description) {
			updatedData.description = this.armyForm.value.description
		}
		if (this.armyForm.value.lore) {
			updatedData.lore = this.armyForm.value.lore
		}

		this.http
			.put(
				BACKEND_URL + `edit/${id}`,
				updatedData,
				{ headers }
			)
			.subscribe(
				(response) => {
					console.log(response)
					this.router.navigate([`army/${id}`])
					this.toastService.showSuccess('Army edited successfully!');
				},
				(error) => {
					console.log(error)
					this.toastService.showError('Failed to edit the army.');
				}
			)
	}

	onFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			this.selectedFile = input.files[0];
		}
	}

	fetchArmyData(): void {
		const id = this.army$?._id;

		if (!id) {
			return;
		}

		const token = localStorage.getItem('token');
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

		this.http.get<ArmyInterface>(`${BACKEND_URL}${id}`, { headers }).subscribe(
			response => {
				this.army$ = response;
			},
			error => {
				console.error('Error fetching army data', error);
			}
		);
	}

	onDeleteSubmit(pictureId: string): void {
		const token = localStorage.getItem("token")
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

		this.http
			.delete(
				`${environment.apiUrl}/delete/${pictureId}`,
				{ headers }
			)
			.subscribe(
				response => {
					console.log('Deletion success', response)
					if (this.army$) {
						const pictureToDelete = this.army$.pictures.find(picture => picture._id === pictureId)
						// if (pictureToDelete) {
						// 	if (pictureToDelete.fileUrl === this.army$.thumbnailUrl) {
						// 		console.log("same url")
						// 		this.army$.thumbnailUrl = ""
						// 		this.setAsThumbnail(this.army$._id, "")
						// 	}
						// }

						this.army$.pictures = this.army$.pictures
							.filter(picture => picture._id !== pictureId)

						this.army$ = { ...this.army$ }
					}
				},
				error => {
					console.log(error)
					this.pictureIdToDelete = null
				}
			)
		this.pictureIdToDelete = null
	}

	showDeleteModal(pictureId: string): void {
		this.pictureIdToDelete = pictureId;
	}

	onDeleteCancel(): void {
		this.pictureIdToDelete = null;
	}

	onDeleteConfirm(pictureId: string): void {
		this.onDeleteSubmit(pictureId)
	}

	// unused function (was display 'undefined' instead of the image picture
	handleFileUpload(newMiniatures: any[]): void {
		if (this.army$) {
			// this.army$.miniatures.push(...newMiniatures)
			this.army$.pictures = [...this.army$.pictures, ...newMiniatures]
			// this.cdr.detectChanges()
		}
	}

	setAsThumbnail(miniatureId: any, armyId: string) {
		const thumbnail: string = miniatureId

		const token = localStorage.getItem("token")
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

		this.http
			.put(
				BACKEND_URL + `edit/thumbnail/${armyId}`,
				{ thumbnail },
				{ headers }
			)
			.subscribe(
				response => {
					console.log('Set as thumbnail success', response)
					this.toastService.showSuccess('Image set !')
				},
				error => {
					console.log(error)
					this.toastService.showError('Something was wrong..')
				}
			)
	}

	onMiniatureAdded() {
		this.fetchArmyData()
	}
}
