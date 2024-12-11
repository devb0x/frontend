import { Component } from '@angular/core'
import { NgIf } from "@angular/common"
import {FormsModule, NgForm} from "@angular/forms"

import {AuthService} from "../auth.service";
import {Subscription} from "rxjs";
import {RouterLink} from "@angular/router";

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [
		NgIf,
		FormsModule,
		RouterLink
	],
	templateUrl: './login.component.html',
	styleUrls: ['../auth.styles.css']
})
export class LoginComponent {
	isLoading = false
	private authStatusSub!: Subscription

	constructor(public authService: AuthService) {}

	ngOnInit() {
		this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
			authStatus => {
				this.isLoading = false
			}
		)
	}

	onLogin(form: NgForm) {
		if (form.invalid) {
			return
		}
		this.isLoading = true
		this.authService.login(form.value.email, form.value.password)
	}
}
