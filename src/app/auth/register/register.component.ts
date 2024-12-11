import { Component, OnInit } from '@angular/core'
import { NgIf } from "@angular/common"
import { Subscription} from "rxjs"

import {
	FormGroup,
	FormControl,
	ReactiveFormsModule,
	Validators
} from "@angular/forms";
import {AuthService} from "../auth.service";
import {RouterLink} from "@angular/router";

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [
		NgIf,
		ReactiveFormsModule,
		RouterLink
	],
	providers: [
		AuthService
	],
	templateUrl: './register.component.html',
	styleUrls: ['../auth.styles.css']
})

export class RegisterComponent implements OnInit {
	form!: FormGroup
	isLoading = false
	pwdIdentical = true
	userExist = false
	usernameTaken: boolean = false
	private authStatusSub!: Subscription

	constructor(private authService: AuthService) {}

	ngOnInit(): void {
		this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
			authStatus => {
				this.isLoading = false
			}
		)
		this.form = new FormGroup({
			email: new FormControl(null, {
					updateOn: 'change',
					validators: [
						Validators.required,
						Validators.email,
						Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
					]
				}),
			username: new FormControl(null, {
				updateOn: 'change',
				validators: [
					Validators.required
				]
			}),
			pwd: new FormControl(null, {
				updateOn: 'change',
				validators: [Validators.required]
			}),
			pwdConfirm: new FormControl(null, {
				updateOn: 'change',
				validators: [Validators.required]
			})
		})
		this.isLoading = false
	}

	get email() {
		return this.form.get('email');
	}

	get username() {
		return this.form.get('username')
	}

	get pwd() {
		return this.form.get('pwd')
	}

	get pwdConfirm() {
		return this.form.get('pwdConfirm')
	}

	onRegisterUser() {
		this.isLoading = true

		if (this.form.invalid) {
			this.isLoading = false
			alert("The form is invalid")
			// this.isLoading = false
			return
		}

		if (this.form.value.pwd !== this.form.value.pwdConfirm) {
			this.isLoading = false
			alert("The passwords should be identical")
			this.pwdIdentical = false
			// this.isLoading = false
			return
		}

		this.authService
			.isUserExist(this.form.value.email)
			.subscribe(response => {
				this.userExist = response.exists

				if (!this.userExist) {
					this.authService
						.isUsernameTaken(this.form.value.username)
						.subscribe(usernameResponse => {
							this.usernameTaken = usernameResponse.taken
							if (!this.usernameTaken) {
								this.authService.createUser(
									this.form.value.email,
									this.form.value.username,
									this.form.value.pwd
								)
							}
						})
				}
			})
		this.isLoading = false
	}

	onBlurEvent() {
		this.pwdIdentical = this.form.value.pwd === this.form.value.pwdConfirm
	}

	ngOnDestroy() {
		this.authStatusSub.unsubscribe()
	}

}
