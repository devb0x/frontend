import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {NgForm, FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

import {environment} from "../../../environments/environment";

import {SpinnerComponent} from "../../layout/spinner/spinner.component";

const BACKEND_URL = `${environment.apiUrl}/user/`

@Component({
	selector: 'app-reset-password',
	standalone: true,
	imports: [
		NgIf,
		FormsModule,
		SpinnerComponent
	],
	templateUrl: './reset-password.component.html',
	styleUrls: [
		'../auth.styles.css'
	]})
export class ResetPasswordComponent {
	isLoading: boolean = false
	formSubmitted: boolean = false

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private http: HttpClient
	) {}

	ngOnInit() {
		const token = this.route.snapshot.paramMap.get('token');

		if (token) {
			console.log(token)
		}
	}

	onSubmit(resetPasswordForm: NgForm) {
		this.isLoading = true

		const token = this.route.snapshot.paramMap.get('token');
		const password = resetPasswordForm.value.password

		this.http
			.put(BACKEND_URL + `updateUserPassword`, { token, password })
			.subscribe(() => {
				setTimeout(()=> {
					resetPasswordForm.reset()
					this.isLoading = false
					this.formSubmitted = true

					setTimeout(() => {
						this.router.navigate(['/login']).then(() => {})
					}, 2000)
				}, 200)
			})
	}
}
