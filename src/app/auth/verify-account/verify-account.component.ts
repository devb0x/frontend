import { Component } from '@angular/core';
import {NgIf} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, RouterLink} from "@angular/router";

import {environment} from "../../../environments/environment";
import {SpinnerComponent} from "../../layout/spinner/spinner.component";
import {ToastService} from "../../services/toast.service";

const BACKEND_URL = `${environment.apiUrl}/user/`


@Component({
	selector: 'app-verify-account',
	standalone: true,
	imports: [
		NgIf,
		RouterLink,
		SpinnerComponent
	],
	templateUrl: './verify-account.component.html',
	styleUrls: ['../auth.styles.css']
})
export class VerifyAccountComponent {
	email: string | null = null
	linkSend: boolean = false
	isLoading: boolean = false

	constructor(
		private route: ActivatedRoute,
		private http: HttpClient,
		private toastService: ToastService
	) {}

	ngOnInit() {
		this.route.queryParams.subscribe(params => {
			this.email = params['email']
		})
	}

	sendLink() {
		this.isLoading = true
		this.http
			.post(`${BACKEND_URL}resend-verification`, { email: this.email })
			.subscribe(
			() => {
				this.linkSend = true
				this.isLoading = false
			},
			error => {
				console.error('Error resending verification link:', error)
				this.toastService.showError('Something wrong when sending the email.')
				setTimeout(() => {
					this.isLoading = false
				}, 3000)
			}
		);
	}
}
