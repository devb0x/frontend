import {Component, EventEmitter, Input, Output} from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import {HttpClient, HttpHeaders} from "@angular/common/http"
import {environment} from "../../../../environments/environment";
import {MiniatureInterface} from "../../../models/miniature.interface";

const BACKEND_URL = `${environment.apiUrl}/army/`

@Component({
	selector: 'app-new-miniature',
	standalone: true,
	imports: [
		ReactiveFormsModule,
	],
	templateUrl: './new-miniature.component.html',
	styleUrl: './new-miniature.component.css'
})
export class NewMiniatureComponent {
	@Input() armyId!: string
	@Output() miniatureAdded = new EventEmitter<void>()
	miniatureForm!: FormGroup

	constructor(private http: HttpClient) {}

	ngOnInit(): void {
		this.miniatureForm = new FormGroup({
			name: new FormControl(
				null, {
					updateOn: 'change',
					validators: [
						Validators.required,
						Validators.minLength(3)
					]
				})
		})
	}

	newMiniatureSubmit() {
		if (this.miniatureForm.valid) {
			const miniatureData = this.miniatureForm.value
			this.addMiniatureToTheArmy(miniatureData.name)
		} else {
			console.log('form invalid')
		}
	}

	addMiniatureToTheArmy(miniatureName: string) {
		const armyId = this.armyId

		const newMiniature: MiniatureInterface = {
			name: miniatureName,
			steps: [],
			// paintsUsed: []
		}

		const token = localStorage.getItem("token")
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)


		this.http
			.put(
				BACKEND_URL + `edit/add-miniature/${armyId}`,
				newMiniature ,
				{ headers }
			)
			.subscribe(
				(response) => {
					console.log('Miniature added ', response)
					this.miniatureForm.reset()
					this.miniatureAdded.emit()
				},
				(error) => {
					console.log(error)
				}
			)
	}
}
