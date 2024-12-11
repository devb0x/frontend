import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	ViewChild
} from '@angular/core'
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { CommonModule } from '@angular/common'
import { environment } from "../../../../../environments/environment"

const BACKEND_URL = `${environment.apiUrl}/`

interface UploadResponse {
	message: string
	data: Picture[]
}

interface Picture {
	_id: string
	ownerId: string
	armyId: string
	fileName: string
	fileUrl: string
	uploadDate: Date
}

@Component({
	selector: 'app-image-upload',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './image-upload.component.html',
	styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent {
	@ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
	@Output() fileUploaded = new EventEmitter<Picture[]>() // Emit the array of new miniatures
	@Input() armyId!: string
	@Input() miniatureId!: string
	@Input() stepNumber!: number
	@Input() actionType!: string

	selectedFiles: File[] = []

	constructor(private http: HttpClient) {}

	onFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement
		if (input.files && input.files.length > 0) {
			Array.from(input.files).forEach(file => this.selectedFiles.push(file));
		}
	}

	resetFileInput(): void {
		if (this.fileInput) {
			this.fileInput.nativeElement.value = ''; // Reset the value of the file input
		}
	}
	uploadFile(): void {
		if (this.actionType === 'miniature') {
			this.uploadFileToMiniature()
		} else if (this.actionType === 'army') {
			this.uploadFileToArmy()
		} else {
			console.error('Unknown action type')
		}
	}

	uploadFileToArmy(): void {
		const token = localStorage.getItem("token")
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

		if (this.selectedFiles.length > 0) {
			console.log(this.selectedFiles)
			const formData = new FormData();
			this.selectedFiles.forEach(file => {
				formData.append('files', file, file.name); // Append each file to the form data
			});
			formData.append('armyId', this.armyId)

			this.http.post<UploadResponse>(BACKEND_URL + `upload`, formData, { headers })
				.subscribe(
					response => {
						console.log('File uploaded ended', response)
						if (response.data && response.data.length > 0) {
							this.fileUploaded.emit(response.data)
						}
						this.selectedFiles = []
						this.resetFileInput()
					},
					error => console.error('File upload failed', error)
				)
		}
	}

	uploadFileToMiniature(): void {
		const token = localStorage.getItem("token")
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

		if (this.selectedFiles.length > 0) {
			const formData = new FormData();
			this.selectedFiles.forEach(file => {
				formData.append('files', file, file.name); // Append each file to the form data
			});
			formData.append('armyId', this.armyId)
			formData.append('miniatureId', this.miniatureId)
			formData.append('stepNumber', this.stepNumber.toString())

			this.http.post<UploadResponse>(BACKEND_URL + `uploadToMiniature`, formData, { headers })
				.subscribe(
					response => {
						console.log('Miniature file uploaded ended', response)
						if (response.data && response.data.length > 0) {
							this.fileUploaded.emit(response.data)
						}
						this.selectedFiles = []
						this.resetFileInput()
					},
					error => console.error('File upload failed', error)
				)
		}
	}

}
