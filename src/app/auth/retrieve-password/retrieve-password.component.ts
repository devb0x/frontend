import { Component } from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {NgIf} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {response} from "express";
import {SpinnerComponent} from "../../layout/spinner/spinner.component";

const BACKEND_URL = `${environment.apiUrl}/user/`

@Component({
	selector: 'app-retrieve-password',
	standalone: true,
	imports: [
		FormsModule,
		RouterLink,
		NgIf,
		SpinnerComponent
	],
	templateUrl: './retrieve-password.component.html',
	styleUrls: [
		'../auth.styles.css'
	]
})
export class RetrievePasswordComponent {
	isLoading: boolean = false
	formSubmitted: boolean = false
	emailEntered: string = ''

	constructor(
		private http: HttpClient,
		private router: Router
	) {}

	ngOnInit() {}

	onSubmit(form: NgForm) {
		this.isLoading = true

		const email = form.value.email
		this.emailEntered = email

		this.http
			.post(BACKEND_URL + `sendRetrievePasswordLink`, { email })
			.subscribe(() => {
					setTimeout(() => {
						form.resetForm()
						this.isLoading = false
						this.formSubmitted = true

						// Redirect to login page after a few seconds
						setTimeout(() => {
							this.router.navigate(['/login']).then (() => {});
						}, 2000); // Adjust the delay if needed
					}, 200)
			},
error => {
				console.error('Error sending reset password link:', error);
				setTimeout(() => {
					this.isLoading = false;
				}, 200)
			})
	}

}
