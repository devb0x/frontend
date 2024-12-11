import { Component } from '@angular/core'
import { NgIf } from "@angular/common"
import { HttpClient } from "@angular/common/http"
import { ActivatedRoute, Router } from "@angular/router"

import { SpinnerComponent } from "../../layout/spinner/spinner.component"

@Component({
	selector: 'app-confirm-registration',
	standalone: true,
	imports: [
		NgIf,
		SpinnerComponent
	],
	templateUrl: './confirm-registration.component.html',
	styleUrls: ['../auth.styles.css']
})
export class ConfirmRegistrationComponent {
	// http://localhost:3000/api/user/confirmAccount/${token}
	isLoading = true
	confirmationMessage: string = '';


	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private http: HttpClient
	) {}

	ngOnInit() {
		const token = this.route.snapshot.paramMap.get('token');

		if (token) {
			this.http.get(`http://localhost:3000/api/user/confirmAccount/${token}`)
				.subscribe({
					next: (response: any) => {
						if (response && response.message === 'Account verified successfully.') {
							this.confirmationMessage = 'Your account has been verified! Redirecting..';
							this.isLoading = false
							setTimeout(() => {
								return this.router.navigate(['/login'])
							}, 3000)
						} else {
							this.confirmationMessage = 'Verification failed or link expired.';
							this.isLoading = false
						}
					},
					error: () => {
						this.confirmationMessage = 'Verification failed or link expired.';
						this.isLoading = false
					}
				});
		}
	}
}
