import { Component } from '@angular/core'
import { NgIf } from "@angular/common"
import {FormsModule, NgForm} from "@angular/forms"

import {AuthService} from "../auth.service";
import {Subscription} from "rxjs";
import {Router, RouterLink} from "@angular/router";

import { SpinnerComponent } from "../../layout/spinner/spinner.component"

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [
		NgIf,
		FormsModule,
		RouterLink,
		SpinnerComponent
	],
	templateUrl: './login.component.html',
	styleUrls: ['../auth.styles.css']
})
export class LoginComponent {
	isLoading = false
	private authStatusSub!: Subscription
	private fallbackTimeout: any

	constructor(public authService: AuthService, private router: Router) {}

	ngOnInit() {
		this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
			authStatus => {
				this.isLoading = false
			}
		)
	}

	onLogin(form: NgForm) {
		if (form.invalid) {
			return;
		}

		this.isLoading = true;

		this.authService.login(form.value.email, form.value.password).subscribe({
			next: () => {
				this.isLoading = false;
			},
			error: (error: any) => {
				this.isLoading = false;
				if (error.name === 'TimeoutError') {
					console.log('Login request timed out.');
					this.router.navigate(['/login']).then(() => {});
				}
			}
		});
	}


}
